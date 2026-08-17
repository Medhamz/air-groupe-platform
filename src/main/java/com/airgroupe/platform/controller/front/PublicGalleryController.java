package com.airgroupe.platform.controller.front;

import com.airgroupe.platform.repository.MediaItemRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/galerie")
public class PublicGalleryController {

    private final MediaItemRepository mediaRepository;

    public PublicGalleryController(MediaItemRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @GetMapping
    public String index(Model model) {
        model.addAttribute("items", mediaRepository.findAllByOrderByCreatedAtDesc());
        return "front/galerie"; // Pointe vers src/main/resources/templates/front/galerie.html
    }
}