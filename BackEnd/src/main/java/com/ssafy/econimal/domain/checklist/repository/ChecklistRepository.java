package com.ssafy.econimal.domain.checklist.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.checklist.entity.Checklist;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
}
