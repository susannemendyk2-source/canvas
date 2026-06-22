package com.polaris.workflow.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class WorkflowNodeDTO {

    private Long id;

    private Long workflowId;

    private String nodeType;

    private String label;

    private Double positionX;

    private Double positionY;

    private String config;

    private String status;
}
