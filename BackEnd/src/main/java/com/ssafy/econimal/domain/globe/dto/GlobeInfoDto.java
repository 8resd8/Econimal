package com.ssafy.econimal.domain.globe.dto;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;

public record GlobeInfoDto(
	String country,
	LocalDateTime dateTime,
	double temperature,
	double humidity
) {
	@QueryProjection
	public GlobeInfoDto {
	}
}
