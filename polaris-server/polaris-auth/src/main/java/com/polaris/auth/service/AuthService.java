package com.polaris.auth.service;

import com.polaris.auth.dto.LoginRequest;
import com.polaris.auth.dto.LoginResponse;
import com.polaris.auth.dto.RefreshTokenRequest;
import com.polaris.auth.dto.RegisterRequest;
import com.polaris.auth.util.JwtUtils;
import com.polaris.auth.util.RedisUtils;
import com.polaris.common.constant.ApiConstants;
import com.polaris.common.enums.ResultCode;
import com.polaris.common.exception.BusinessException;
import com.polaris.user.entity.User;
import com.polaris.user.mapper.UserMapper;
import com.polaris.user.mapper.UserRoleMapper;
import com.polaris.user.mapper.RoleMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final int MAX_LOGIN_FAILURES = 5;
    private static final long LOGIN_FAILURE_WINDOW_MINUTES = 15;

    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;
    private final JwtUtils jwtUtils;
    private final RedisUtils redisUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserMapper userMapper, UserRoleMapper userRoleMapper, RoleMapper roleMapper,
                       JwtUtils jwtUtils, RedisUtils redisUtils, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.roleMapper = roleMapper;
        this.jwtUtils = jwtUtils;
        this.redisUtils = redisUtils;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, request.username());
        if (userMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "用户名已存在/Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setEmail(request.email());
        user.setNickname(request.nickname() != null ? request.nickname() : request.username());
        user.setRole("USER");
        userMapper.insert(user);

        List<String> roles = List.of("ROLE_USER");
        String accessToken = jwtUtils.generateAccessToken(user.getId(), user.getUsername(), roles);
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        return new LoginResponse(
            accessToken,
            refreshToken,
            jwtUtils.getAccessTokenExpire(),
            user.getId(),
            user.getUsername(),
            user.getNickname(),
            user.getEmail(),
            user.getCredits(),
            roles
        );
    }

    public LoginResponse login(LoginRequest request, String clientIp) {
        checkLoginRateLimit(request.username(), clientIp);

        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, request.username());
        User user = userMapper.selectOne(queryWrapper);
        if (user == null) {
            recordLoginFailure(request.username(), clientIp);
            throw invalidLoginException();
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            recordLoginFailure(request.username(), clientIp);
            throw invalidLoginException();
        }

        clearLoginFailures(request.username(), clientIp);

        String roleCode = getRoleCode(user.getId());
        List<String> roles = List.of("ROLE_" + roleCode);
        String accessToken = jwtUtils.generateAccessToken(user.getId(), user.getUsername(), roles);
        String refreshToken = jwtUtils.generateRefreshToken(user.getId());

        return new LoginResponse(
            accessToken,
            refreshToken,
            jwtUtils.getAccessTokenExpire(),
            user.getId(),
            user.getUsername(),
            user.getNickname(),
            user.getEmail(),
            user.getCredits(),
            roles
        );
    }

    private String getRoleCode(Long userId) {
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.polaris.user.entity.UserRole> urQuery =
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        urQuery.eq(com.polaris.user.entity.UserRole::getUserId, userId);
        List<com.polaris.user.entity.UserRole> userRoles = userRoleMapper.selectList(urQuery);
        if (userRoles.isEmpty()) return "USER";
        List<Long> roleIds = userRoles.stream().map(com.polaris.user.entity.UserRole::getRoleId).collect(java.util.stream.Collectors.toList());
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.polaris.user.entity.Role> rQuery =
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        rQuery.in(com.polaris.user.entity.Role::getId, roleIds);
        return roleMapper.selectList(rQuery).stream()
            .findFirst().map(com.polaris.user.entity.Role::getCode).orElse("USER");
    }

    public LoginResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.refreshToken();
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.TOKEN_INVALID);
        }

        Long userId = jwtUtils.getUserIdFromToken(refreshToken);
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        String roleCode = getRoleCode(user.getId());
        List<String> roles = List.of("ROLE_" + roleCode);
        String newAccessToken = jwtUtils.generateAccessToken(user.getId(), user.getUsername(), roles);

        return new LoginResponse(
            newAccessToken,
            refreshToken,
            jwtUtils.getAccessTokenExpire(),
            user.getId(),
            user.getUsername(),
            user.getNickname(),
            user.getEmail(),
            user.getCredits(),
            roles
        );
    }

    public java.util.Map<String, Object> getUserSummary(Long userId, String username, List<String> roles) {
        User user = userMapper.selectById(userId);
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("userId", userId);
        summary.put("username", username);
        summary.put("roles", roles);
        if (user != null) {
            summary.put("nickname", user.getNickname());
            summary.put("email", user.getEmail());
            summary.put("credits", user.getCredits());
            summary.put("avatar", user.getAvatar());
            summary.put("phone", user.getPhone());
        }
        return summary;
    }

    public void logout(String token) {
        if (token != null && token.startsWith(ApiConstants.TOKEN_PREFIX)) {
            token = token.substring(ApiConstants.TOKEN_PREFIX.length());
            if (jwtUtils.validateToken(token)) {
                String blacklistKey = ApiConstants.REDIS_TOKEN_BLACKLIST + token;
                redisUtils.setValue(blacklistKey, "1", jwtUtils.getAccessTokenExpire(), TimeUnit.SECONDS);
            }
        }
    }

    private void checkLoginRateLimit(String username, String clientIp) {
        String key = loginFailureKey(username, clientIp);
        String value = redisUtils.getValue(key);
        int failures = value == null ? 0 : Integer.parseInt(value);
        if (failures >= MAX_LOGIN_FAILURES) {
            throw new BusinessException(
                ResultCode.FORBIDDEN,
                "Too many failed login attempts. Please try again in 15 minutes."
            );
        }
    }

    private void recordLoginFailure(String username, String clientIp) {
        redisUtils.increment(loginFailureKey(username, clientIp), LOGIN_FAILURE_WINDOW_MINUTES, TimeUnit.MINUTES);
    }

    private void clearLoginFailures(String username, String clientIp) {
        redisUtils.delete(loginFailureKey(username, clientIp));
    }

    private String loginFailureKey(String username, String clientIp) {
        String raw = (username == null ? "" : username.trim().toLowerCase()) + "|" + (clientIp == null ? "" : clientIp);
        String encoded = Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
        return "polaris:auth:login-fail:" + encoded;
    }

    private BusinessException invalidLoginException() {
        return new BusinessException(ResultCode.PASSWORD_ERROR, "Invalid username or password");
    }
}
