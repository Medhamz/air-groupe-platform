package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.Project;
import com.airgroupe.platform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/projects")
public class AdminProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public String listProjects(Model model) {
        model.addAttribute("projects", projectRepository.findAll());
        return "admin/projets"; // Renvoie directement vers templates/admin/projets.html
    }

    @PostMapping("/save")
    public String saveProject(@ModelAttribute("project") Project project) {
        projectRepository.save(project);
        return "redirect:/admin/projects";
    }

    @GetMapping("/delete/{id}")
    public String deleteProject(@PathVariable("id") Long id) {
        projectRepository.deleteById(id);
        return "redirect:/admin/projects";
    }
}