package com.airgroupe.platform.controller.api;

import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "Aïr Groupe API is running");
    }

    // Ajoutez ici les endpoints pour soumettre un contact via mobile, etc.
}