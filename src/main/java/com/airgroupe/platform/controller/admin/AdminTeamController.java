package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.TeamMember;
import com.airgroupe.platform.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/equipe")
public class AdminTeamController {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping
    public String listTeam(Model model) {
        model.addAttribute("members", teamRepository.findAll());
        return "admin/equipe";
    }

    @PostMapping("/save")
    public String saveMember(@RequestParam String name,
                             @RequestParam String role,
                             @RequestParam(required = false) String initials) {
        // Génération automatique des initiales si non fournies
        if (initials == null || initials.isBlank()) {
            String[] parts = name.trim().split("\\s+");
            if (parts.length >= 2) {
                initials = ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
            } else if (parts.length == 1 && !parts[0].isEmpty()) {
                initials = parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
            } else {
                initials = "TM";
            }
        }

        TeamMember member = new TeamMember(name, role, initials);
        teamRepository.save(member);
        return "redirect:/admin/equipe";
    }

    @GetMapping("/delete/{id}")
    public String deleteMember(@PathVariable Long id) {
        teamRepository.deleteById(id);
        return "redirect:/admin/equipe";
    }
}