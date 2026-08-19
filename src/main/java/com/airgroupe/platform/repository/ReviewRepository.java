package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByApprovedTrueOrderByCreatedAtDesc();
}