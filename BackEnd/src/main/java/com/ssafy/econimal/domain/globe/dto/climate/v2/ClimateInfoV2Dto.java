package com.ssafy.econimal.domain.globe.dto.climate.v2;

import java.util.Map;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.econimal.domain.globe.dto.GlobeData;

public record ClimateInfoV2Dto(
	String country,
	String formattedDateHour,
	Double temperature,
	Double humidity
) implements GlobeData {
	@QueryProjection
	public ClimateInfoV2Dto {
	}

	@Override
	public Map<String, String> toValueMap() {
		return Map.of(
			"temperature", String.valueOf(this.temperature()),
			"humidity", String.valueOf(this.humidity())
		);
	}
}
