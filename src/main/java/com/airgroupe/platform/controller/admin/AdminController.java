package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.NewsletterSubscriber;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.NewsletterRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
            // Conversion des sauts de ligne en balises <br>
            String formattedContent = content.replaceAll("\n", "<br>");

            // Template HTML avec signature au nom de "Afrique Équipements et Services"
            String htmlBody = "<html><body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>"
                    + "<div>" + formattedContent + "</div>"
                    + "<br><hr style='border: none; border-top: 1px solid #ddd; margin: 25px 0;'>"
                    + "<!-- SIGNATURE ENTREPRISE -->"
                    + "<table style='width: 100%; max-width: 550px; font-family: Arial, sans-serif;'>"
                    + "  <tr>"
                    + "    <td style='vertical-align: middle; width: 100px; padding-right: 15px;'>"
                    + "      <img src='cid:companyLogo' alt='Afrique Équipements et Services Logo' style='width: 90px; height: auto; display: block;' />"
                    + "    </td>"
                    + "    <td style='vertical-align: middle; border-left: 3px solid #ffc107; padding-left: 15px;'>"
                    + "      <h3 style='margin: 0; color: #121824; font-size: 16px; font-weight: bold;'>Afrique Équipements et Services</h3>"
                    + "      <p style='margin: 3px 0; color: #555; font-size: 13px;'>Plateforme & Services Corporate</p>"
                    + "      <p style='margin: 3px 0; color: #777; font-size: 12px;'>Email: <a href='mailto:aes@aes-sarlu.com' style='color: #d4a017; text-decoration: none;'>sidimohamedhamza2@gmail.com</a></p>"
                    + "    </td>"
                    + "  </tr>"
                    + "</table>"
                    + "</body></html>";

            ClassPathResource logoResource = new ClassPathResource("static/images/logo.jpeg");

            for (NewsletterSubscriber subscriber : subscribers) {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom("sidimohamedhamza2@gmail.com");
                helper.setTo(subscriber.getEmail());
                helper.setSubject(subject);
                helper.setText(htmlBody, true);

                if (logoResource.exists()) {
                    helper.addInline("companyLogo", logoResource);
                }

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