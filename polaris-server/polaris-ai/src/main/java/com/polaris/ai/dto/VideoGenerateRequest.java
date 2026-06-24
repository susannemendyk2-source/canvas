package com.polaris.ai.dto;

import lombok.Data;

@Data
public class VideoGenerateRequest {
    private String baseUrl;
    private String apiKey;
    private String model;
    private String prompt;
    private String imageUrl;
    private Integer duration;
    private String resolution;
    private String ratio;
    private Long userId;
}
