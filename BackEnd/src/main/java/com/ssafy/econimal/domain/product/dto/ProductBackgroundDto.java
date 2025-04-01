package com.ssafy.econimal.domain.product.dto;

import com.querydsl.core.annotations.QueryProjection;

public record ProductBackgroundDto(
	Long productId,
	String productName,
	Long userBackgroundId,
	boolean owned,
	int price
) {
	@QueryProjection
	public ProductBackgroundDto {
	}
}
