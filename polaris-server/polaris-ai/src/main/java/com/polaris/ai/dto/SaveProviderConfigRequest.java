package com.polaris.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SaveProviderConfigRequest {

    @NotBlank
    private String provider;

    private String baseUrl;

    private String apiKey;

    private String secretKey;

    private String model;
}
