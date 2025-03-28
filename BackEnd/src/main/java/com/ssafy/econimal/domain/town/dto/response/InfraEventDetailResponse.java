package com.ssafy.econimal.domain.town.dto.response;

import java.util.List;

import com.ssafy.econimal.domain.town.dto.EcoAnswerDto;
import com.ssafy.econimal.domain.town.dto.EcoQuizDto;

public record InfraEventDetailResponse(
        EcoQuizDto ecoQuiz,
        List<EcoAnswerDto> ecoAnswer
) {
}
