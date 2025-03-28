package com.ssafy.econimal.domain.globe.dto;

import java.util.List;

public record GlobeResponse(
	List<GlobeInfoDto> globeInfoDto
) {
}
