package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    long countByIsReadFalse();
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    // Ajoutez cette méthode pour le dashboard
    List<ContactMessage> findTop5ByOrderByCreatedAtDesc();
}