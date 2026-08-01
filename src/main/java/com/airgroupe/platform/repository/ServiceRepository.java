package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    // Récupère les services actifs triés par ordre d'affichage
    List<ServiceEntity> findByIsActiveTrueOrderByDisplayOrderAsc();
}