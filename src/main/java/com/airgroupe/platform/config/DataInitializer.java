package com.airgroupe.platform.config;

import com.airgroupe.platform.model.User;
import com.airgroupe.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElse(new User());

            admin.setUsername("admin");
            // Génère dynamiquement le hash BCrypt exact compatible avec votre SecurityConfig
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrateur");
            admin.setEmail("admin@airgroupe.com");
            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println("=== COMPTE ADMIN DE TEST INITIALISÉ / RÉINITIALISÉ AVEC SUCCÈS ===");
        };
    };
}