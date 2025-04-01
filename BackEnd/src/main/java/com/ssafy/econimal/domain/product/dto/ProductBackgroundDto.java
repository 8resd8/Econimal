package com.ssafy.econimal.domain.product.dto;

import com.querydsl.core.annotations.QueryProjection;

public record ProductBackgroundDto(
	Long productId,
	Long userBackgroundId,
	String userBackgroundName,
	boolean owned,
	int price
) {
	@QueryProjection
	public ProductBackgroundDto {
	}
}
