package com.polaris.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.workflow.entity.WorkflowNode;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface WorkflowNodeMapper extends BaseMapper<WorkflowNode> {

    @Select("SELECT * FROM workflow_node WHERE workflow_id = #{workflowId} ORDER BY id ASC")
    List<WorkflowNode> selectByWorkflowId(Long workflowId);
}
