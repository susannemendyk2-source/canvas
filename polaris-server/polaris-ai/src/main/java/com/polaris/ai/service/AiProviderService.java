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
import org.springframework.stereotype.Service;

@Service
public class AiProviderService {

    private static final String AES_KEY = "PolarisAI2024Key";

    private final AiProviderConfigMapper aiProviderConfigMapper;

    public AiProviderService(AiProviderConfigMapper aiProviderConfigMapper) {
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
            config.setModel(req.getModel());
            config.setIsActive(1);
            config.setCreatedAt(now);
            config.setUpdatedAt(now);
            aiProviderConfigMapper.insert(config);
        } else {
            existing.setBaseUrl(req.getBaseUrl());
            existing.setApiKeyEnc(encrypt(req.getApiKey()));
            existing.setModel(req.getModel());
            existing.setUpdatedAt(now);
            aiProviderConfigMapper.updateById(existing);
        }
    }

    public AiProviderConfig getActiveProvider(Long userId, String provider) {
        return aiProviderConfigMapper.selectByUserAndProvider(userId, provider);
    }

    private String encrypt(String data) {
        if (data == null || data.isBlank()) {
            return null;
        }
        try {
            SecretKeySpec key = new SecretKeySpec(AES_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(data.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Encryption error", e);
        }
    }

    private AiProviderConfigDTO toDTO(AiProviderConfig config) {
        AiProviderConfigDTO dto = new AiProviderConfigDTO();
        dto.setId(config.getId());
        dto.setProvider(config.getProvider());
        dto.setBaseUrl(config.getBaseUrl());
        dto.setModel(config.getModel());
        dto.setIsActive(config.getIsActive());
        return dto;
    }
}
