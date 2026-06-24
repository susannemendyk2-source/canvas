package com.polaris.ai.dto;

import java.util.List;
import lombok.Data;

@Data
public class ChatRequest {

    private String baseUrl;

    private String apiKey;

    private String model;

    private List<ChatMessage> messages;

    private Long userId;

    @Data
    public static class ChatMessage {

        private String role;

        private String content;
    }
}
