package com.ssafy.econimal.domain.town.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;

public interface EcoAnswerRepository extends JpaRepository<EcoAnswer, Long> {
	List<EcoAnswer> findAllByEcoQuiz(EcoQuiz quiz);
}
