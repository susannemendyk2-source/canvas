package com.polaris.ai.controller;

import com.polaris.ai.dto.AiProviderConfigDTO;
import com.polaris.ai.dto.ChatRequest;
import com.polaris.ai.dto.ChatResponse;
import com.polaris.ai.dto.SaveProviderConfigRequest;
import com.polaris.ai.service.AiChatService;
import com.polaris.ai.service.AiProviderService;
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

    public AiController(AiChatService aiChatService, AiProviderService aiProviderService) {
        this.aiChatService = aiChatService;
        this.aiProviderService = aiProviderService;
    }

    @PostMapping("/chat")
    public R<ChatResponse> chat(@RequestBody ChatRequest request) {
        return R.success(aiChatService.chat(request));
    }

    @PostMapping("/image/generate")
    public R<Void> generateImage() {
        return R.success();
    }

    @PostMapping("/video/generate")
    public R<Void> generateVideo() {
        return R.success();
    }

    @PostMapping("/prompt/enhance")
    public R<ChatResponse> enhancePrompt(@RequestBody ChatRequest request) {
        return R.success(aiChatService.chat(request));
    }

    @GetMapping("/tasks/{id}")
    public R<Map<String, Object>> getTask(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        result.put("taskId", id);
        result.put("status", "completed");
        return R.success(result);
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
