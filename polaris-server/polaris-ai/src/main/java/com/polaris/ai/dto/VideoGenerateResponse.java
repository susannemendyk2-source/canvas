package com.polaris.ai.dto;

import lombok.Data;

@Data
public class VideoGenerateResponse {
    private String url;
    private String taskId;
    private String status;
    private String error;
}
