package com.polaris.ai.dto;

import lombok.Data;

@Data
public class ImageGenerateResponse {
    private String url;
    private String b64Json;
    private String error;
}
