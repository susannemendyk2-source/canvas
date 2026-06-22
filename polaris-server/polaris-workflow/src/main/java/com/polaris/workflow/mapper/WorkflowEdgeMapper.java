package com.polaris.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.workflow.entity.WorkflowEdge;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WorkflowEdgeMapper extends BaseMapper<WorkflowEdge> {

    @Select("SELECT * FROM workflow_edge WHERE workflow_id = #{workflowId}")
    List<WorkflowEdge> selectByWorkflowId(Long workflowId);
}
