package com.polaris.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.project.entity.CanvasObject;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface CanvasObjectMapper extends BaseMapper<CanvasObject> {
    @Select("SELECT * FROM canvas_object WHERE project_id = #{projectId} ORDER BY sort ASC")
    List<CanvasObject> selectByProjectId(Long projectId);
}
