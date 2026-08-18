package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.NewsArticle;
import com.airgroupe.platform.repository.ContactMessageRepository;
import com.airgroupe.platform.repository.NewsArticleRepository;
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
@RequestMapping("/admin/actualites")
public class AdminNewsController {

    private final NewsArticleRepository newsRepository;
    private final ContactMessageRepository contactMessageRepository;

    @Value("${file.upload-dir:uploads/gallery}")
    private String uploadDir;

    public AdminNewsController(NewsArticleRepository newsRepository,
                               ContactMessageRepository contactMessageRepository) {
        this.newsRepository = newsRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping
    public String index(Model model) {
        model.addAttribute("articles", newsRepository.findAllByOrderByCreatedAtDesc());
        model.addAttribute("unreadCount", contactMessageRepository.countByIsReadFalse());
        return "admin/actualites";
    }

    @PostMapping("/add")
    public String addArticle(@RequestParam("title") String title,
                             @RequestParam("summary") String summary,
                             @RequestParam(value = "content", required = false) String content,
                             @RequestParam(value = "file", required = false) MultipartFile file) {

        NewsArticle article = new NewsArticle();
        article.setTitle(title);
        article.setSummary(summary);
        article.setContent(content);

        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File destFile = uploadPath.resolve(fileName).toFile();
                file.transferTo(destFile);

                article.setImageUrl("/uploads/gallery/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        newsRepository.save(article);
        return "redirect:/admin/actualites";
    }

    @GetMapping("/delete/{id}")
    public String deleteArticle(@PathVariable Long id) {
        newsRepository.deleteById(id);
        return "redirect:/admin/actualites";
    }
}