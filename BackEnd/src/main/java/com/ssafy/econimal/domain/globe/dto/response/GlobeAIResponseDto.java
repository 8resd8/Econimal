package com.ssafy.econimal.domain.globe.dto.response;

public record GlobeAIResponseDto(
	String feedback,
	double carbon,
	double temperature
) {
}
