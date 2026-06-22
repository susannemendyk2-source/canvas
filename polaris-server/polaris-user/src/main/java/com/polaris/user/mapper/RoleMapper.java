package com.polaris.user.mapper;
import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.user.entity.Role;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RoleMapper extends BaseMapper<Role> {
    @Select("SELECT p.code FROM permission p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = #{roleId}")
    List<String> selectPermissionCodesByRoleId(Long roleId);
}

