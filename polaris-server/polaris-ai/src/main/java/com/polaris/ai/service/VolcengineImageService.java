package com.polaris.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.ai.dto.ImageGenerateRequest;
import com.polaris.ai.dto.ImageGenerateResponse;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class VolcengineImageService {

    static {
        System.setProperty("jdk.httpclient.allowRestrictedHeaders", "host");
    }

    private static final String SERVICE = "cv";
    private static final String REGION = "cn-north-1";
    private static final String SUBMIT_ACTION = "CVSync2AsyncSubmitTask";
    private static final String QUERY_ACTION = "CVSync2AsyncGetResult";
    private static final String VERSION = "2022-08-31";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ImageGenerateResponse generate(ImageGenerateRequest req) {
        String baseUrl = (req.getBaseUrl() != null && !req.getBaseUrl().isBlank()) ? req.getBaseUrl().replaceAll("/+$", "") : "https://visual.volcengineapi.com";
        String accessKey = req.getApiKey() != null ? req.getApiKey().trim() : null;
        String secretKey = req.getSecretKey() != null ? req.getSecretKey().trim() : null;
        String model = req.getModel() != null ? req.getModel() : "jimeng_4_0";

        String reqKey = modelToReqKey(model);
        int[] wh = parseSize(req.getSize());

        try {
            // Submit task
            Map<String, Object> submitBody = new java.util.LinkedHashMap<>();
            submitBody.put("req_key", reqKey);
            submitBody.put("prompt", req.getPrompt() != null ? req.getPrompt() : "");
            submitBody.put("force_single", true);
            if (wh != null) {
                submitBody.put("width", wh[0]);
                submitBody.put("height", wh[1]);
            }

            String submitUrl = baseUrl + "?Action=" + SUBMIT_ACTION + "&Version=" + VERSION;
            String jsonBody = objectMapper.writeValueAsString(submitBody);
            String submitResp = doRequest(submitUrl, "POST", objectMapper.writeValueAsString(submitBody), accessKey, secretKey);

            JsonNode submitJson = objectMapper.readTree(submitResp);
            int code = submitJson.path("code").asInt();
            if (code != 10000) {
                ImageGenerateResponse resp = new ImageGenerateResponse();
                resp.setError("Submit failed: code=" + code + " msg=" + submitJson.path("message").asText("") + " raw=" + submitResp);
                return resp;
            }

            String taskId = submitJson.path("data").path("task_id").asText(null);
            if (taskId == null) {
                ImageGenerateResponse resp = new ImageGenerateResponse();
                resp.setError("No task_id in submit response");
                return resp;
            }

            // Poll for result
            String queryUrl = baseUrl + "?Action=" + QUERY_ACTION + "&Version=" + VERSION;
            Map<String, Object> queryBody = new java.util.LinkedHashMap<>();
            queryBody.put("req_key", reqKey);
            queryBody.put("task_id", taskId);

            int maxAttempts = 60;
            for (int i = 0; i < maxAttempts; i++) {
                Thread.sleep(2000);
                String queryResp = doRequest(queryUrl, "POST", objectMapper.writeValueAsString(queryBody), accessKey, secretKey);
                JsonNode queryJson = objectMapper.readTree(queryResp);
                int queryCode = queryJson.path("code").asInt();
                if (queryCode != 10000) {
                    ImageGenerateResponse resp = new ImageGenerateResponse();
                    resp.setError("Query failed: code=" + queryCode + " msg=" + queryJson.path("message").asText("") + " raw=" + queryResp);
                    return resp;
                }
                String status = queryJson.path("data").path("status").asText("");
                if ("done".equals(status)) {
                    JsonNode urls = queryJson.path("data").path("image_urls");
                    if (urls.isArray() && urls.size() > 0) {
                        ImageGenerateResponse resp = new ImageGenerateResponse();
                        resp.setUrl(urls.get(0).asText());
                        return resp;
                    }
                    // Fallback to base64
                    JsonNode b64Arr = queryJson.path("data").path("binary_data_base64");
                    if (b64Arr.isArray() && b64Arr.size() > 0) {
                        ImageGenerateResponse resp = new ImageGenerateResponse();
                        resp.setB64Json(b64Arr.get(0).asText());
                        return resp;
                    }
                    ImageGenerateResponse resp = new ImageGenerateResponse();
                    resp.setError("Done but no image data");
                    return resp;
                }
                if ("failed".equals(status) || "expired".equals(status) || "not_found".equals(status)) {
                    ImageGenerateResponse resp = new ImageGenerateResponse();
                    resp.setError("Task " + status);
                    return resp;
                }
                // in_queue or generating — keep polling
            }
            ImageGenerateResponse resp = new ImageGenerateResponse();
            resp.setError("Task timed out");
            return resp;
        } catch (Exception e) {
            ImageGenerateResponse resp = new ImageGenerateResponse();
            resp.setError(e.getMessage());
            return resp;
        }
    }

    private String modelToReqKey(String model) {
        if (model == null) return "jimeng_t2i_v40";
        if (model.contains("5.0") || model.contains("v5")) return "jimeng_t2i_v50";
        if (model.contains("agent")) return "jimeng_t2i_agent";
        return "jimeng_t2i_v40";
    }

    private int[] parseSize(String size) {
        if (size == null || size.isBlank()) return null;
        String[] parts = size.split("x");
        if (parts.length != 2) return null;
        try {
            return new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])};
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String doRequest(String url, String method, String body, String accessKey, String secretKey) throws Exception {
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("UTC"));
        String xDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
        String shortDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        String contentSha256 = sha256Hex(body);

        // Canonical request
        URI uri = new URI(url);
        String canonicalUri = uri.getPath().isEmpty() ? "/" : uri.getPath();
        String canonicalQuery = uri.getQuery() != null ? uri.getQuery() : "";
        String signedHeaders = "content-type;host;x-content-sha256;x-date";
        String canonicalHeaders = "content-type:application/json\n"
                + "host:" + uri.getHost() + "\n"
                + "x-content-sha256:" + contentSha256 + "\n"
                + "x-date:" + xDate + "\n";
        String canonicalRequest = method + "\n" + canonicalUri + "\n" + canonicalQuery + "\n"
                + canonicalHeaders + "\n" + signedHeaders + "\n" + contentSha256;
        String crHash = sha256Hex(canonicalRequest);

        // String to sign
        String algorithm = "HMAC-SHA256";
        String credentialScope = shortDate + "/" + REGION + "/" + SERVICE + "/request";
        String stringToSign = algorithm + "\n" + xDate + "\n" + credentialScope + "\n" + crHash;

        // Signing key
        byte[] kSecret = ("AWS4" + secretKey).getBytes(StandardCharsets.UTF_8);
        byte[] kDate = hmacSha256(kSecret, shortDate);
        byte[] kRegion = hmacSha256(kDate, REGION);
        byte[] kService = hmacSha256(kRegion, SERVICE);
        byte[] kSigning = hmacSha256(kService, "request");
        String signature = bytesToHex(hmacSha256(kSigning, stringToSign));

        String authorization = algorithm + " Credential=" + accessKey + "/" + credentialScope
                + ", SignedHeaders=" + signedHeaders + ", Signature=" + signature;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(uri)
                .header("Host", uri.getHost())
                .header("X-Date", xDate)
                .header("X-Content-Sha256", contentSha256)
                .header("Authorization", authorization)
                .header("Content-Type", "application/json");

        if ("POST".equalsIgnoreCase(method)) {
            builder.POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8));
        } else {
            builder.GET();
        }

        HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        return response.body();
    }

    private String sha256Hex(String data) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return bytesToHex(md.digest(data.getBytes(StandardCharsets.UTF_8)));
    }

    private byte[] hmacSha256(byte[] key, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(key, "HmacSHA256"));
        return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
