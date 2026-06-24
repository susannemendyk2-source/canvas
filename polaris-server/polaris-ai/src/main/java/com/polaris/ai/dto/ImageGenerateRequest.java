package com.polaris.ai.dto;

import lombok.Data;

@Data
public class ImageGenerateRequest {
    private String baseUrl;
    private String apiKey;
    private String secretKey;
    private String provider;
    private String model;
    private String prompt;
    private String size;
    private Long userId;
}
