package com.ssafy.econimal.domain.globe.dto;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonValue;
import com.ssafy.econimal.global.common.enums.EcoType;

public record UserLogDto(
	@JsonValue
	Map<EcoType, LogInfoDto> logs
) {
}
