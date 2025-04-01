package com.ssafy.econimal.domain.town.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;

public interface EcoAnswerRepository extends JpaRepository<EcoAnswer, Long> {
	@Query("SELECT a FROM EcoAnswer a WHERE a.ecoQuiz.id = :quizId")
	List<EcoAnswer> findAllByEcoQuizId(@Param("quizId") Long quizId);
}
