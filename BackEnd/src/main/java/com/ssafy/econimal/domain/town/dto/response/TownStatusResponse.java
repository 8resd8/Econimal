package com.ssafy.econimal.domain.town.dto.response;

import java.util.List;

public record TownStatusResponse(
		String townName,
        List<InfrastructureEventResponse> townStatus
) {
}
