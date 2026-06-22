package com.polaris.workflow.service;

import com.polaris.workflow.dto.SaveWorkflowRequest;
import com.polaris.workflow.dto.WorkflowDTO;
import com.polaris.workflow.dto.WorkflowEdgeDTO;
import com.polaris.workflow.dto.WorkflowNodeDTO;
import com.polaris.workflow.entity.Workflow;
import com.polaris.workflow.entity.WorkflowEdge;
import com.polaris.workflow.entity.WorkflowNode;
import com.polaris.workflow.mapper.WorkflowEdgeMapper;
import com.polaris.workflow.mapper.WorkflowMapper;
import com.polaris.workflow.mapper.WorkflowNodeMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkflowService {

    private final WorkflowMapper workflowMapper;
    private final WorkflowNodeMapper workflowNodeMapper;
    private final WorkflowEdgeMapper workflowEdgeMapper;

    public WorkflowService(WorkflowMapper workflowMapper,
                           WorkflowNodeMapper workflowNodeMapper,
                           WorkflowEdgeMapper workflowEdgeMapper) {
        this.workflowMapper = workflowMapper;
        this.workflowNodeMapper = workflowNodeMapper;
        this.workflowEdgeMapper = workflowEdgeMapper;
    }

    public WorkflowDTO getWorkflow(Long projectId) {
        Workflow workflow = workflowMapper.selectByProjectId(projectId);
        if (workflow == null) {
            workflow = new Workflow();
            workflow.setProjectId(projectId);
            workflow.setName("default");
            workflow.setCreatedAt(LocalDateTime.now());
            workflow.setUpdatedAt(LocalDateTime.now());
            workflowMapper.insert(workflow);
        }

        List<WorkflowNodeDTO> nodeDTOs = new ArrayList<>();
        List<WorkflowEdgeDTO> edgeDTOs = new ArrayList<>();

        List<WorkflowNode> nodes = workflowNodeMapper.selectByWorkflowId(workflow.getId());
        if (nodes != null) {
            nodeDTOs = nodes.stream().map(this::toNodeDTO).collect(Collectors.toList());
        }

        List<WorkflowEdge> edges = workflowEdgeMapper.selectByWorkflowId(workflow.getId());
        if (edges != null) {
            edgeDTOs = edges.stream().map(this::toEdgeDTO).collect(Collectors.toList());
        }

        WorkflowDTO dto = new WorkflowDTO();
        dto.setId(workflow.getId());
        dto.setProjectId(workflow.getProjectId());
        dto.setName(workflow.getName());
        dto.setNodes(nodeDTOs);
        dto.setEdges(edgeDTOs);
        dto.setCreatedAt(workflow.getCreatedAt());
        return dto;
    }

    @Transactional
    public void saveWorkflow(SaveWorkflowRequest req) {
        LocalDateTime now = LocalDateTime.now();
        Workflow workflow = workflowMapper.selectByProjectId(req.getProjectId());
        if (workflow == null) {
            workflow = new Workflow();
            workflow.setProjectId(req.getProjectId());
            workflow.setName(req.getName() != null ? req.getName() : "default");
            workflow.setCreatedAt(now);
            workflow.setUpdatedAt(now);
            workflowMapper.insert(workflow);
        } else {
            workflow.setName(req.getName() != null ? req.getName() : workflow.getName());
            workflow.setUpdatedAt(now);
            workflowMapper.updateById(workflow);
        }

        Long workflowId = workflow.getId();

        List<WorkflowNode> existingNodes = workflowNodeMapper.selectByWorkflowId(workflowId);
        if (existingNodes != null && !existingNodes.isEmpty()) {
            workflowNodeMapper.deleteBatchIds(existingNodes.stream().map(WorkflowNode::getId).collect(Collectors.toList()));
        }

        List<WorkflowEdge> existingEdges = workflowEdgeMapper.selectByWorkflowId(workflowId);
        if (existingEdges != null && !existingEdges.isEmpty()) {
            workflowEdgeMapper.deleteBatchIds(existingEdges.stream().map(WorkflowEdge::getId).collect(Collectors.toList()));
        }

        if (req.getNodes() != null) {
            for (WorkflowNodeDTO nd : req.getNodes()) {
                WorkflowNode node = new WorkflowNode();
                node.setWorkflowId(workflowId);
                node.setNodeType(nd.getNodeType());
                node.setLabel(nd.getLabel());
                node.setPositionX(nd.getPositionX());
                node.setPositionY(nd.getPositionY());
                node.setConfig(nd.getConfig());
                node.setStatus("idle");
                node.setCreatedAt(now);
                workflowNodeMapper.insert(node);
            }
        }

        if (req.getEdges() != null) {
            for (WorkflowEdgeDTO ed : req.getEdges()) {
                WorkflowEdge edge = new WorkflowEdge();
                edge.setWorkflowId(workflowId);
                edge.setSourceNodeId(ed.getSourceNodeId());
                edge.setTargetNodeId(ed.getTargetNodeId());
                edge.setSourceHandle(ed.getSourceHandle());
                edge.setTargetHandle(ed.getTargetHandle());
                workflowEdgeMapper.insert(edge);
            }
        }
    }

    public void runWorkflow(Long workflowId) {
        List<WorkflowNode> nodes = workflowNodeMapper.selectByWorkflowId(workflowId);
        if (nodes == null) return;

        for (WorkflowNode node : nodes) {
            node.setStatus("running");
            workflowNodeMapper.updateById(node);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            node.setStatus("success");
            workflowNodeMapper.updateById(node);
        }
    }

    public List<WorkflowNodeDTO> getWorkflowStatus(Long workflowId) {
        List<WorkflowNode> nodes = workflowNodeMapper.selectByWorkflowId(workflowId);
        if (nodes == null) return new ArrayList<>();
        return nodes.stream().map(this::toNodeDTO).collect(Collectors.toList());
    }

    private WorkflowNodeDTO toNodeDTO(WorkflowNode node) {
        WorkflowNodeDTO dto = new WorkflowNodeDTO();
        dto.setId(node.getId());
        dto.setWorkflowId(node.getWorkflowId());
        dto.setNodeType(node.getNodeType());
        dto.setLabel(node.getLabel());
        dto.setPositionX(node.getPositionX());
        dto.setPositionY(node.getPositionY());
        dto.setConfig(node.getConfig());
        dto.setStatus(node.getStatus());
        return dto;
    }

    private WorkflowEdgeDTO toEdgeDTO(WorkflowEdge edge) {
        WorkflowEdgeDTO dto = new WorkflowEdgeDTO();
        dto.setId(edge.getId());
        dto.setWorkflowId(edge.getWorkflowId());
        dto.setSourceNodeId(edge.getSourceNodeId());
        dto.setTargetNodeId(edge.getTargetNodeId());
        dto.setSourceHandle(edge.getSourceHandle());
        dto.setTargetHandle(edge.getTargetHandle());
        return dto;
    }
}
