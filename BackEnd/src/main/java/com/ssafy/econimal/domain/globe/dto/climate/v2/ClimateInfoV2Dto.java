package com.ssafy.econimal.domain.globe.dto.climate.v2;

import com.querydsl.core.annotations.QueryProjection;

public record ClimateInfoV2Dto(
	String country,
	String formattedDateHour,
	Double temperature,
	Double humidity
) {
	@QueryProjection
	public ClimateInfoV2Dto {
	}
}
