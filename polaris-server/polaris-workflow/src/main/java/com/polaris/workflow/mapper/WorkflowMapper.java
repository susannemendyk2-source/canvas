package com.polaris.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.workflow.entity.Workflow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WorkflowMapper extends BaseMapper<Workflow> {

    @Select("SELECT * FROM workflow WHERE project_id = #{projectId}")
    Workflow selectByProjectId(Long projectId);
}
