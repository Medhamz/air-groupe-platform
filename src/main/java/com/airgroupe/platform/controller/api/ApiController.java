package com.airgroupe.platform.controller.api;

import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.model.SupportTicket;
import com.airgroupe.platform.model.User;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import com.airgroupe.platform.repository.SupportTicketRepository;
import com.airgroupe.platform.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class ApiController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ApiController(ServiceRepository serviceRepository,
                         ContactMessageRepository contactMessageRepository,
                         SupportTicketRepository supportTicketRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.supportTicketRepository = supportTicketRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===================== AUTHENTIFICATION MOBILE =====================

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User userRequest) {
        // Vérifier si l'adresse e-mail existe déjà
        if (userRequest.getEmail() != null && userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Un compte avec cet e-mail existe déjà."));
        }

        // Encoder le mot de passe avant enregistrement
        if (userRequest.getPassword() != null) {
            userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        // Activer le compte par défaut pour les utilisateurs mobiles
        userRequest.setActive(true);

        // Sauvegarder dans la base de données PostgreSQL
        userRepository.save(userRequest);

        return ResponseEntity.ok(Map.of("message", "Compte créé avec succès !"));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Veuillez fournir un email et un mot de passe."));
        }

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "token", "session-token-created",
                        "email", user.getEmail(),
                        "fullName", user.getFullName() != null ? user.getFullName() : ""
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Identifiants incorrects."));
    }

    // ===================== SERVICES ET DEVIS =====================

    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @PostMapping("/quotes")
    public ResponseEntity<Void> sendQuoteRequest(@RequestBody ContactMessage request) {
        contactMessageRepository.save(request);
        return ResponseEntity.ok().build();
    }

    // ===================== TICKETS DE SUPPORT =====================

    @PostMapping("/support/tickets")
    public ResponseEntity<?> createSupportTicket(@RequestBody SupportTicket ticket) {
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket créé avec succès !"));
    }

    // ===================== HEALTH CHECK =====================

    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "AES API is running on Render");
    }
}