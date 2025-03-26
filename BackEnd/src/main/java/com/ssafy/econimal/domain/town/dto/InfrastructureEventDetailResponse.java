package com.ssafy.econimal.domain.town.dto;

import java.util.List;

public record InfrastructureEventDetailResponse(
        EcoQuizDto ecoQuiz,
        List<EcoAnswerDto> ecoAnswer
) {
}
