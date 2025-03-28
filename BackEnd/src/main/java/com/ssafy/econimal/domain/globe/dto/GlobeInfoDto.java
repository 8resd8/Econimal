package com.ssafy.econimal.domain.globe.dto;

import com.querydsl.core.annotations.QueryProjection;

public record GlobeInfoDto(
	String country,
	String dateTime,
	Double temperature,
	Double humidity
) {
	@QueryProjection
	public GlobeInfoDto {
	}
}
