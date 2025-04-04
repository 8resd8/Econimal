package com.ssafy.econimal.domain.globe.dto;

import com.fasterxml.jackson.annotation.JsonValue;

public record GlobeAIFeedbackDto(

	@JsonValue
	String feedback,

	@JsonValue
	long carbon,

	@JsonValue
	long temperature
) {
}
