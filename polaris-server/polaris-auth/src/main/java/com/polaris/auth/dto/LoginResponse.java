package com.polaris.auth.dto;

import java.util.List;

public record LoginResponse(
    String accessToken,
    String refreshToken,
    Long expiresIn,
    Long userId,
    String username,
    String nickname,
    List<String> roles
) {}