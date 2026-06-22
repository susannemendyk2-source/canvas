package com.polaris.ai.dto;

import lombok.Data;

@Data
public class AiProviderConfigDTO {

    private Long id;

    private String provider;

    private String baseUrl;

    private String model;

    private Integer isActive;
}
