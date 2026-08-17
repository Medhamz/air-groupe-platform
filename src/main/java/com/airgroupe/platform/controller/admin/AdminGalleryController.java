package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.MediaItem;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.MediaItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
@RequestMapping("/admin/galerie")
public class AdminGalleryController {

    private final MediaItemRepository mediaRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Value("${file.upload-dir:uploads/gallery}")
    private String uploadDir;

    public AdminGalleryController(MediaItemRepository mediaRepository,
                                  ContactMessageRepository contactMessageRepository) {
        this.mediaRepository = mediaRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping
    public String index(Model model) {
        model.addAttribute("items", mediaRepository.findAllByOrderByCreatedAtDesc());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        return "admin/galerie";
    }

    @PostMapping("/add")
    public String addMedia(@RequestParam("title") String title,
                           @RequestParam("description") String description,
                           @RequestParam("mediaType") MediaItem.MediaType mediaType,
                           @RequestParam("file") MultipartFile file) {

        if (!file.isEmpty()) {
            try {
                // 1. Définir le chemin absolu du dossier d'upload
                Path uploadPath = Paths.get(uploadDir).toAbsolutePath();

                // 2. Créer les répertoires s'ils n'existent pas
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // 3. Générer le nom unique et construire le fichier de destination
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File destFile = uploadPath.resolve(fileName).toFile();

                // 4. Transférer le fichier vers le chemin absolu
                file.transferTo(destFile);

                // 5. Enregistrer en base de données
                MediaItem item = new MediaItem();
                item.setTitle(title);
                item.setDescription(description);
                item.setMediaType(mediaType);
                item.setMediaUrl("/uploads/gallery/" + fileName);

                mediaRepository.save(item);

            } catch (IOException e) {
                e.printStackTrace();
                return "redirect:/admin/galerie?error=upload";
            }
        }

        return "redirect:/admin/galerie";
    }

    @GetMapping("/delete/{id}")
    public String deleteMedia(@PathVariable Long id) {
        mediaRepository.deleteById(id);
        return "redirect:/admin/galerie";
    }
}