package com.airgroupe.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    // ✅ Boolean (objet) au lieu de boolean (primitif)
    @Column(name = "is_active")
    private Boolean active = true;

    @Column(nullable = false)
    private String role = "CLIENT";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (this.username == null || this.username.isBlank()) {
            this.username = this.email;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        // ✅ Forcer active à true si null
        if (this.active == null) {
            this.active = true;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null || role.isBlank()) {
            return List.of(new SimpleGrantedAuthority("ROLE_CLIENT"));
        }
        String authorityName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return List.of(new SimpleGrantedAuthority(authorityName));
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    // ✅ isEnabled() retourne false si active est null
    @Override
    public boolean isEnabled() {
        return active != null && active;
    }
}