package com.ssafy.econimal.domain.town.dto;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;

public record EcoAnswerDto(
        Long ecoAnswerId,
        String description,
		int exp
) {
	public static EcoAnswerDto from(EcoAnswer answer) {
		return new EcoAnswerDto(
			answer.getId(),
			answer.getDescription(),
			answer.getExp()
		);
	}
}