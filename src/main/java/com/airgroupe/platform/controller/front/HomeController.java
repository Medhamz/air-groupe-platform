package com.airgroupe.platform.controller.front;

import com.airgroupe.platform.dto.ProjectDto;
import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.MediaItemRepository;
import com.airgroupe.platform.repository.NewsArticleRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import com.airgroupe.platform.repository.TeamRepository;
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
    private final MediaItemRepository mediaRepository;
    private final NewsArticleRepository newsRepository;
    private final TeamRepository teamRepository;

    public HomeController(ServiceRepository serviceRepository,
                          ContactMessageRepository contactMessageRepository,
                          MediaItemRepository mediaRepository,
                          NewsArticleRepository newsRepository,
                          TeamRepository teamRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.mediaRepository = mediaRepository;
        this.newsRepository = newsRepository;
        this.teamRepository = teamRepository;
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

    @GetMapping("/actualites")
    public String actualites(Model model) {
        model.addAttribute("articles", newsRepository.findAllByOrderByCreatedAtDesc());
        return "front/actualites";
    }

    @GetMapping("/equipe")
    public String equipe(Model model) {
        model.addAttribute("members", teamRepository.findAll());
        return "front/equipe";
    }

    @GetMapping("/galerie")
    public String galerie(Model model) {
        model.addAttribute("items", mediaRepository.findAllByOrderByCreatedAtDesc());
        return "front/galerie";
    }

    @GetMapping("/devis-calculator")
    public String devisCalculator() {
        return "front/devis-calculator";
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