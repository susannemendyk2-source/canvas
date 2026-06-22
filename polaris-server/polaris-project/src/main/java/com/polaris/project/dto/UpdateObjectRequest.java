package com.polaris.project.dto;

public class UpdateObjectRequest {
    private String title;
    private String content;
    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;
    private String meta;

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
