package com.polaris.user.controller;

import com.polaris.common.response.R;
import com.polaris.user.dto.UpdatePasswordRequest;
import com.polaris.user.dto.UpdateUserRequest;
import com.polaris.user.dto.UserDTO;
import com.polaris.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public R<UserDTO> getUser(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        if (user == null) {
            return R.error("User not found");
        }
        return R.ok(user);
    }

    @PutMapping("/{id}")
    public R<Void> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        userService.updateUser(id, req);
        return R.ok();
    }

    @PutMapping("/{id}/password")
    public R<Void> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest req) {
        userService.updatePassword(id, req);
        return R.ok();
    }

    @PostMapping("/{id}/avatar")
    public R<String> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(id, file);
        return R.ok(avatarUrl);
    }
}
