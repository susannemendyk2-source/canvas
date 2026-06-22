package com.polaris.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("permission")
public class Permission {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String code;
    private Integer type;
    private Long parentId;
    private String path;
    private String apiPath;
    private String method;
    private Integer sort;
    private LocalDateTime createdAt;
}
