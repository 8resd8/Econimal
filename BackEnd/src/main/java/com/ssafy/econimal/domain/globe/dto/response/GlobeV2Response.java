package com.ssafy.econimal.domain.globe.dto.response;

import java.util.Map;

public record GlobeV2Response(
	Map<String, Map<String, Map<String, String>>> groupByCountry,
	Map<String, Map<String, Map<String, String>>> groupByDateTime
) {
}
