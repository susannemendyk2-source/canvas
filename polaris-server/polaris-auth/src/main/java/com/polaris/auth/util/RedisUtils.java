package com.polaris.auth.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisUtils {

    private final StringRedisTemplate redisTemplate;
    private final Map<String, CacheValue> fallbackStore = new ConcurrentHashMap<>();

    public RedisUtils(ObjectProvider<StringRedisTemplate> redisTemplateProvider) {
        this.redisTemplate = redisTemplateProvider.getIfAvailable();
    }

    public void setValue(String key, String value, long timeout, TimeUnit unit) {
        if (redisTemplate == null) {
            fallbackStore.put(key, new CacheValue(value, System.currentTimeMillis() + unit.toMillis(timeout)));
            return;
        }
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    public String getValue(String key) {
        if (redisTemplate == null) {
            CacheValue cacheValue = fallbackStore.get(key);
            if (cacheValue == null) {
                return null;
            }
            if (cacheValue.expiresAt() <= System.currentTimeMillis()) {
                fallbackStore.remove(key);
                return null;
            }
            return cacheValue.value();
        }
        return redisTemplate.opsForValue().get(key);
    }

    public boolean hasKey(String key) {
        if (redisTemplate == null) {
            return getValue(key) != null;
        }
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    public long increment(String key, long timeout, TimeUnit unit) {
        if (redisTemplate == null) {
            long next = Long.parseLong(getValue(key) == null ? "0" : getValue(key)) + 1;
            setValue(key, String.valueOf(next), timeout, unit);
            return next;
        }
        Long value = redisTemplate.opsForValue().increment(key);
        if (value != null && value == 1L) {
            redisTemplate.expire(key, timeout, unit);
        }
        return value == null ? 0 : value;
    }

    public void delete(String key) {
        if (redisTemplate == null) {
            fallbackStore.remove(key);
            return;
        }
        redisTemplate.delete(key);
    }

    private record CacheValue(String value, long expiresAt) {
    }
}
