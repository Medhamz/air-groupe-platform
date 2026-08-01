package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.ServiceEntity;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.ServiceRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ServiceRepository serviceRepository;
    private final ContactMessageRepository contactMessageRepository;

    public AdminController(ServiceRepository serviceRepository, ContactMessageRepository contactMessageRepository) {
        this.serviceRepository = serviceRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalServices", serviceRepository.count());
        model.addAttribute("totalMessages", contactMessageRepository.count());
        model.addAttribute("unreadMessages", contactMessageRepository.countByIsReadFalse());
        return "admin/dashboard";
    }

    @GetMapping("/services")
    public String listServices(Model model) {
        model.addAttribute("services", serviceRepository.findAll());
        return "admin/services";
    }

    @GetMapping("/services/create")
    public String showCreateForm(Model model) {
        model.addAttribute("service", new ServiceEntity());
        return "admin/service-form";
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

    @GetMapping("/messages")
    public String messages(Model model) {
        model.addAttribute("messages", contactMessageRepository.findAllByOrderByCreatedAtDesc());
        return "admin/messages";
    }

    @GetMapping("/messages/read/{id}")
    public String markAsRead(@PathVariable Long id, RedirectAttributes redirect) {
        var msg = contactMessageRepository.findById(id).orElseThrow();
        msg.setIsRead(true);
        contactMessageRepository.save(msg);
        return "redirect:/admin/messages";
    }
}