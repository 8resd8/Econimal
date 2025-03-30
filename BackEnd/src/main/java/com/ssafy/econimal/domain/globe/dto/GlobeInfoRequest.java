package com.ssafy.econimal.domain.globe.dto;

import java.time.LocalDateTime;

public record GlobeInfoRequest(
	LocalDateTime startDate,
	LocalDateTime endDate,
	String type
) {
}
