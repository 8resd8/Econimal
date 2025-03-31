package com.ssafy.econimal.domain.town.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;

public interface InfrastructureEventRepository extends JpaRepository<InfrastructureEvent, Long> {

	// 작동 안할듯? -> 작동함, 묵시적 조인 발생, 비권장 (join 명시적 작성하자)
	@Query("select ie from InfrastructureEvent ie join Infrastructure i on ie.infrastructure.id = i.id where i.town.id = :townId")
	List<InfrastructureEvent> findByInfraEventTownId(@Param("townId") Long townId);

	@Query("select ie from InfrastructureEvent ie where ie.infrastructure.id = :infraId and ie.ecoQuiz.id = :ecoQuizId and ie.isActive = true")
	Optional<InfrastructureEvent> findByInfrastructureAndEcoQuiz(Long infraId, Long ecoQuizId);

	boolean existsByInfrastructure(Infrastructure infra);

	InfrastructureEvent findTopByInfrastructureOrderByUpdatedAtDesc(Infrastructure infra);

	@Query("SELECT e FROM InfrastructureEvent e " +
		"WHERE e.updatedAt = (" +
		"   SELECT MAX(e2.updatedAt) FROM InfrastructureEvent e2 WHERE e2.infrastructure = e.infrastructure" +
		") " +
		"AND e.infrastructure.town = :town")
	List<InfrastructureEvent> findLatestByTown(@Param("town") Town town);

}
