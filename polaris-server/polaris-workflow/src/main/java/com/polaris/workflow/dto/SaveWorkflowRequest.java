package com.polaris.workflow.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

@Data
public class SaveWorkflowRequest {

    @NotNull
    private Long projectId;

    private String name;

    private List<WorkflowNodeDTO> nodes;

    private List<WorkflowEdgeDTO> edges;
}
