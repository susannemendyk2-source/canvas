package com.polaris.asset.controller;

import com.polaris.asset.entity.Asset;
import com.polaris.asset.service.AssetService;
import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.common.response.R;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping("/upload")
    public R<Asset> upload(@RequestParam MultipartFile file,
                           @RequestParam(required = false) Long projectId,
                           @RequestParam(required = false) String title) {
        Long userId = getCurrentUserId();
        return R.success(assetService.uploadAsset(file, userId, projectId, title));
    }

    @GetMapping
    public R<List<Asset>> listAssets() {
        Long userId = getCurrentUserId();
        return R.success(assetService.listUserAssets(userId));
    }

    @DeleteMapping("/{id}")
    public R<Void> deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
        return R.success();
    }

    @PutMapping("/{id}/favorite")
    public R<Void> toggleFavorite(@PathVariable Long id) {
        assetService.toggleFavorite(id);
        return R.success();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        return null;
    }
}
