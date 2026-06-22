package com.polaris.asset.service;

import com.polaris.asset.entity.Asset;
import com.polaris.asset.mapper.AssetMapper;
import com.polaris.common.enums.ResultCode;
import com.polaris.common.exception.BusinessException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AssetService {

    private final AssetMapper assetMapper;
    private final MinioService minioService;

    public AssetService(AssetMapper assetMapper, MinioService minioService) {
        this.assetMapper = assetMapper;
        this.minioService = minioService;
    }

    public Asset uploadAsset(MultipartFile file, Long userId, Long projectId, String title) {
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.startsWith("image/") || contentType.startsWith("video/"))) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "Only image and video files are allowed");
        }
        String ext = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }
        String objectName = "uploads/" + userId + "/" + UUID.randomUUID() + ext;
        String url = minioService.uploadFile(file, objectName);

        Asset asset = new Asset();
        asset.setUserId(userId);
        asset.setProjectId(projectId);
        asset.setType(contentType.startsWith("image/") ? "image" : "video");
        asset.setTitle(title != null ? title : originalName);
        asset.setFileKey(objectName);
        asset.setUrl(url);
        asset.setSize(file.getSize());
        asset.setMimeType(contentType);
        asset.setCreatedAt(LocalDateTime.now());
        assetMapper.insert(asset);
        return asset;
    }

    public List<Asset> listUserAssets(Long userId) {
        return assetMapper.selectByUserId(userId);
    }

    public void deleteAsset(Long id) {
        Asset asset = assetMapper.selectById(id);
        if (asset == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        minioService.deleteFile(asset.getFileKey());
        assetMapper.deleteById(id);
    }

    public void toggleFavorite(Long id) {
        Asset asset = assetMapper.selectById(id);
        if (asset == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        asset.setFavorite(asset.getFavorite() == 1 ? 0 : 1);
        assetMapper.updateById(asset);
    }
}
