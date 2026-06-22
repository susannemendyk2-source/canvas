package com.polaris.asset.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.asset.entity.Asset;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface AssetMapper extends BaseMapper<Asset> {
    @Select("SELECT * FROM asset WHERE user_id = #{userId} ORDER BY created_at DESC")
    List<Asset> selectByUserId(Long userId);
}
