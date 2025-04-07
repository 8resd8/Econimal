package com.ssafy.econimal.domain.globe.dto.co2;

import com.querydsl.core.annotations.QueryProjection;

public record CarbonCO2Dto(
	String country,
	String formattedDateHour,
	Double co2
) {
	@QueryProjection
	public CarbonCO2Dto {
	}
}
