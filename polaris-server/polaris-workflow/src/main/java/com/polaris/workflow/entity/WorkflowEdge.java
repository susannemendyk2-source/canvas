package com.polaris.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("workflow_edge")
public class WorkflowEdge {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long workflowId;

    private Long sourceNodeId;

    private Long targetNodeId;

    private String sourceHandle;

    private String targetHandle;
}
