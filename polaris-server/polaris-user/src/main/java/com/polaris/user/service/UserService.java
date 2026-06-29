package com.polaris.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.polaris.user.dto.UpdatePasswordRequest;
import com.polaris.user.dto.UpdateUserRequest;
import com.polaris.user.dto.UserDTO;
import com.polaris.user.entity.Permission;
import com.polaris.user.entity.Role;
import com.polaris.user.entity.User;
import com.polaris.user.mapper.UserMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getUserById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNickname(user.getNickname());
        dto.setEmail(user.getEmail());
        dto.setAvatar(user.getAvatar());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setType(user.getType());
        dto.setCredits(user.getCredits());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public void updateUser(Long id, UpdateUserRequest req) {
        User user = new User();
        user.setId(id);
        user.setNickname(req.getNickname());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setAvatar(req.getAvatar());
        userMapper.updateById(user);
    }

    public void updatePassword(Long id, UpdatePasswordRequest req) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userMapper.updateById(user);
    }

    public List<Role> getUserRoles(Long id) {
        return userMapper.selectRolesByUserId(id);
    }

    public boolean hasPermission(Long userId, String permissionCode) {
        List<Permission> permissions = userMapper.selectPermissionsByUserId(userId);
        return permissions.stream().anyMatch(p -> p.getCode().equals(permissionCode));
    }

    public Page<User> listUsers(Page<User> page, String keyword) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(User::getUsername, keyword)
                    .or().like(User::getNickname, keyword)
                    .or().like(User::getEmail, keyword);
        }
        return userMapper.selectPage(page, wrapper);
    }

    public String uploadAvatar(Long id, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        String originalName = file.getOriginalFilename();
        String ext = "";
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + ext;
        String dir = "uploads/avatars/" + id;
        try {
            Path dirPath = Paths.get(dir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            Path filePath = dirPath.resolve(filename);
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save avatar file", e);
        }
        String url = "/" + dir + "/" + filename;
        User user = new User();
        user.setId(id);
        user.setAvatar(url);
        userMapper.updateById(user);
        return url;
    }
}
