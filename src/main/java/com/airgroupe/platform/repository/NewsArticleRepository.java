package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    List<NewsArticle> findAllByOrderByCreatedAtDesc();
}