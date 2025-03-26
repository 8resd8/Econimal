package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;

public class InfrastructureEventSample {

    public static InfrastructureEvent infrastructureEvent(Infrastructure infrastructure, EcoQuiz ecoQuiz) {
        return InfrastructureEvent.builder()
                .infrastructure(infrastructure)
                .ecoQuiz(ecoQuiz)
                .isActive(false)
                .build();
    }

    public static InfrastructureEvent infrastructureEvent(Infrastructure infrastructure, EcoQuiz ecoQuiz, boolean isActive) {
        return InfrastructureEvent.builder()
                .infrastructure(infrastructure)
                .ecoQuiz(ecoQuiz)
                .isActive(isActive)
                .build();
    }
}
