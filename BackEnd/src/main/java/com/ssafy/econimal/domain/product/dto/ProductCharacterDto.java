package com.ssafy.econimal.domain.product.dto;

import com.querydsl.core.annotations.QueryProjection;

public record ProductCharacterDto(
	Long productId,
	Long userCharacterId,
	String characterName,
	boolean owned,
	int price
) {
	@QueryProjection
	public ProductCharacterDto {
	}
}
