package com.polaris.project.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.polaris.common.enums.ResultCode;
import com.polaris.common.exception.BusinessException;
import com.polaris.project.dto.CreateProjectRequest;
import com.polaris.project.dto.ProjectDTO;
import com.polaris.project.dto.UpdateProjectRequest;
import com.polaris.project.entity.CanvasObject;
import com.polaris.project.entity.Project;
import com.polaris.project.mapper.CanvasObjectMapper;
import com.polaris.project.mapper.ProjectMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectMapper projectMapper;
    private final CanvasObjectMapper canvasObjectMapper;

    public ProjectService(ProjectMapper projectMapper, CanvasObjectMapper canvasObjectMapper) {
        this.projectMapper = projectMapper;
        this.canvasObjectMapper = canvasObjectMapper;
    }

    public List<ProjectDTO> listUserProjects(Long userId) {
        List<Project> projects = projectMapper.selectByUserId(userId);
        List<ProjectDTO> dtos = new ArrayList<>(projects.size());
        for (Project p : projects) {
            dtos.add(toDTO(p));
        }
        return dtos;
    }

    public ProjectDTO getProjectById(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return toDTO(project);
    }

    public ProjectDTO createProject(CreateProjectRequest req, Long userId) {
        Project project = new Project();
        project.setUserId(userId);
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        project.setMode(req.getMode() != null ? req.getMode() : "magic-canvas");
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());
        projectMapper.insert(project);
        return toDTO(project);
    }

    public void updateProject(Long id, UpdateProjectRequest req) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (req.getName() != null) project.setName(req.getName());
        if (req.getDescription() != null) project.setDescription(req.getDescription());
        if (req.getMode() != null) project.setMode(req.getMode());
        if (req.getStatus() != null) project.setStatus(req.getStatus());
        if (req.getTags() != null) project.setTags(req.getTags());
        project.setUpdatedAt(LocalDateTime.now());
        projectMapper.updateById(project);
    }

    public void deleteProject(Long id) {
        Project project = projectMapper.selectById(id);
        if (project == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        projectMapper.deleteById(id);
        LambdaQueryWrapper<CanvasObject> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CanvasObject::getProjectId, id);
        canvasObjectMapper.delete(wrapper);
    }

    public ProjectDTO duplicateProject(Long id, Long userId) {
        Project original = projectMapper.selectById(id);
        if (original == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        Project copy = new Project();
        copy.setUserId(userId);
        copy.setName(original.getName() + " 副本 / Copy");
        copy.setDescription(original.getDescription());
        copy.setMode(original.getMode());
        copy.setCover(original.getCover());
        copy.setIsTemplate(0);
        copy.setIsPublic(0);
        copy.setStatus(1);
        copy.setTags(original.getTags());
        copy.setCreatedAt(LocalDateTime.now());
        copy.setUpdatedAt(LocalDateTime.now());
        projectMapper.insert(copy);

        List<CanvasObject> objects = canvasObjectMapper.selectByProjectId(id);
        for (CanvasObject obj : objects) {
            CanvasObject newObj = new CanvasObject();
            newObj.setProjectId(copy.getId());
            newObj.setType(obj.getType());
            newObj.setTitle(obj.getTitle());
            newObj.setContent(obj.getContent());
            newObj.setPositionX(obj.getPositionX());
            newObj.setPositionY(obj.getPositionY());
            newObj.setWidth(obj.getWidth());
            newObj.setHeight(obj.getHeight());
            newObj.setMeta(obj.getMeta());
            newObj.setSort(obj.getSort());
            newObj.setCreatedAt(LocalDateTime.now());
            newObj.setUpdatedAt(LocalDateTime.now());
            canvasObjectMapper.insert(newObj);
        }
        return toDTO(copy);
    }

    public Page<Project> getPublicProjects(Page<Project> page) {
        LambdaQueryWrapper<Project> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Project::getIsPublic, 1);
        return projectMapper.selectPage(page, wrapper);
    }

    private ProjectDTO toDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setUserId(project.getUserId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setMode(project.getMode());
        dto.setCover(project.getCover());
        dto.setStatus(project.getStatus());
        dto.setTags(project.getTags());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
