package com.ssafy.econimal.domain.globe.dto;

import com.querydsl.core.annotations.QueryProjection;

public record GlobeInfoV2Dto(
	String country,
	String formattedDateHour,
	Double temperature,
	Double humidity
) {
	@QueryProjection
	public GlobeInfoV2Dto {
	}
}
