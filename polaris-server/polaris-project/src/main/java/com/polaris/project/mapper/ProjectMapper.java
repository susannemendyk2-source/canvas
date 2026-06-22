package com.polaris.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.project.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface ProjectMapper extends BaseMapper<Project> {
    @Select("SELECT * FROM project WHERE user_id = #{userId} ORDER BY updated_at DESC")
    List<Project> selectByUserId(Long userId);
}
