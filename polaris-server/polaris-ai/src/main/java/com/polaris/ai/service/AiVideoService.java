package com.polaris.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.ai.dto.VideoGenerateRequest;
import com.polaris.ai.dto.VideoGenerateResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiVideoService {

    private static final Logger log = LoggerFactory.getLogger(AiVideoService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AiProviderService aiProviderService;

    public AiVideoService(AiProviderService aiProviderService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.aiProviderService = aiProviderService;
    }

    public VideoGenerateResponse generate(VideoGenerateRequest req) {
        System.out.println("[[[AiVideoService.generate ENTERED]]] prompt=" + req.getPrompt());
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            AiProviderService.ResolvedConfig rc = aiProviderService.resolveConfig(req.getUserId(), req.getModel());
            if (rc != null) {
                if (req.getBaseUrl() == null || req.getBaseUrl().isBlank()) req.setBaseUrl(rc.getBaseUrl());
                if (req.getApiKey() == null || req.getApiKey().isBlank()) req.setApiKey(rc.getApiKey());
                if (rc.getModel() != null && !rc.getModel().isBlank()) req.setModel(rc.getModel());
            }
        }

        String baseUrl = req.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) baseUrl = "https://api.openai.com";
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            log.error("Video generate failed: API key not configured");
            VideoGenerateResponse r = new VideoGenerateResponse();
            r.setError("API key not configured. Please save API settings.");
            return r;
        }

        boolean isArk = baseUrl.contains("ark.cn-beijing.volces.com");
        String url = baseUrl.replaceAll("/+$", "");
        if (isArk) {
            url += "/contents/generations/tasks";
        } else if (!url.endsWith("/video/generations")) {
            url += "/v1/video/generations";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(req.getApiKey());

        HttpEntity<?> entity;
        String requestBody;
        if (isArk) {
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("model", req.getModel() != null ? req.getModel() : "doubao-seedance-2-0");
            java.util.List<Map<String, Object>> content = new java.util.ArrayList<>();
            Map<String, Object> textItem = new java.util.HashMap<>();
            textItem.put("type", "text");
            textItem.put("text", req.getPrompt() != null ? req.getPrompt() : "");
            content.add(textItem);
            if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) {
                Map<String, Object> imageItem = new java.util.HashMap<>();
                imageItem.put("type", "image_url");
                Map<String, String> imageUrlMap = new java.util.HashMap<>();
                imageUrlMap.put("url", req.getImageUrl());
                imageItem.put("image_url", imageUrlMap);
                content.add(imageItem);
            }
            body.put("content", content);
            body.put("duration", req.getDuration() != null && req.getDuration() > 0 ? req.getDuration() : 5);
            if (req.getResolution() != null && !req.getResolution().isBlank()) {
                body.put("resolution", req.getResolution());
            }
            if (req.getRatio() != null && !req.getRatio().isBlank()) {
                body.put("ratio", req.getRatio());
            }
            entity = new HttpEntity<>(body, headers);
            try { requestBody = objectMapper.writeValueAsString(body); } catch (Exception e) { requestBody = body.toString(); }
        } else {
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("model", req.getModel() != null ? req.getModel() : "dall-e-3");
            body.put("prompt", req.getPrompt() != null ? req.getPrompt() : "");
            body.put("n", 1);
            entity = new HttpEntity<>(body, headers);
            try { requestBody = objectMapper.writeValueAsString(body); } catch (Exception e) { requestBody = body.toString(); }
        }
        System.out.println("[[[AiVideoService.generate CALLED]]] url=" + url + " body=" + requestBody);
        log.info("Video generate request: POST {} | body={}", url, requestBody);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            String respBody = response.getBody();
            log.info("Video generate response: status={} body={}", response.getStatusCode(), respBody);
            JsonNode root = objectMapper.readTree(respBody);
            VideoGenerateResponse resp = new VideoGenerateResponse();
            JsonNode errNode = root.path("error");
            if (!errNode.isMissingNode()) {
                String errMsg = errNode.path("message").asText(null);
                if (errMsg == null) errMsg = errNode.path("code").asText(null);
                if (errMsg == null) errMsg = root.toString();
                log.error("Video generate returned error: {}", errMsg);
                resp.setError(errMsg);
                return resp;
            }
            String taskId = root.path("id").asText(null);
            if (taskId == null) taskId = root.path("task_id").asText(null);
            if (isArk) {
                resp.setTaskId(taskId);
                resp.setStatus(root.path("status").asText(null));
                log.info("Video task created: id={} status={}", taskId, resp.getStatus());
            } else {
                resp.setTaskId(taskId);
                resp.setStatus(root.path("status").asText(null));
                JsonNode data = root.path("data");
                if (data.isArray() && data.size() > 0) {
                    resp.setUrl(data.get(0).path("url").asText(null));
                }
            }
            return resp;
        } catch (Exception e) {
            log.error("Video generate exception: {}", e.getMessage(), e);
            VideoGenerateResponse resp = new VideoGenerateResponse();
            resp.setError(e.getMessage());
            return resp;
        }
    }

    public VideoGenerateResponse getTaskStatus(String baseUrl, String apiKey, String taskId, Long userId) {
        System.out.println("[[[AiVideoService.getTaskStatus ENTERED]]] taskId=" + taskId);
        if ((apiKey == null || apiKey.isBlank()) && userId != null) {
            AiProviderService.ResolvedConfig rc = aiProviderService.resolveConfig(userId, "video");
            if (rc != null) {
                if (baseUrl == null || baseUrl.isBlank()) baseUrl = rc.getBaseUrl();
                if (apiKey == null || apiKey.isBlank()) apiKey = rc.getApiKey();
            }
        }
        if (baseUrl == null || baseUrl.isBlank()) baseUrl = "https://api.openai.com";
        if (apiKey == null || apiKey.isBlank()) {
            log.error("Task status failed: API key not configured");
            VideoGenerateResponse r = new VideoGenerateResponse();
            r.setError("API key not configured");
            return r;
        }
        boolean isArk = baseUrl.contains("ark.cn-beijing.volces.com");
        String url = baseUrl.replaceAll("/+$", "");
        if (isArk) {
            url += "/contents/generations/tasks/" + taskId;
        } else if (!url.endsWith("/video/generations")) {
            url += "/v1/video/generations/" + taskId;
        } else {
            url += "/" + taskId;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            String respBody = response.getBody();
            log.info("Task status response: taskId={} status={} body={}", taskId, response.getStatusCode(), respBody);
            JsonNode root = objectMapper.readTree(respBody);
            VideoGenerateResponse resp = new VideoGenerateResponse();
            JsonNode errNode = root.path("error");
            if (!errNode.isMissingNode()) {
                String err = errNode.path("message").asText(root.toString());
                log.error("Task status returned error: {}", err);
                resp.setError(err);
                return resp;
            }
            resp.setTaskId(root.path("id").asText(null));
            String status = root.path("status").asText(null);
            resp.setStatus(status);
            // Capture ARK error when task status is "failed"
            if ("failed".equals(status) && isArk) {
                JsonNode arkErr = root.path("error");
                if (!arkErr.isMissingNode()) {
                    resp.setError(arkErr.path("message").asText(root.path("error_message").asText(null)));
                } else {
                    String errMsg = root.path("error_message").asText(null);
                    if (errMsg == null) errMsg = root.path("message").asText(null);
                    if (errMsg == null) errMsg = "Task " + status;
                    resp.setError(errMsg);
                }
                log.error("Task {} failed: {}", taskId, resp.getError());
                return resp;
            }
            if (isArk) {
                JsonNode content = root.path("content");
                if (!content.isMissingNode()) {
                    String videoUrl = content.path("video_url").asText(null);
                    if (videoUrl == null) videoUrl = content.path("url").asText(null);
                    if (videoUrl == null) videoUrl = content.path("video").asText(null);
                    resp.setUrl(videoUrl);
                }
                if (resp.getUrl() != null) {
                    log.info("Task {} succeeded, video URL available", taskId);
                }
            } else {
                JsonNode data = root.path("data");
                if (data.isArray() && data.size() > 0) {
                    resp.setUrl(data.get(0).path("url").asText(null));
                }
            }
            return resp;
        } catch (Exception e) {
            log.error("Task status exception for {}: {}", taskId, e.getMessage(), e);
            VideoGenerateResponse resp = new VideoGenerateResponse();
            resp.setError(e.getMessage());
            return resp;
        }
    }
}
