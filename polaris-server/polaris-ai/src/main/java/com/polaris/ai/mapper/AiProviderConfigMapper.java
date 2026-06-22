package com.polaris.ai.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.ai.entity.AiProviderConfig;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AiProviderConfigMapper extends BaseMapper<AiProviderConfig> {

    @Select("SELECT * FROM ai_provider_config WHERE user_id = #{userId} AND provider = #{provider}")
    AiProviderConfig selectByUserAndProvider(@Param("userId") Long userId, @Param("provider") String provider);
}
