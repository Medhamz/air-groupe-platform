package com.airgroupe.platform.security;

import com.airgroupe.platform.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ========== CONFIGURATION DU CORS ==========
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autorise toutes les origines (ou spécifiez l'URL de votre front / requêtes mobiles)
        configuration.setAllowedOriginPatterns(List.of("*"));

        // Autorise les méthodes HTTP nécessaires
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Autorise tous les en-têtes (Headers)
        configuration.setAllowedHeaders(List.of("*"));

        // Autorise l'envoi de cookies / tokens d'authentification si nécessaire
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Applique ces règles à l'ensemble des routes API et web
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ========== ADMIN BACK-OFFICE ==========
    @Bean
    @Order(1)
    public SecurityFilterChain adminFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/admin", "/admin/**")
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activation CORS
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(jakarta.servlet.DispatcherType.FORWARD, jakarta.servlet.DispatcherType.ERROR).permitAll()
                        .requestMatchers("/admin", "/admin/", "/admin/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/admin/login").permitAll()
                        .anyRequest().hasRole("ADMIN")
                )
                .formLogin(form -> form
                        .loginPage("/admin/login")
                        .loginProcessingUrl("/admin/login")
                        .defaultSuccessUrl("/admin/dashboard", false)
                        .failureUrl("/admin/login?error")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/admin/logout")
                        .logoutSuccessUrl("/admin/login?logout")
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedPage("/admin/login?accessDenied")
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }

    // ========== PUBLIC FRONT-OFFICE & API MOBILE ==========
    @Bean
    @Order(2)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/**")
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Activation CORS pour l'API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**", "/favicon.ico").permitAll()
                        .requestMatchers("/api/**").permitAll() // Autorise l'accès libre aux endpoints de l'API mobile
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/")
                        .permitAll()
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}