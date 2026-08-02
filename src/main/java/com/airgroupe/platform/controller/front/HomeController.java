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
        model.addAttribute("services", services.stream().limit(4).toList());
        return "front/index";
    }

    @GetMapping("/services")
    public String services(Model model) {
        List<ServiceEntity> services = serviceRepository.findByIsActiveTrueOrderByDisplayOrderAsc();

        // Si la base est vide, on ajoute des services par défaut
        if (services.isEmpty()) {
            services = getDefaultServices();
        }
        model.addAttribute("services", services);
        return "front/services";
    }

    @GetMapping("/realisations")
    public String realisations(Model model) {
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
        projects.add(new ProjectDto(
                "Aménagement hydraulique dans la région de Tahoua",
                "Construction de 5 forages et 2 retenues d'eau pour l'agriculture.",
                "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&auto=format"
        ));
        projects.add(new ProjectDto(
                "Transport de matériaux pour le chantier de la centrale solaire",
                "Logistique de 500 tonnes de matériel sur 3 mois.",
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

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // ===== SERVICES PAR DÉFAUT =====
    private List<ServiceEntity> getDefaultServices() {
        List<ServiceEntity> defaults = new ArrayList<>();

        ServiceEntity s1 = new ServiceEntity();
        s1.setName("BTP & Construction");
        s1.setDescription("Construction de bâtiments, routes, ponts et infrastructures publiques avec des normes de qualité internationales.");
        s1.setIconClass("fa-building");
        s1.setDisplayOrder(1);
        s1.setIsActive(true);

        ServiceEntity s2 = new ServiceEntity();
        s2.setName("Hydraulique");
        s2.setDescription("Forages, adductions d'eau, systèmes d'irrigation et aménagement hydraulique pour les zones rurales et urbaines.");
        s2.setIconClass("fa-water");
        s2.setDisplayOrder(2);
        s2.setIsActive(true);

        ServiceEntity s3 = new ServiceEntity();
        s3.setName("Location d'engins lourds");
        s3.setDescription("Pelles hydrauliques, bulldozers, chargeuses, grues et camions avec chauffeurs qualifiés pour vos chantiers.");
        s3.setIconClass("fa-tractor");
        s3.setDisplayOrder(3);
        s3.setIsActive(true);

        ServiceEntity s4 = new ServiceEntity();
        s4.setName("Transport & Logistique");
        s4.setDescription("Transport de marchandises, de matériaux de construction, logistique de chantier et gestion de flotte.");
        s4.setIconClass("fa-truck");
        s4.setDisplayOrder(4);
        s4.setIsActive(true);

        ServiceEntity s5 = new ServiceEntity();
        s5.setName("Commerce général");
        s5.setDescription("Fourniture de matériaux de construction, équipements, outillage et produits pour le BTP et l'hydraulique.");
        s5.setIconClass("fa-store");
        s5.setDisplayOrder(5);
        s5.setIsActive(true);

        ServiceEntity s6 = new ServiceEntity();
        s6.setName("Prestations de services");
        s6.setDescription("Études, conseils, assistance technique et maîtrise d'œuvre pour vos projets de construction et d'hydraulique.");
        s6.setIconClass("fa-handshake");
        s6.setDisplayOrder(6);
        s6.setIsActive(true);

        defaults.add(s1);
        defaults.add(s2);
        defaults.add(s3);
        defaults.add(s4);
        defaults.add(s5);
        defaults.add(s6);

        return defaults;
    }
}