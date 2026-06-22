package com.polaris.user.mapper;
import org.apache.ibatis.annotations.Mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.polaris.user.entity.Permission;
import com.polaris.user.entity.Role;
import com.polaris.user.entity.User;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT r.* FROM role r JOIN user_role ur ON r.id = ur.role_id WHERE ur.user_id = #{userId}")
    List<Role> selectRolesByUserId(Long userId);

    @Select("SELECT p.* FROM permission p JOIN role_permission rp ON p.id = rp.permission_id JOIN user_role ur ON rp.role_id = ur.role_id WHERE ur.user_id = #{userId}")
    List<Permission> selectPermissionsByUserId(Long userId);
}

