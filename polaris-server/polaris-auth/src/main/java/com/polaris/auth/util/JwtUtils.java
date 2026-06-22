package com.polaris.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    @Value("${polaris.jwt.secret:polaris-default-secret-key-must-be-at-least-256-bits-long-for-hs256}")
    private String secret;

    @Value("${polaris.jwt.expiration:86400000}")
    private long accessTokenExpireMs;

    @Value("${polaris.jwt.refresh-expiration:2592000000}")
    private long refreshTokenExpireMs;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long userId, String username, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("roles", roles);
        return Jwts.builder()
            .claims(claims)
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpireMs))
            .signWith(getKey())
            .compact();
    }

    public String generateRefreshToken(Long userId) {
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + refreshTokenExpireMs))
            .signWith(getKey())
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        Long userId = claims.get("userId", Long.class);
        if (userId != null) {
            return userId;
        }
        return Long.valueOf(claims.getSubject());
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        return claims.get("username", String.class);
    }

    public List<String> getRolesFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        return roles;
    }

    public Long getExpirationFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        long diff = claims.getExpiration().getTime() - System.currentTimeMillis();
        return Math.max(diff, 0);
    }

    public long getAccessTokenExpire() {
        return accessTokenExpireMs / 1000;
    }

    public long getRefreshTokenExpire() {
        return refreshTokenExpireMs / 1000;
    }
}
