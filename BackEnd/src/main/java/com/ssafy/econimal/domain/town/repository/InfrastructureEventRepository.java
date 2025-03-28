package com.ssafy.econimal.domain.town.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;

public interface InfrastructureEventRepository extends JpaRepository<InfrastructureEvent, Long> {

	// 작동 안할듯? -> 작동함, 묵시적 조인 발생, 비권장 (join 명시적 작성하자)
	@Query("select ie from InfrastructureEvent ie join Infrastructure i on ie.infrastructure.id = i.id where i.town.id = :townId")
	List<InfrastructureEvent> findByInfraEventTownId(Long townId);

	Optional<InfrastructureEvent> findByInfrastructureAndEcoQuiz(Infrastructure infra, EcoQuiz ecoQuiz);

	boolean existsByInfrastructure(Infrastructure infra);
}
