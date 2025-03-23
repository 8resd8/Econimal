package com.ssafy.econimal.domain.town.dto;

import java.util.List;

public record InfraEventDetailResponse(
        EcoQuizResponse ecoQuiz,
        List<EcoAnswerResponse> ecoAnswer
) {
}
