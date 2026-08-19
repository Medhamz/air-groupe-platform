package com.airgroupe.platform.repository;

import com.airgroupe.platform.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<TeamMember, Long> {
}