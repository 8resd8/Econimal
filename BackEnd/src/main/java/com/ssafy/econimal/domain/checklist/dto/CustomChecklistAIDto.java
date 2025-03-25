package com.ssafy.econimal.domain.checklist.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CustomChecklistAIDto(
	@JsonProperty("point")
	int point,

	@JsonProperty("reason")
	String reason
) {
}
