package com.polaris.auth.security;

import com.polaris.user.entity.Role;
import com.polaris.user.entity.User;
import com.polaris.user.entity.UserRole;
import com.polaris.user.mapper.RoleMapper;
import com.polaris.user.mapper.UserMapper;
import com.polaris.user.mapper.UserRoleMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;

    public CustomUserDetailsService(UserMapper userMapper, UserRoleMapper userRoleMapper, RoleMapper roleMapper) {
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.roleMapper = roleMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        LambdaQueryWrapper<UserRole> urQuery = new LambdaQueryWrapper<>();
        urQuery.eq(UserRole::getUserId, user.getId());
        List<UserRole> userRoles = userRoleMapper.selectList(urQuery);

        List<String> roleCodes;
        if (userRoles.isEmpty()) {
            roleCodes = Collections.singletonList("USER");
        } else {
            List<Long> roleIds = userRoles.stream().map(UserRole::getRoleId).collect(Collectors.toList());
            LambdaQueryWrapper<Role> rQuery = new LambdaQueryWrapper<>();
            rQuery.in(Role::getId, roleIds);
            roleCodes = roleMapper.selectList(rQuery).stream().map(Role::getCode).collect(Collectors.toList());
        }

        List<SimpleGrantedAuthority> authorities = roleCodes.stream()
            .map(code -> new SimpleGrantedAuthority("ROLE_" + code))
            .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities
        );
    }
}
