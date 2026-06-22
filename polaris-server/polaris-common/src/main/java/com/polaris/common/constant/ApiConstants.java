package com.polaris.common.constant;

public class ApiConstants {

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String REDIS_TOKEN_BLACKLIST = "polaris:token:blacklist:";
    public static final String REDIS_CAPTCHA_KEY = "polaris:captcha:";
    public static final long ACCESS_TOKEN_EXPIRE = 900;
    public static final long REFRESH_TOKEN_EXPIRE = 604800;

    private ApiConstants() {
    }

}
