package com.ssafy.econimal.domain.town.dto;

public record InfrastructureEventResponse(
        Long infraId,
        String ecoType,
        boolean isClean,
        Long infraEventId,
        boolean isActive
) {
}
