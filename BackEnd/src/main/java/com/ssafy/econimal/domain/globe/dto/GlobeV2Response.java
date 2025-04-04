package com.ssafy.econimal.domain.globe.dto;

import java.util.Map;

public record GlobeV2Response(
	Map<String, Map<String, Map<String, Double>>> groupByCountry
) {
}
