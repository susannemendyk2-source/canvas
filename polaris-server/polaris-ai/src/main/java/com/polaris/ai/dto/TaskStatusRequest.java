package com.polaris.ai.dto;

import lombok.Data;

@Data
public class TaskStatusRequest {
    private String baseUrl;
    private String apiKey;
    private String taskId;
    private Long userId;
}
