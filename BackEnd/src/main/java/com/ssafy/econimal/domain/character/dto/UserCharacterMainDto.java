package com.ssafy.econimal.domain.character.dto;

import com.ssafy.econimal.global.common.enums.ExpressionType;

public record UserCharacterMainDto(
	Integer level,
	Integer exp,
	Long coin,
	ExpressionType expression
) {
}
