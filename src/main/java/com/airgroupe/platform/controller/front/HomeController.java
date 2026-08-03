package com.airgroupe.platform.controller.front;

import com.airgroupe.platform.dto.ProjectDto;
import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@Controller
public class HomeController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;

    public HomeController(ServiceRepository serviceRepository,
                          ContactMessageRepository contactMessageRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<ServiceEntity> services = serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        model.addAttribute("services", services);
        return "front/index";
    }

    @GetMapping("/services")
    public String services(Model model) {
        List<ServiceEntity> services = serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        model.addAttribute("services", services);
        return "front/services";
    }

    @GetMapping("/projets")
    public String projets(Model model) {
        List<ProjectDto> projects = new ArrayList<>();
        projects.add(new ProjectDto(
                "Pont d'Agadez",
                "Construction d'un pont moderne sur le fleuve à Agadez.",
                "https://images.unsplash.com/photo-1546548970-7171f7188d67?w=600&auto=format"
        ));
        projects.add(new ProjectDto(
                "Piste agricole d'Agadez",
                "Aménagement de 15 km de piste dans la région d'Agadez.",
                "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&auto=format"
        ));
        projects.add(new ProjectDto(
                "Location d'engins à Agadez",
                "Location de pelles et bulldozers pour les chantiers à Agadez.",
                "https://images.unsplash.com/photo-1511452887600-c0b1b06b490a?w=600&auto=format"
        ));
        model.addAttribute("projects", projects);
        return "front/projets";
    }

    @GetMapping("/actualites")
    public String actualites() {
        return "front/actualites";
    }

    @GetMapping("/equipe")
    public String equipe() {
        return "front/equipe";
    }

    @GetMapping("/galerie")
    public String galerie() {
        return "front/galerie";
    }

    @GetMapping("/contact")
    public String contact() {
        return "front/contact";
    }

    @PostMapping("/submit-contact")
    public String submitContact(@RequestParam String name,
                                @RequestParam String email,
                                @RequestParam String phone,
                                @RequestParam String subject,
                                @RequestParam String message,
                                RedirectAttributes redirectAttributes) {

        ContactMessage msg = new ContactMessage();
        msg.setName(name);
        msg.setEmail(email);
        msg.setPhone(phone);
        msg.setSubject(subject);
        msg.setMessage(message);
        msg.setIsRead(false);
        contactMessageRepository.save(msg);

        redirectAttributes.addFlashAttribute("success", "Votre message a été envoyé avec succès !");
        return "redirect:/contact";
    }

    @GetMapping("/devis")
    public String devis() {
        return "front/devis";
    }

    @PostMapping("/submit-devis")
    public String submitDevis(@RequestParam String name,
                              @RequestParam String email,
                              @RequestParam String phone,
                              @RequestParam String serviceType,
                              @RequestParam String description,
                              @RequestParam(required = false) String budget,
                              RedirectAttributes redirectAttributes) {

        redirectAttributes.addFlashAttribute("devisSuccess", "Votre demande de devis a été envoyée avec succès !");
        return "redirect:/devis";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }
}