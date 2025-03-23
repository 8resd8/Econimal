package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Facility;

public class EcoQuizSample {
    public static EcoQuiz ecoQuiz(Facility facility) {
        return EcoQuiz.builder()
                .facility(facility)
                .description("상세 설명")
                .build();
    }
}
