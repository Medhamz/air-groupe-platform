package com.airgroupe.platform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_media")
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String mediaUrl; // Chemin du fichier stocké (ex: /uploads/gallery/photo1.jpg)

    @Enumerated(EnumType.STRING)
    private MediaType mediaType; // PHOTO ou VIDEO

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum MediaType {
        PHOTO, VIDEO
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public MediaType getMediaType() { return mediaType; }
    public void setMediaType(MediaType mediaType) { this.mediaType = mediaType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}