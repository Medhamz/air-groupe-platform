package com.airgroupe.platform.controller.admin;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

// Limite l'exécution automatique du ControllerAdvice aux contrôleurs du package "admin"
@ControllerAdvice(basePackages = "com.airgroupe.platform.controller.admin")
public class GlobalControllerAdvice {

    @ModelAttribute("currentUri")
    public String currentUri(HttpServletRequest request) {
        return request.getRequestURI();
    }
}