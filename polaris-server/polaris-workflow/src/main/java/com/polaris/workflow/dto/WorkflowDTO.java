package com.polaris.workflow.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class WorkflowDTO {

    private Long id;

    private Long projectId;

    private String name;

    private List<WorkflowNodeDTO> nodes;

    private List<WorkflowEdgeDTO> edges;

    private LocalDateTime createdAt;
}
