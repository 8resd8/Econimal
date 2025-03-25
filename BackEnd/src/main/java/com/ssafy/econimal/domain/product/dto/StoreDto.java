package com.ssafy.econimal.domain.product.dto;

import com.querydsl.core.annotations.QueryProjection;

public record StoreDto(
	Long productId,
	String characterName,
	boolean owned
) {
	@QueryProjection
	public StoreDto {
	}
}
