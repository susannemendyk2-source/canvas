package com.polaris.ai.controller;

import com.polaris.ai.dto.AiProviderConfigDTO;
import com.polaris.ai.dto.ChatRequest;
import com.polaris.ai.dto.ChatResponse;
import com.polaris.ai.dto.ImageGenerateRequest;
import com.polaris.ai.dto.ImageGenerateResponse;
import com.polaris.ai.dto.SaveProviderConfigRequest;
import com.polaris.ai.dto.TaskStatusRequest;
import com.polaris.ai.dto.VideoGenerateRequest;
import com.polaris.ai.dto.VideoGenerateResponse;
import com.polaris.ai.service.AiChatService;
import com.polaris.ai.service.AiImageService;
import com.polaris.ai.service.AiProviderService;
import com.polaris.ai.service.AiVideoService;
import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.common.response.R;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiChatService aiChatService;
    private final AiProviderService aiProviderService;
    private final AiImageService aiImageService;
    private final AiVideoService aiVideoService;

    public AiController(AiChatService aiChatService, AiProviderService aiProviderService,
                        AiImageService aiImageService, AiVideoService aiVideoService) {
        this.aiChatService = aiChatService;
        this.aiProviderService = aiProviderService;
        this.aiImageService = aiImageService;
        this.aiVideoService = aiVideoService;
    }

    @PostMapping("/chat")
    public R<ChatResponse> chat(@RequestBody ChatRequest request) {
        request.setUserId(getCurrentUserId());
        return R.success(aiChatService.chat(request));
    }

    @PostMapping("/prompt/enhance")
    public R<ChatResponse> enhancePrompt(@RequestBody ChatRequest request) {
        request.setUserId(getCurrentUserId());
        return R.success(aiChatService.chat(request));
    }

    @PostMapping("/image/generate")
    public R<ImageGenerateResponse> generateImage(@RequestBody ImageGenerateRequest request) {
        request.setUserId(getCurrentUserId());
        return R.success(aiImageService.generate(request));
    }

    @PostMapping("/video/generate")
    public R<VideoGenerateResponse> generateVideo(@RequestBody VideoGenerateRequest request) {
        request.setUserId(getCurrentUserId());
        return R.success(aiVideoService.generate(request));
    }

    @PostMapping("/tasks/status")
    public R<VideoGenerateResponse> getTaskStatus(@RequestBody TaskStatusRequest request) {
        request.setUserId(getCurrentUserId());
        return R.success(aiVideoService.getTaskStatus(request.getBaseUrl(), request.getApiKey(), request.getTaskId(), request.getUserId()));
    }

    @GetMapping("/providers")
    public R<List<AiProviderConfigDTO>> getProviders() {
        return R.success(aiProviderService.getUserProviders(getCurrentUserId()));
    }

    @PutMapping("/providers")
    public R<Void> saveProvider(@Valid @RequestBody SaveProviderConfigRequest request) {
        aiProviderService.saveProvider(request, getCurrentUserId());
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
