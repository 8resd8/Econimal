package com.ssafy.econimal.domain.globe.dto;

public record GlobeResponse(
	GroupByDateTimeDto groupByDateTime,
	GroupByCountryDto groupByCountry
) {
}
