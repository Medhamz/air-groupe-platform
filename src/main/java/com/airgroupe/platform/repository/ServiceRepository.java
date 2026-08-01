package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findByIsActiveTrueOrderByDisplayOrderAsc();
}