package com.polaris.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.ai.dto.ImageGenerateRequest;
import com.polaris.ai.dto.ImageGenerateResponse;
import java.util.Map;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiImageService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final VolcengineImageService volcengineImageService;
    private final AiProviderService aiProviderService;

    public AiImageService(VolcengineImageService volcengineImageService,
                          AiProviderService aiProviderService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.volcengineImageService = volcengineImageService;
        this.aiProviderService = aiProviderService;
    }

    public ImageGenerateResponse generate(ImageGenerateRequest req) {
        // Resolve config from DB if no apiKey provided
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            AiProviderService.ResolvedConfig rc = aiProviderService.resolveConfig(req.getUserId(), req.getModel());
            if (rc != null) {
                if (req.getBaseUrl() == null || req.getBaseUrl().isBlank()) req.setBaseUrl(rc.getBaseUrl());
                if (req.getApiKey() == null || req.getApiKey().isBlank()) req.setApiKey(rc.getApiKey());
                if (req.getSecretKey() == null || req.getSecretKey().isBlank()) req.setSecretKey(rc.getSecretKey());
                if (req.getProvider() == null || req.getProvider().isBlank()) req.setProvider(rc.getProvider());
                if (rc.getModel() != null && !rc.getModel().isBlank()) req.setModel(rc.getModel());
            }
        }

        // Route to Volcengine 即梦 service if provider matches
        if ("volcengine-jimeng".equals(req.getProvider()) || "image-volcengine-jimeng".equals(req.getProvider())) {
            return volcengineImageService.generate(req);
        }

        // Default OpenAI-compatible flow
        String baseUrl = req.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) baseUrl = "https://api.openai.com";
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            ImageGenerateResponse r = new ImageGenerateResponse();
            r.setError("API key not configured. Please save API settings.");
            return r;
        }
        String url = baseUrl.replaceAll("/+$", "");
        if (!url.endsWith("/images/generations")) url += "/v1/images/generations";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (req.getApiKey() != null) headers.setBearerAuth(req.getApiKey());

        Map<String, Object> body = new java.util.HashMap<>();
        body.put("model", req.getModel() != null ? req.getModel() : "dall-e-3");
        body.put("prompt", req.getPrompt() != null ? req.getPrompt() : "");
        body.put("n", 1);
        body.put("size", req.getSize() != null ? req.getSize() : "1024x1024");
        body.put("response_format", "url");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode data = root.path("data").get(0);

            ImageGenerateResponse resp = new ImageGenerateResponse();
            resp.setUrl(data.path("url").asText(null));
            resp.setB64Json(data.path("b64_json").asText(null));
            return resp;
        } catch (Exception e) {
            ImageGenerateResponse resp = new ImageGenerateResponse();
            resp.setError(e.getMessage());
            return resp;
        }
    }
}
