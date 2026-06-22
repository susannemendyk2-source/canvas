package com.polaris.workflow.dto;

import lombok.Data;

@Data
public class WorkflowEdgeDTO {

    private Long id;

    private Long workflowId;

    private Long sourceNodeId;

    private Long targetNodeId;

    private String sourceHandle;

    private String targetHandle;
}
