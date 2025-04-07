package com.ssafy.econimal.domain.globe.dto.response;

import com.ssafy.econimal.domain.globe.dto.climate.v1.GroupByCountryDto;
import com.ssafy.econimal.domain.globe.dto.climate.v1.GroupByDateTimeDto;

public record ClimateResponse(
	GroupByDateTimeDto groupByDateTime,
	GroupByCountryDto groupByCountry
) {
}
