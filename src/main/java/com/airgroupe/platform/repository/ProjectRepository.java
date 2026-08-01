package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Récupère les projets visibles triés par date de réalisation (du plus récent au plus ancien)
    List<Project> findByIsVisibleTrueOrderByCompletionDateDesc();

    // Récupère tous les projets triés par date de réalisation décroissante
    List<Project> findAllByOrderByCompletionDateDesc();
}