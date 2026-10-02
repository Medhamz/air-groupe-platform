package com.airgroupe.platform.controller.api;

import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.model.SupportTicket;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import com.airgroupe.platform.repository.SupportTicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ApiController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final SupportTicketRepository supportTicketRepository;

    public ApiController(ServiceRepository serviceRepository,
                         ContactMessageRepository contactMessageRepository,
                         SupportTicketRepository supportTicketRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.supportTicketRepository = supportTicketRepository;
    }

    // Endpoint pour récupérer la liste des services / équipements
    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    // Endpoint pour envoyer une demande de devis ou message depuis l'application
    @PostMapping("/quotes")
    public ResponseEntity<Void> sendQuoteRequest(@RequestBody ContactMessage request) {
        contactMessageRepository.save(request);
        return ResponseEntity.ok().build();
    }

    // Endpoint pour la création de tickets de support par les utilisateurs mobiles
    @PostMapping("/support/tickets")
    public ResponseEntity<?> createSupportTicket(@RequestBody SupportTicket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket créé avec succès !"));
    }

    // Endpoint de vérification (Health check)
    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "AES API is running on Render");
    }
}