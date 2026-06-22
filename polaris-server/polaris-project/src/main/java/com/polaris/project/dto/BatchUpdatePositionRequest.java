package com.polaris.project.dto;

import java.util.List;

public class BatchUpdatePositionRequest {
    private List<ObjectPosition> objects;

    public List<ObjectPosition> getObjects() { return objects; }
    public void setObjects(List<ObjectPosition> objects) { this.objects = objects; }

    public static class ObjectPosition {
        private Long id;
        private Double positionX;
        private Double positionY;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Double getPositionX() { return positionX; }
        public void setPositionX(Double positionX) { this.positionX = positionX; }
        public Double getPositionY() { return positionY; }
        public void setPositionY(Double positionY) { this.positionY = positionY; }
    }
}
