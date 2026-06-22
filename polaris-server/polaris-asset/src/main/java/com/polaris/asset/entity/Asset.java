package com.polaris.asset.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("asset")
public class Asset {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long projectId;
    private String type;
    private String title;
    private String fileKey;
    private String url;
    private Long size;
    private String mimeType;
    private Integer favorite = 0;
    private LocalDateTime createdAt;
}
