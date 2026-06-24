package com.polaris.ai.service;

import com.polaris.ai.dto.AiProviderConfigDTO;
import com.polaris.ai.dto.SaveProviderConfigRequest;
import com.polaris.ai.entity.AiProviderConfig;
import com.polaris.ai.mapper.AiProviderConfigMapper;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiProviderService {

    private final String aesKey;
    private final AiProviderConfigMapper aiProviderConfigMapper;

    public AiProviderService(@Value("${polaris.aes.key:PolarisAI2024Key}") String aesKey,
                             AiProviderConfigMapper aiProviderConfigMapper) {
        this.aesKey = aesKey;
        this.aiProviderConfigMapper = aiProviderConfigMapper;
    }

    public List<AiProviderConfigDTO> getUserProviders(Long userId) {
        List<AiProviderConfig> configs = aiProviderConfigMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<AiProviderConfig>()
                        .eq(AiProviderConfig::getUserId, userId));
        return configs.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void saveProvider(SaveProviderConfigRequest req, Long userId) {
        AiProviderConfig existing = aiProviderConfigMapper.selectByUserAndProvider(userId, req.getProvider());
        LocalDateTime now = LocalDateTime.now();

        if (existing == null) {
            AiProviderConfig config = new AiProviderConfig();
            config.setUserId(userId);
            config.setProvider(req.getProvider());
            config.setBaseUrl(req.getBaseUrl());
            config.setApiKeyEnc(encrypt(req.getApiKey()));
            config.setSecretKeyEnc(encrypt(req.getSecretKey()));
            config.setModel(req.getModel());
            config.setIsActive(1);
            config.setCreatedAt(now);
            config.setUpdatedAt(now);
            aiProviderConfigMapper.insert(config);
        } else {
            existing.setBaseUrl(req.getBaseUrl());
            existing.setApiKeyEnc(encrypt(req.getApiKey()));
            existing.setSecretKeyEnc(encrypt(req.getSecretKey()));
            existing.setModel(req.getModel());
            existing.setUpdatedAt(now);
            aiProviderConfigMapper.updateById(existing);
        }
    }

    public AiProviderConfig getActiveProvider(Long userId, String provider) {
        return aiProviderConfigMapper.selectByUserAndProvider(userId, provider);
    }

    /**
     * Resolve provider config from DB based on model name.
     * Falls back to matching by model prefix.
     */
    public ResolvedConfig resolveConfig(Long userId, String model) {
        String providerKey = modelToProviderKey(model);
        AiProviderConfig cfg = aiProviderConfigMapper.selectByUserAndProvider(userId, providerKey);
        if (cfg == null && "jimeng-4".equals(providerKey)) {
            cfg = aiProviderConfigMapper.selectByUserAndProvider(userId, "jimeng");
        }
        if (cfg == null) return null;
        ResolvedConfig rc = new ResolvedConfig();
        rc.baseUrl = cfg.getBaseUrl();
        rc.apiKey = decrypt(cfg.getApiKeyEnc());
        rc.secretKey = decrypt(cfg.getSecretKeyEnc());
        rc.model = cfg.getModel();
        rc.provider = providerKey;
        return rc;
    }

    private String modelToProviderKey(String model) {
        if (model == null) return "chat";
        if ("video".equals(model)) return "video-default";
        if (model.startsWith("dall-e-")) return "image-openai";
        if (model.startsWith("jimeng-4")) return "jimeng-4";
        if (model.startsWith("jimeng-")) return "jimeng";
        if (model.startsWith("doubao-seedance-") || model.startsWith("seedance-") || model.startsWith("aura-")) return "video-default";
        if (model.startsWith("deepseek-")) return "chat";
        return "chat";
    }

    public static class ResolvedConfig {
        private String baseUrl;
        private String apiKey;
        private String secretKey;
        private String model;
        private String provider;

        public String getBaseUrl() { return baseUrl; }
        public String getApiKey() { return apiKey; }
        public String getSecretKey() { return secretKey; }
        public String getModel() { return model; }
        public String getProvider() { return provider; }
    }

    private String encrypt(String data) {
        if (data == null || data.isBlank()) return null;
        try {
            SecretKeySpec key = new SecretKeySpec(aesKey.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(data.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Encryption error", e);
        }
    }

    private String decrypt(String encryptedData) {
        if (encryptedData == null || encryptedData.isBlank()) return null;
        try {
            SecretKeySpec key = new SecretKeySpec(aesKey.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedData)));
        } catch (Exception e) {
            return null;
        }
    }

    private AiProviderConfigDTO toDTO(AiProviderConfig config) {
        AiProviderConfigDTO dto = new AiProviderConfigDTO();
        dto.setId(config.getId());
        dto.setProvider(config.getProvider());
        dto.setBaseUrl(config.getBaseUrl());
        dto.setApiKey(decrypt(config.getApiKeyEnc()));
        dto.setSecretKey(decrypt(config.getSecretKeyEnc()));
        dto.setModel(config.getModel());
        dto.setIsActive(config.getIsActive());
        return dto;
    }
}
