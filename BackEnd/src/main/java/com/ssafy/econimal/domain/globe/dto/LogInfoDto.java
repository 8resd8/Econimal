package com.ssafy.econimal.domain.globe.dto;

import com.fasterxml.jackson.annotation.JsonValue;

public record LogInfoDto(
	@JsonValue
	long correct,

	@JsonValue
	long total
) {
}
