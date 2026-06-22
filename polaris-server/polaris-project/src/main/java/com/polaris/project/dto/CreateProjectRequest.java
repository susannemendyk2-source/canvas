package com.polaris.project.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateProjectRequest {
    @NotBlank
    private String name;
    private String description;
    private String mode;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
}
