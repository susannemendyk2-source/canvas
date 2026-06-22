package com.polaris.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("workflow_node")
public class WorkflowNode {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long workflowId;

    private String nodeType;

    private String label;

    private Double positionX;

    private Double positionY;

    private String config;

    private String status;

    private LocalDateTime createdAt;
}
