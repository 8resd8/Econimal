package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;

public class InfrastructureSample {

    public static Infrastructure infrastructure(Town town, Facility facility, boolean isClean) {
        return Infrastructure.builder()
                .town(town)
                .facility(facility)
                .isClean(isClean)
                .build();
    }
}
