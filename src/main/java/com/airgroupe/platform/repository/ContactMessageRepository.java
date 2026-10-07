package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    /** Liste complète triée par date décroissante (page Messages) */
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    /** Utilisé par l'API mobile pour récupérer les réponses aux devis */
    List<ContactMessage> findByEmailOrderByCreatedAtDesc(String email);

    /** Badge "non lus" du back-office (isRead = false) */
    long countByIsReadFalse();

    /** Badge "non lus" (isRead = null OU false) — plus sûr si la colonne est nullable */
    long countByIsReadFalseOrIsReadIsNull();

    /** 5 derniers messages affichés sur le dashboard */
    List<ContactMessage> findTop5ByOrderByCreatedAtDesc();
}