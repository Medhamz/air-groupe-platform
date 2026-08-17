package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.MediaItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaItemRepository extends JpaRepository<MediaItem, Long> {
    List<MediaItem> findAllByOrderByCreatedAtDesc();
}