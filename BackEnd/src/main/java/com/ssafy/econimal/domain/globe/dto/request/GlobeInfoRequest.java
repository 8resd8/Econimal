package com.ssafy.econimal.domain.globe.dto.request;

import java.time.LocalDateTime;

import com.ssafy.econimal.global.annotation.EnumValid;
import com.ssafy.econimal.global.common.enums.TimeType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

public record GlobeInfoRequest(

	@NotNull(message = "{required}")
	LocalDateTime startDate,

	@NotNull(message = "{required}")
	@PastOrPresent(message = "{past}")
	LocalDateTime endDate,

	@NotNull(message = "{required}")
	@EnumValid(enumClass = TimeType.class)
	TimeType type
) {
}
