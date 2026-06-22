package com.polaris.project.controller;

import com.polaris.common.response.R;
import com.polaris.project.dto.BatchUpdatePositionRequest;
import com.polaris.project.dto.CanvasObjectDTO;
import com.polaris.project.dto.CreateObjectRequest;
import com.polaris.project.dto.UpdateObjectRequest;
import com.polaris.project.service.CanvasObjectService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects/{projectId}/objects")
public class CanvasObjectController {

    private final CanvasObjectService canvasObjectService;

    public CanvasObjectController(CanvasObjectService canvasObjectService) {
        this.canvasObjectService = canvasObjectService;
    }

    @GetMapping
    public R<List<CanvasObjectDTO>> listObjects(@PathVariable Long projectId) {
        return R.success(canvasObjectService.listProjectObjects(projectId));
    }

    @PostMapping
    public R<CanvasObjectDTO> createObject(@PathVariable Long projectId,
                                            @Valid @RequestBody CreateObjectRequest req) {
        return R.success(canvasObjectService.createObject(req, projectId));
    }

    @PutMapping("/{objectId}")
    public R<Void> updateObject(@PathVariable Long objectId, @RequestBody UpdateObjectRequest req) {
        canvasObjectService.updateObject(objectId, req);
        return R.success();
    }

    @DeleteMapping("/{objectId}")
    public R<Void> deleteObject(@PathVariable Long objectId) {
        canvasObjectService.deleteObject(objectId);
        return R.success();
    }

    @PutMapping("/batch")
    public R<Void> batchUpdatePosition(@RequestBody BatchUpdatePositionRequest req) {
        canvasObjectService.batchUpdatePosition(req.getObjects());
        return R.success();
    }
}
