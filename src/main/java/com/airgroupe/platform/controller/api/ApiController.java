package com.airgroupe.platform.controller.api;

import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ApiController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;

    public ApiController(ServiceRepository serviceRepository, ContactMessageRepository contactMessageRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    // Endpoint pour récupérer la liste des services / équipements
    // Accessible via : https://www.aes-sarlu.com/api/v1/services
    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    // Endpoint pour envoyer une demande de devis ou message depuis l'application
    // Accessible via : https://www.aes-sarlu.com/api/v1/quotes
    @PostMapping("/quotes")
    public ResponseEntity<Void> sendQuoteRequest(@RequestBody ContactMessage request) {
        contactMessageRepository.save(request);
        return ResponseEntity.ok().build();
    }

    // Endpoint de vérification (Health check)
    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "AES API is running on Render");
    }
}