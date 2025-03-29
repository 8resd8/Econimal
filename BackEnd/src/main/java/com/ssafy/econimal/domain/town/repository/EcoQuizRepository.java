package com.ssafy.econimal.domain.town.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Facility;

public interface EcoQuizRepository extends JpaRepository<EcoQuiz, Long> {
	Optional<EcoQuiz> findFirstByFacility(Facility facility);

	// 데이터 삽입위한 메서드
	@Query("select qu from EcoQuiz qu where qu.id >= :min and qu.id <= :max")
	List<EcoQuiz> findAllByIdSize(Long min, Long max);

	List<EcoQuiz> findByFacility(Facility facility);
}
