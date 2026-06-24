package com.polaris.auth.controller;

import com.polaris.auth.dto.LoginRequest;
import com.polaris.auth.dto.LoginResponse;
import com.polaris.auth.dto.RefreshTokenRequest;
import com.polaris.auth.dto.RegisterRequest;
import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.auth.service.AuthService;
import com.polaris.common.constant.ApiConstants;
import com.polaris.common.response.R;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public R<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return R.success(authService.register(request));
    }

    @PostMapping("/login")
    public R<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return R.success(authService.login(request, getClientIp(httpRequest)));
    }

    @PostMapping("/refresh")
    public R<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return R.success(authService.refresh(request));
    }

    @PostMapping("/logout")
    public R<Void> logout(@RequestHeader(ApiConstants.TOKEN_HEADER) String token) {
        authService.logout(token);
        return R.success();
    }

    @GetMapping("/me")
    public R<Map<String, Object>> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return R.success(authService.getUserSummary(jwtAuth.getUserId(), jwtAuth.getUsername(), jwtAuth.getRoles()));
        }
        return R.failed(com.polaris.common.enums.ResultCode.UNAUTHORIZED);
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
