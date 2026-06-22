package com.polaris.auth.security;

import java.util.Collection;
import java.util.List;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private final Long userId;
    private final String username;
    private final List<String> roles;

    public JwtAuthenticationToken(Long userId, String username, List<String> roles) {
        super(roles.stream().map(SimpleGrantedAuthority::new).toList());
        this.userId = userId;
        this.username = username;
        this.roles = roles;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return username;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getRoles() {
        return roles;
    }
}