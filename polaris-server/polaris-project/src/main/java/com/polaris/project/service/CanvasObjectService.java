package com.polaris.project.service;

import com.polaris.project.dto.BatchUpdatePositionRequest.ObjectPosition;
import com.polaris.project.dto.CanvasObjectDTO;
import com.polaris.project.dto.CreateObjectRequest;
import com.polaris.project.dto.UpdateObjectRequest;
import com.polaris.project.entity.CanvasObject;
import com.polaris.project.mapper.CanvasObjectMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CanvasObjectService {

    private final CanvasObjectMapper canvasObjectMapper;

    public CanvasObjectService(CanvasObjectMapper canvasObjectMapper) {
        this.canvasObjectMapper = canvasObjectMapper;
    }

    public List<CanvasObjectDTO> listProjectObjects(Long projectId) {
        List<CanvasObject> objects = canvasObjectMapper.selectByProjectId(projectId);
        List<CanvasObjectDTO> dtos = new ArrayList<>(objects.size());
        for (CanvasObject obj : objects) {
            dtos.add(toDTO(obj));
        }
        return dtos;
    }

    public CanvasObjectDTO createObject(CreateObjectRequest req, Long projectId) {
        CanvasObject obj = new CanvasObject();
        obj.setProjectId(projectId);
        obj.setType(req.getType());
        obj.setTitle(req.getTitle());
        obj.setContent(req.getContent());
        obj.setPositionX(req.getPositionX());
        obj.setPositionY(req.getPositionY());
        obj.setWidth(req.getWidth() != null ? req.getWidth() : 320.0);
        obj.setHeight(req.getHeight() != null ? req.getHeight() : 220.0);
        obj.setMeta(req.getMeta());
        obj.setCreatedAt(LocalDateTime.now());
        obj.setUpdatedAt(LocalDateTime.now());
        canvasObjectMapper.insert(obj);
        return toDTO(obj);
    }

    public void updateObject(Long id, UpdateObjectRequest req) {
        CanvasObject obj = canvasObjectMapper.selectById(id);
        if (obj == null) {
            return;
        }
        if (req.getTitle() != null) obj.setTitle(req.getTitle());
        if (req.getContent() != null) obj.setContent(req.getContent());
        if (req.getPositionX() != null) obj.setPositionX(req.getPositionX());
        if (req.getPositionY() != null) obj.setPositionY(req.getPositionY());
        if (req.getWidth() != null) obj.setWidth(req.getWidth());
        if (req.getHeight() != null) obj.setHeight(req.getHeight());
        if (req.getMeta() != null) obj.setMeta(req.getMeta());
        obj.setUpdatedAt(LocalDateTime.now());
        canvasObjectMapper.updateById(obj);
    }

    public void deleteObject(Long id) {
        canvasObjectMapper.deleteById(id);
    }

    public void batchUpdatePosition(List<ObjectPosition> positions) {
        for (ObjectPosition pos : positions) {
            CanvasObject obj = new CanvasObject();
            obj.setId(pos.getId());
            obj.setPositionX(pos.getPositionX());
            obj.setPositionY(pos.getPositionY());
            obj.setUpdatedAt(LocalDateTime.now());
            canvasObjectMapper.updateById(obj);
        }
    }

    private CanvasObjectDTO toDTO(CanvasObject obj) {
        CanvasObjectDTO dto = new CanvasObjectDTO();
        dto.setId(obj.getId());
        dto.setProjectId(obj.getProjectId());
        dto.setType(obj.getType());
        dto.setTitle(obj.getTitle());
        dto.setContent(obj.getContent());
        dto.setPositionX(obj.getPositionX());
        dto.setPositionY(obj.getPositionY());
        dto.setWidth(obj.getWidth());
        dto.setHeight(obj.getHeight());
        dto.setMeta(obj.getMeta());
        return dto;
    }
}
