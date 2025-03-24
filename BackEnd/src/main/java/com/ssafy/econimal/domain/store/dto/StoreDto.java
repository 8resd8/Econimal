package com.ssafy.econimal.domain.store.dto;

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
