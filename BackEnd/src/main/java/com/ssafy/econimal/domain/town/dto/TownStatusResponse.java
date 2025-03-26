package com.ssafy.econimal.domain.town.dto;

import java.util.List;

public record TownStatusResponse(
		String townName,
        List<InfrastructureEventResponse> townStatus
) {
}
