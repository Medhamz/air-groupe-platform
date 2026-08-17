package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
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

    public AdminController(ServiceRepository serviceRepository,
                           ContactMessageRepository contactMessageRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    // ===================== WELCOME PAGE =====================
    @GetMapping({"", "/"})
    public String welcome() {
        return "admin/welcome";
    }

    // ===================== DASHBOARD =====================
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalServices", serviceRepository.count());
        model.addAttribute("totalMessages", contactMessageRepository.count());
        model.addAttribute("unreadMessages", contactMessageRepository.countByIsReadFalse());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        model.addAttribute("totalProjets", 0L);
        model.addAttribute("recentMessages", contactMessageRepository.findTop5ByOrderByCreatedAtDesc());

        return "admin/dashboard";
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
    public String saveService(@ModelAttribute ServiceEntity service, RedirectAttributes redirect) {
        serviceRepository.save(service);
        redirect.addFlashAttribute("success", "Service sauvegardé !");
        return "redirect:/admin/services";
    }

    @GetMapping("/services/delete/{id}")
    public String deleteService(@PathVariable Long id, RedirectAttributes redirect) {
        serviceRepository.deleteById(id);
        redirect.addFlashAttribute("success", "Service supprimé !");
        return "redirect:/admin/services";
    }

    // ===================== MESSAGES =====================
    @GetMapping("/messages")
    public String messages(Model model) {
        List<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc();
        long unread = contactMessageRepository.countByIsReadFalse();
        model.addAttribute("messages", messages);
        model.addAttribute("unreadCount", unread);
        return "admin/messages";
    }

    @GetMapping("/messages/read/{id}")
    public String markAsRead(@PathVariable Long id, RedirectAttributes redirect) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Message invalide : " + id));
        msg.setIsRead(true);
        contactMessageRepository.save(msg);
        redirect.addFlashAttribute("success", "Message marqué comme lu.");
        return "redirect:/admin/messages";
    }

    @GetMapping("/messages/delete/{id}")
    public String deleteMessage(@PathVariable Long id, RedirectAttributes redirect) {
        contactMessageRepository.deleteById(id);
        redirect.addFlashAttribute("success", "Message supprimé.");
        return "redirect:/admin/messages";
    }
}