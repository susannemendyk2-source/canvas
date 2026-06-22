package com.polaris.auth.filter;

import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.auth.util.JwtUtils;
import com.polaris.auth.util.RedisUtils;
import com.polaris.common.constant.ApiConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final List<String> SKIP_PATHS = List.of(
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/api-docs/**"
    );

    private final JwtUtils jwtUtils;
    private final RedisUtils redisUtils;
    private final AntPathMatcher pathMatcher;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, RedisUtils redisUtils) {
        this.jwtUtils = jwtUtils;
        this.redisUtils = redisUtils;
        this.pathMatcher = new AntPathMatcher();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        for (String skipPath : SKIP_PATHS) {
            if (pathMatcher.match(skipPath, path)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        String authHeader = request.getHeader(ApiConstants.TOKEN_HEADER);
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith(ApiConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(ApiConstants.TOKEN_PREFIX.length());
        if (!jwtUtils.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String blacklistKey = ApiConstants.REDIS_TOKEN_BLACKLIST + token;
        if (redisUtils.hasKey(blacklistKey)) {
            filterChain.doFilter(request, response);
            return;
        }

        Long userId = jwtUtils.getUserIdFromToken(token);
        String username = jwtUtils.getUsernameFromToken(token);
        List<String> roles = jwtUtils.getRolesFromToken(token);

        JwtAuthenticationToken authentication = new JwtAuthenticationToken(userId, username, roles);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
