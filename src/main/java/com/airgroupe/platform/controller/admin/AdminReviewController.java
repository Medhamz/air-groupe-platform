package com.airgroupe.platform.controller.admin;

import com.airgroupe.platform.model.Review;
import com.airgroupe.platform.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/avis")
public class AdminReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public String listReviews(Model model) {
        model.addAttribute("reviews", reviewRepository.findAll());
        return "admin/avis";
    }

    @PostMapping("/approve/{id}")
    public String approveReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id).orElseThrow();
        review.setApproved(true);
        reviewRepository.save(review);
        return "redirect:/admin/avis";
    }

    @PostMapping("/delete/{id}")
    public String deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
        return "redirect:/admin/avis";
    }
}