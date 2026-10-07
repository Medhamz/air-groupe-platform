package com.airgroupe.platform.controller.api;

import com.airgroupe.platform.dto.RegisterRequest;
import com.airgroupe.platform.dto.SupportTicketRequest;
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
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "L'adresse email est obligatoire."));
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Un compte avec cet e-mail existe déjà."));
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CLIENT");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

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
                        "token", "session-token-" + user.getId() + "-" + System.currentTimeMillis(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName() != null ? user.getFullName() : ""
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Identifiants incorrects."));
    }

    // ===================== SERVICES & DEVIS =====================

    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @PostMapping("/quotes")
    public ResponseEntity<?> sendQuoteRequest(@RequestBody ContactMessage request) {
        System.out.println("========================================");
        System.out.println("=== API REÇOIT UNE DEMANDE DE DEVIS ===");
        System.out.println("name = " + request.getName());
        System.out.println("email = " + request.getEmail());
        System.out.println("phone = " + request.getPhone());
        System.out.println("subject = " + request.getSubject());
        System.out.println("message = " + request.getMessage());
        System.out.println("========================================");

        // ✅ La demande vient de l'app mobile → source = MOBILE
        request.setSource("MOBILE");

        if (request.getCreatedAt() == null) {
            request.setCreatedAt(LocalDateTime.now());
        }
        if (request.getIsRead() == null) {
            request.setIsRead(false);
        }
        contactMessageRepository.save(request);

        System.out.println("=== ✅ DEMANDE DE DEVIS ENREGISTRÉE EN BDD (source=MOBILE) ===");
        System.out.println("========================================");

        return ResponseEntity.ok(Map.of("message", "Demande de devis enregistrée avec succès."));
    }

    /**
     * L'app mobile récupère l'historique de ses devis ET les réponses de l'admin.
     * URL : /api/v1/quotes/replies?email=client@example.com
     */
    @GetMapping("/quotes/replies")
    public ResponseEntity<?> getQuoteReplies(@RequestParam("email") String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email requis"));
        }

        List<ContactMessage> quotes = contactMessageRepository
                .findByEmailOrderByCreatedAtDesc(email)
                .stream()
                .filter(m -> m.getSubject() != null && m.getSubject().startsWith("Demande de devis"))
                .toList();

        return ResponseEntity.ok(quotes);
    }

    // ===================== TICKETS DE SUPPORT =====================

    @PostMapping("/support/tickets")
    public ResponseEntity<?> createSupportTicket(@RequestBody SupportTicketRequest request) {
        SupportTicket ticket = new SupportTicket();
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setUserEmail(request.getUserEmail());
        ticket.setUserPhone(request.getUserPhone());
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());

        supportTicketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket créé avec succès !"));
    }

    @GetMapping("/support/tickets")
    public ResponseEntity<?> getUserTickets(@RequestParam("email") String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email requis"));
        }

        List<SupportTicket> tickets = supportTicketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(t -> email.equalsIgnoreCase(t.getUserEmail()))
                .toList();

        return ResponseEntity.ok(tickets);
    }

    // ===================== HEALTH CHECK =====================

    @GetMapping("/public/health")
    public Map<String, String> health() {
        return Map.of("status", "OK", "message", "AES API is running on Render");
    }
}