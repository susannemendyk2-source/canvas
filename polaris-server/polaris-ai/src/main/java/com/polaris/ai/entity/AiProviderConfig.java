package com.polaris.ai.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@TableName("ai_provider_config")
public class AiProviderConfig {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String provider;

    private String baseUrl;

    private String apiKeyEnc;

    private String model;

    private Integer isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
