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
    public String realisations() {
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
        return "login";   // Cette vue doit exister dans templates/login.html
    }
}