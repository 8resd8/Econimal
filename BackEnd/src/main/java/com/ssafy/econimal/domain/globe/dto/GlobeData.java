package com.ssafy.econimal.domain.globe.dto;

import java.util.Map;

public interface GlobeData {
	String country();

	String formattedDateHour();

	Map<String, String> toValueMap();
}
