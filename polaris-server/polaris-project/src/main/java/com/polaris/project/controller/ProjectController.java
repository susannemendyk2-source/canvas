package com.polaris.project.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.polaris.auth.security.JwtAuthenticationToken;
import com.polaris.common.response.R;
import com.polaris.project.dto.CreateProjectRequest;
import com.polaris.project.dto.ProjectDTO;
import com.polaris.project.dto.UpdateProjectRequest;
import com.polaris.project.entity.Project;
import com.polaris.project.service.ProjectService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public R<List<ProjectDTO>> listProjects() {
        Long userId = getCurrentUserId();
        return R.success(projectService.listUserProjects(userId));
    }

    @PostMapping
    public R<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequest req) {
        Long userId = getCurrentUserId();
        return R.success(projectService.createProject(req, userId));
    }

    @GetMapping("/{id}")
    public R<ProjectDTO> getProject(@PathVariable Long id) {
        return R.success(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public R<Void> updateProject(@PathVariable Long id, @RequestBody UpdateProjectRequest req) {
        projectService.updateProject(id, req);
        return R.success();
    }

    @DeleteMapping("/{id}")
    public R<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return R.success();
    }

    @PostMapping("/{id}/duplicate")
    public R<ProjectDTO> duplicateProject(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return R.success(projectService.duplicateProject(id, userId));
    }

    @GetMapping("/public")
    public R<Page<Project>> getPublicProjects(@RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        Page<Project> pageResult = new Page<>(page, size);
        return R.success(projectService.getPublicProjects(pageResult));
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getUserId();
        }
        return null;
    }
}
