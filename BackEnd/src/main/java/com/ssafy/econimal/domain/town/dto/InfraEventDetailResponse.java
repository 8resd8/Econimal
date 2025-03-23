package com.ssafy.econimal.domain.town.dto;

import java.util.List;

public record InfraEventDetailResponse(
        EcoQuizDto ecoQuiz,
        List<EcoAnswerDto> ecoAnswer
) {
}
