package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.NewsletterSubscriber;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.NewsletterRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final NewsletterRepository newsletterRepository;
    private final JavaMailSender mailSender;

    public AdminController(ServiceRepository serviceRepository,
                           ContactMessageRepository contactMessageRepository,
                           NewsletterRepository newsletterRepository,
                           JavaMailSender mailSender) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.newsletterRepository = newsletterRepository;
        this.mailSender = mailSender;
    }

    // ===================== AUTHENTICATION & WELCOME =====================

    @GetMapping({"", "/"})
    public String welcome() {
        return "admin/welcome";
    }

    @GetMapping("/login")
    public String login() {
        return "admin/login";
    }

    // ===================== DASHBOARD =====================

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalServices", serviceRepository.count());
        model.addAttribute("totalMessages", contactMessageRepository.count());
        model.addAttribute("unreadMessages", contactMessageRepository.countByIsReadFalse());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        model.addAttribute("totalSubscribers", newsletterRepository.count());
        model.addAttribute("totalProjets", 0L);
        model.addAttribute("recentMessages", contactMessageRepository.findTop5ByOrderByCreatedAtDesc());

        return "admin/dashboard";
    }

    // ===================== NEWSLETTER =====================

    @GetMapping("/newsletter")
    public String listNewsletter(Model model) {
        model.addAttribute("subscribers", newsletterRepository.findAll());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        return "admin/newsletter";
    }

    @PostMapping("/newsletter/send")
    public String sendNewsletter(@RequestParam("subject") String subject,
                                 @RequestParam("content") String content,
                                 RedirectAttributes redirectAttributes) {

        List<NewsletterSubscriber> subscribers = newsletterRepository.findAll();

        if (subscribers.isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "Aucun abonné enregistré pour recevoir cette campagne.");
            return "redirect:/admin/newsletter";
        }

        try {
            for (NewsletterSubscriber subscriber : subscribers) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom("sidimohamedhamza2@gmail.com");
                message.setTo(subscriber.getEmail());
                message.setSubject(subject);
                message.setText(content);

                mailSender.send(message);
            }
            redirectAttributes.addFlashAttribute("successMessage", "Campagne envoyée avec succès à " + subscribers.size() + " abonné(s) !");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Erreur lors de l'envoi de la newsletter : " + e.getMessage());
        }

        return "redirect:/admin/newsletter";
    }

    @GetMapping("/newsletter/delete/{id}")
    public String deleteSubscriber(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        newsletterRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Abonné supprimé avec succès !");
        return "redirect:/admin/newsletter";
    }

    // ===================== SERVICES =====================

    @GetMapping("/services")
    public String listServices(Model model) {
        model.addAttribute("services", serviceRepository.findAll());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        return "admin/services";
    }

    @GetMapping("/services/create")
    public String showCreateForm(Model model) {
        model.addAttribute("service", new ServiceEntity());
        return "admin/services-form";
    }

    @GetMapping("/services/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service invalide : " + id));
        model.addAttribute("service", service);
        return "admin/services-form";
    }

    @PostMapping("/services/save")
    public String saveService(@ModelAttribute ServiceEntity service, RedirectAttributes redirectAttributes) {
        serviceRepository.save(service);
        redirectAttributes.addFlashAttribute("successMessage", "Service enregistré avec succès !");
        return "redirect:/admin/services";
    }

    @GetMapping("/services/delete/{id}")
    public String deleteService(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        serviceRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Service supprimé avec succès !");
        return "redirect:/admin/services";
    }
}