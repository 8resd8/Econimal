package com.ssafy.econimal.domain.town.dto.response;

import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;

public record InfrastructureEventResponse(
        Long infraId,
        String ecoType,
        boolean isClean,
        Long infraEventId,
        boolean isActive
) {
	public static InfrastructureEventResponse from(InfrastructureEvent event) {
		return new InfrastructureEventResponse(
			event.getInfrastructure().getId(),
			event.getInfrastructure().getFacility().getEcoType().toString(),
			event.getInfrastructure().isClean(),
			event.getId(),
			event.isActive()
		);
	}
}
