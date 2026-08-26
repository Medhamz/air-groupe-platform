package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.ContactMessage;
import com.airgroupe.platform.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/admin/messages")
public class AdminMessageController {

    private final ContactMessageRepository contactMessageRepository;

    public AdminMessageController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    // 1. Liste complète des messages
    @GetMapping
    public String listMessages(Model model, HttpServletRequest request) {
        List<ContactMessage> messages = contactMessageRepository.findAllByOrderByCreatedAtDesc();

        model.addAttribute("messages", messages);
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        model.addAttribute("currentUri", request.getRequestURI());

        return "admin/messages";
    }

    // 2. Marquer un message comme lu
    @GetMapping("/read/{id}")
    public String markAsRead(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        contactMessageRepository.findById(id).ifPresent(msg -> {
            msg.setIsRead(true);
            contactMessageRepository.save(msg);
        });
        redirectAttributes.addFlashAttribute("successMessage", "Message marqué comme lu.");
        return "redirect:/admin/messages";
    }

    // 3. Supprimer un message
    @GetMapping("/delete/{id}")
    public String deleteMessage(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Message supprimé avec succès.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Message introuvable.");
        }
        return "redirect:/admin/messages";
    }
}