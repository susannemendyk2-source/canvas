package com.polaris.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.polaris.ai.dto.AiProviderConfigDTO;
import com.polaris.ai.dto.SaveProviderConfigRequest;
import com.polaris.ai.entity.AiProviderConfig;
import com.polaris.ai.mapper.AiProviderConfigMapper;
import com.polaris.ai.service.AiProviderService;
import com.polaris.admin.mapper.SystemLogMapper;
import com.polaris.asset.mapper.AssetMapper;
import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.common.response.R;
import com.polaris.credit.mapper.CreditAccountMapper;
import com.polaris.credit.mapper.CreditLogMapper;
import com.polaris.project.entity.Project;
import com.polaris.project.mapper.ProjectMapper;
import com.polaris.user.entity.User;
import com.polaris.user.mapper.UserMapper;
import com.polaris.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("appAdminController")
@RequestMapping("/api/admin")
public class AdminController {

    private final UserMapper userMapper;
    private final UserService userService;
    private final ProjectMapper projectMapper;
    private final AiProviderConfigMapper aiProviderConfigMapper;
    private final AiProviderService aiProviderService;
    private final CreditAccountMapper creditAccountMapper;
    private final CreditLogMapper creditLogMapper;
    private final SystemLogMapper systemLogMapper;
    private final AssetMapper assetMapper;
    private final HttpServletRequest request;

    public AdminController(UserMapper userMapper, UserService userService,
                           ProjectMapper projectMapper,
                           AiProviderConfigMapper aiProviderConfigMapper,
                           AiProviderService aiProviderService,
                           CreditAccountMapper creditAccountMapper,
                           CreditLogMapper creditLogMapper,
                           SystemLogMapper systemLogMapper,
                           AssetMapper assetMapper,
                           HttpServletRequest request) {
        this.userMapper = userMapper;
        this.userService = userService;
        this.projectMapper = projectMapper;
        this.aiProviderConfigMapper = aiProviderConfigMapper;
        this.aiProviderService = aiProviderService;
        this.creditAccountMapper = creditAccountMapper;
        this.creditLogMapper = creditLogMapper;
        this.systemLogMapper = systemLogMapper;
        this.assetMapper = assetMapper;
        this.request = request;
    }

    // ========== Dashboard ==========

    @GetMapping("/stats/dashboard")
    public R<Map<String, Object>> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("userCount", userMapper.selectCount(null));
        stats.put("projectCount", projectMapper.selectCount(null));
        stats.put("assetCount", assetMapper.selectCount(null));
        stats.put("totalCredits", creditAccountMapper.sumBalance());
        return R.success(stats);
    }

    @GetMapping("/stats/credits")
    public R<Map<String, Object>> creditsStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalIssued", creditLogMapper.sumIssued());
        stats.put("totalSpent", Math.abs(creditLogMapper.sumSpent()));
        return R.success(stats);
    }

    // ========== Users ==========

    @GetMapping("/users")
    public R<Page<User>> listUsers(@RequestParam(required = false) Integer page,
                                   @RequestParam(required = false) Integer size,
                                   @RequestParam(required = false) String keyword) {
        Page<User> p = new Page<>(page != null ? page : 1, size != null ? size : 50);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<User>()
            .orderByDesc(User::getCreatedAt);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.and(w -> w.like(User::getUsername, keyword)
                .or().like(User::getNickname, keyword)
                .or().like(User::getEmail, keyword));
        }
        Page<User> result = userMapper.selectPage(p, wrapper);
        for (User user : result.getRecords()) {
            List<String> roles = userMapper.selectRolesByUserId(user.getId())
                .stream().map(r -> r.getName()).collect(Collectors.toList());
            user.setRole(String.join(",", roles));
        }
        return R.success(result);
    }

    @PutMapping("/users/{id}/status")
    public R<Void> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        User user = new User();
        int status = body.getOrDefault("status", 1);
        user.setId(id);
        user.setStatus(status);
        userMapper.updateById(user);
        log("user", "updateStatus", "用户" + id + "状态变更为" + status);
        return R.ok();
    }

    @PutMapping("/users/{id}/credits")
    public R<Void> updateUserCredits(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Object amountObj = body.get("amount");
        int amount = amountObj instanceof Number ? ((Number) amountObj).intValue() : Integer.parseInt(amountObj.toString());
        User user = userMapper.selectById(id);
        if (user != null) {
            user.setCredits(Math.max(0, (user.getCredits() != null ? user.getCredits() : 0) + amount));
            userMapper.updateById(user);
        }
        log("credit", "adjust", "用户" + id + "积分调整" + (amount >= 0 ? "+" : "") + amount);
        return R.ok();
    }

    @PutMapping("/users/{id}/role")
    public R<Void> assignRole(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return R.ok();
    }

    // ========== User API Provider Config ==========

    @GetMapping("/users/{id}/providers")
    public R<List<AiProviderConfigDTO>> getUserProviders(@PathVariable Long id) {
        return R.success(aiProviderService.getUserProviders(id));
    }

    @PutMapping("/users/{id}/providers")
    public R<Void> saveUserProvider(@PathVariable Long id, @RequestBody SaveProviderConfigRequest req) {
        aiProviderService.saveProvider(req, id);
        return R.ok();
    }

    // ========== Projects ==========

    @GetMapping("/projects")
    public R<Page<Project>> listProjects(@RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer size,
                                         @RequestParam(required = false) String keyword) {
        Page<Project> p = new Page<>(page != null ? page : 1, size != null ? size : 50);
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<Project>()
            .orderByDesc(Project::getUpdatedAt);
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(Project::getName, keyword);
        }
        return R.success(projectMapper.selectPage(p, wrapper));
    }

    @PutMapping("/projects/{id}/status")
    public R<Void> updateProjectStatus(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Project project = projectMapper.selectById(id);
        if (project != null) {
            project.setStatus(body.getOrDefault("status", 1));
            projectMapper.updateById(project);
        }
        log("project", "updateStatus", "项目" + id + "状态变更为" + body.getOrDefault("status", 1));
        return R.ok();
    }

    @PostMapping("/templates")
    public R<Void> publishTemplate(@RequestBody Map<String, Long> body) {
        Long projectId = body.get("projectId");
        if (projectId != null) {
            Project project = projectMapper.selectById(projectId);
            if (project != null) {
                project.setIsTemplate(1);
                projectMapper.updateById(project);
            }
        }
        log("template", "publish", "项目" + projectId + "发布为模板");
        return R.ok();
    }

    // ========== Logs ==========

    @GetMapping("/logs")
    public R<List<Map<String, Object>>> listLogs(@RequestParam(required = false) String type,
                                                  @RequestParam(required = false) String keyword) {
        return R.success(systemLogMapper.selectLogs(type, keyword));
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwt) {
            return jwt.getUserId();
        }
        return 0L;
    }

    private String clientIp() {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) return realIp;
        return request.getRemoteAddr();
    }

    private void log(String module, String action, String detail) {
        systemLogMapper.insertLog(module, action, currentUserId(), clientIp(), detail);
    }
}
