package com.ssafy.econimal.domain.town.dto;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;

public record EcoAnswerDto(
        Long ecoQuizId,
        String description,
		int exp
) {
	public static EcoAnswerDto from(EcoAnswer answer) {
		int adjustedExp = Math.max(0, answer.getExp());
		return new EcoAnswerDto(
			answer.getEcoQuiz().getId(),
			answer.getDescription(),
			adjustedExp
		);
	}
}