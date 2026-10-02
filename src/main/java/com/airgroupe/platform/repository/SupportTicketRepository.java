package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    // Compte les tickets par statut (ex: "OPEN", "CLOSED", etc.)
    long countByStatus(String status);

    // Récupère tous les tickets triés du plus récent au plus ancien
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}