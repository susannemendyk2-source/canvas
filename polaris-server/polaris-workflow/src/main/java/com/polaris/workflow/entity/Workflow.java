package com.polaris.workflow.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("workflow")
public class Workflow {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long projectId;

    private String name;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
