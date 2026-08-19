package com.airgroupe.platform.controller.front;

import com.airgroupe.platform.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/projets")
    public String showProjectsPage(Model model) {
        model.addAttribute("projects", projectRepository.findAll());
        return "front/projets";
    }
}