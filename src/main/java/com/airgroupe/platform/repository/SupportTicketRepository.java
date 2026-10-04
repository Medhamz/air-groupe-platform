package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    long countByStatus(String status);

    List<SupportTicket> findAllByOrderByCreatedAtDesc();
}