package com.ssafy.econimal.domain.town.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;

public interface InfrastructureEventRepository extends JpaRepository<InfrastructureEvent, Long> {

	List<InfrastructureEvent> findByInfrastructureTownId(Long townId);

	Optional<InfrastructureEvent> findByInfrastructureAndEcoQuiz(Infrastructure infra, EcoQuiz ecoQuiz);

	boolean existsByInfrastructure(Infrastructure infra);
}
