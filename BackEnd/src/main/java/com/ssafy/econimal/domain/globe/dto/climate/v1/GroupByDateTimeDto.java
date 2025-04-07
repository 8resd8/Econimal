package com.ssafy.econimal.domain.globe.dto.climate.v1;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonValue;

public record GroupByDateTimeDto(
	@JsonValue
	Map<String, Map<String, ClimateDataDto>> groupByDateTime
) {
}
