package com.ssafy.econimal.domain.checklist.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {

	List<Checklist> findByDifficulty(DifficultyType difficulty);
}
