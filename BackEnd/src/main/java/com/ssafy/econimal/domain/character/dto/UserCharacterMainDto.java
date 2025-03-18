package com.ssafy.econimal.domain.character.dto;

import com.ssafy.econimal.global.common.enums.ExpressionType;

import lombok.Builder;

public record UserCharacterMainDto(
	Integer level,
	Integer exp,
	Long coin,
	ExpressionType expression
) {
	@Builder
	public UserCharacterMainDto {
	}
}
