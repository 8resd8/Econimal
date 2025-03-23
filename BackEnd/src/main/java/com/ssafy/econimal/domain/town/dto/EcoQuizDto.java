package com.ssafy.econimal.domain.town.dto;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;

public record EcoQuizDto(
        String quizDescription
) {
	public static EcoQuizDto from(EcoQuiz quiz) {
		return new EcoQuizDto(quiz.getDescription());
	}
}

