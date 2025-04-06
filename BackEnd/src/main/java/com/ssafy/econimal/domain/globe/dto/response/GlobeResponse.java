package com.ssafy.econimal.domain.globe.dto.response;

import com.ssafy.econimal.domain.globe.dto.GroupByCountryDto;
import com.ssafy.econimal.domain.globe.dto.GroupByDateTimeDto;

public record GlobeResponse(
	GroupByDateTimeDto groupByDateTime,
	GroupByCountryDto groupByCountry
) {
}
