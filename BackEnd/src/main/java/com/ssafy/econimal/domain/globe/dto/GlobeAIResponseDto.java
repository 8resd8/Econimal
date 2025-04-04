package com.ssafy.econimal.domain.globe.dto;

public record GlobeAIResponseDto(
	String feedback,
	double carbon,
	double temperature
) {
}
