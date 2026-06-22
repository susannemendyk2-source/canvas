package com.polaris.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("canvas_object")
public class CanvasObject {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long projectId;
    private String type;
    private String title;
    private String content;
    private Double positionX;
    private Double positionY;
    private Double width = 320.0;
    private Double height = 220.0;
    private String meta;
    private Integer sort;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
