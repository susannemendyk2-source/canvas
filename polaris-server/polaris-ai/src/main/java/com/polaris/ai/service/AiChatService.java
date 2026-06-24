package com.polaris.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.polaris.ai.dto.ChatRequest;
import com.polaris.ai.dto.ChatResponse;
import java.util.Map;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiChatService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AiProviderService aiProviderService;

    public AiChatService(AiProviderService aiProviderService) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.aiProviderService = aiProviderService;
    }

    public ChatResponse chat(ChatRequest req) {
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            AiProviderService.ResolvedConfig rc = aiProviderService.resolveConfig(req.getUserId(), req.getModel());
            if (rc != null) {
                if (req.getBaseUrl() == null || req.getBaseUrl().isBlank()) req.setBaseUrl(rc.getBaseUrl());
                if (req.getApiKey() == null || req.getApiKey().isBlank()) req.setApiKey(rc.getApiKey());
                if (req.getModel() == null || req.getModel().isBlank()) req.setModel(rc.getModel());
            }
        }

        String baseUrl = req.getBaseUrl();
        if (baseUrl == null || baseUrl.isBlank()) baseUrl = "https://api.deepseek.com";
        if (req.getApiKey() == null || req.getApiKey().isBlank()) {
            ChatResponse r = new ChatResponse();
            r.setContent("Error: API key not configured. Please save your Chat API settings.");
            return r;
        }
        String url = baseUrl.replaceAll("/+$", "") + "/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(req.getApiKey());

        Map<String, Object> body = new java.util.HashMap<>();
        body.put("model", req.getModel() != null ? req.getModel() : "deepseek-v4-flash");
        body.put("messages", req.getMessages());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            String content = root.path("choices").get(0).path("message").path("content").asText();

            ChatResponse chatResp = new ChatResponse();
            chatResp.setContent(content);
            chatResp.setRaw(response.getBody());
            return chatResp;
        } catch (Exception e) {
            ChatResponse chatResp = new ChatResponse();
            chatResp.setContent("Error: " + e.getMessage());
            chatResp.setRaw(null);
            return chatResp;
        }
    }
}
