package com.polaris.project.dto;

public class CanvasObjectDTO {
    private Long id;
    private Long projectId;
    private String type;
    private String title;
    private String content;
    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;
    private String meta;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Double getPositionX() { return positionX; }
    public void setPositionX(Double positionX) { this.positionX = positionX; }
    public Double getPositionY() { return positionY; }
    public void setPositionY(Double positionY) { this.positionY = positionY; }
    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public String getMeta() { return meta; }
    public void setMeta(String meta) { this.meta = meta; }
}
