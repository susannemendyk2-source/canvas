package com.polaris.workflow.controller;

import com.polaris.common.response.R;
import com.polaris.workflow.dto.SaveWorkflowRequest;
import com.polaris.workflow.dto.WorkflowDTO;
import com.polaris.workflow.dto.WorkflowNodeDTO;
import com.polaris.workflow.service.WorkflowService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects/{projectId}/workflow")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public R<WorkflowDTO> getWorkflow(@PathVariable Long projectId) {
        return R.success(workflowService.getWorkflow(projectId));
    }

    @PutMapping
    public R<Void> saveWorkflow(@PathVariable Long projectId, @Valid @RequestBody SaveWorkflowRequest request) {
        request.setProjectId(projectId);
        workflowService.saveWorkflow(request);
        return R.success();
    }

    @PostMapping("/run")
    public R<Void> runWorkflow(@PathVariable Long projectId) {
        WorkflowDTO workflow = workflowService.getWorkflow(projectId);
        workflowService.runWorkflow(workflow.getId());
        return R.success();
    }

    @GetMapping("/status")
    public R<List<WorkflowNodeDTO>> getWorkflowStatus(@PathVariable Long projectId) {
        WorkflowDTO workflow = workflowService.getWorkflow(projectId);
        return R.success(workflowService.getWorkflowStatus(workflow.getId()));
    }
}
