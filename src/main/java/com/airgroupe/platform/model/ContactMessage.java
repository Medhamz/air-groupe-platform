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

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "source", length = 20)
    private String source = "WEB";

    @Column(name = "replied_by")
    private String repliedBy;

    // ✅ NOUVEAU : réponse du client
    @Column(name = "client_reply", columnDefinition = "TEXT")
    private String clientReply;

    @Column(name = "client_replied_at")
    private LocalDateTime clientRepliedAt;
}