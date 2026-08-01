package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // Compte les messages non lus
    long countByIsReadFalse();

    // Récupère tous les messages triés par date décroissante
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}