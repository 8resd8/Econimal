package com.ssafy.econimal.domain.town.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Facility;

public interface EcoQuizRepository extends JpaRepository<EcoQuiz, Long> {
	Optional<EcoQuiz> findFirstByFacility(Facility facility);
}
