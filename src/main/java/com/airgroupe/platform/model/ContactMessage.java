package com.airgroupe.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Data
@NoArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phone;

    private String subject;

    // ✅ Colonne en TEXT pour accepter les messages longs
    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // ===================== NOUVEAUX CHAMPS =====================

    /** Réponse de l'admin (TEXT pour réponses longues) */
    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    /** Date/heure de la réponse admin */
    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    /**
     * Source du message : "MOBILE" (app Android) ou "WEB" (site web).
     * Permet de savoir si la réponse doit être envoyée par email ou
     * simplement stockée pour être lue dans l'app mobile.
     */
    @Column(name = "source", length = 20)
    private String source = "WEB";

    /** Email de l'admin qui a répondu (traçabilité) */
    @Column(name = "replied_by")
    private String repliedBy;
}