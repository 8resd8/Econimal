package com.ssafy.econimal.domain.globe.dto.climate.v1;

import com.querydsl.core.annotations.QueryProjection;

public record ClimateInfoDto(
	String country,
	String dateTime,
	Double temperature,
	Double humidity
) {
	@QueryProjection
	public ClimateInfoDto {
	}
}
