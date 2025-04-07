package com.ssafy.econimal.domain.globe.dto.co2;

import java.util.Map;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.econimal.domain.globe.dto.GlobeData;

public record CarbonCO2Dto(
	String country,
	String formattedDateHour,
	Double co2
) implements GlobeData {
	@QueryProjection
	public CarbonCO2Dto {
	}

	@Override
	public Map<String, String> toValueMap() {
		return Map.of(
			"co2", String.valueOf(this.co2())
		);
	}
}
