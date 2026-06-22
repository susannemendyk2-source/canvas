package com.polaris.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("project")
public class Project {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String name;
    private String description;
    private String mode = "magic-canvas";
    private String cover;
    private Integer isTemplate = 0;
    private Integer isPublic = 0;
    private Integer status = 1;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
