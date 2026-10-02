package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Recherche un utilisateur par son adresse email (utilisé pour login et register)
    Optional<User> findByEmail(String email);

    // Recherche un utilisateur par son nom d'utilisateur (si nécessaire)
    Optional<User> findByUsername(String username);
}