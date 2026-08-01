package com.airgroupe.platform.controller.front;

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

    public HomeController(ServiceRepository serviceRepository, ContactMessageRepository contactMessageRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<ServiceEntity> services = serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        model.addAttribute("services", services.stream().limit(4).toList());
        return "front/index";
    }

    @GetMapping("/services")
    public String services(Model model) {
        model.addAttribute("services", serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc());
        return "front/services";
    }

    @GetMapping("/realisations")
    public String realisations(Model model) {
        // Données de démonstration (à remplacer par des données de la base de données plus tard)
        List<ProjectDto> projects = new ArrayList<>();
        projects.add(new ProjectDto(
                "Construction du pont de Niamey",
                "Pont moderne de 200m pour désengorger la circulation.",
                "https://images.unsplash.com/photo-1546548970-7171f7188d67?w=600&auto=format"
        ));
        projects.add(new ProjectDto(
                "Piste agricole dans la région de Tillabéri",
                "Aménagement de 15 km de piste pour faciliter l'accès aux marchés.",
                "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&auto=format"
        ));
        projects.add(new ProjectDto(
                "Location d'engins pour le chantier de la nouvelle université",
                "4 pelles hydrauliques et 3 bulldozers pour les travaux de terrassement.",
                "https://images.unsplash.com/photo-1511452887600-c0b1b06b490a?w=600&auto=format"
        ));

        model.addAttribute("projects", projects);
        return "front/realisations";
    }

    @GetMapping("/contact")
    public String contact() {
        return "front/contact";
    }

    @PostMapping("/submit-contact")
    public String submitContact(
            @RequestParam String name,
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

    @GetMapping("/login")
    public String login() {
        return "login";   // Cette vue doit exister dans templates/login.html (si nécessaire)
    }

    // DTO interne pour les projets (si vous n'avez pas encore d'entité Project)
    private static class ProjectDto {
        private String title;
        private String description;
        private String imageUrl;

        public ProjectDto(String title, String description, String imageUrl) {
            this.title = title;
            this.description = description;
            this.imageUrl = imageUrl;
        }

        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getImageUrl() { return imageUrl; }
    }
}