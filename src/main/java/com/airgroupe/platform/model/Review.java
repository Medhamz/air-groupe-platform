package com.airgroupe.platform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientName;
    private String email;
    private int rating; // ex: 1 à 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private boolean approved = false; // Validation admin (false par défaut)
    private LocalDateTime createdAt = LocalDateTime.now();

    public void setApproved(boolean b) {
    }

    // Getters & Setters
}