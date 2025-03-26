package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.Facility;
import com.ssafy.econimal.global.common.enums.EcoType;

public class FacilitySample {
    public static Facility facility() {
        return Facility.builder()
                .facilityName("테스트 시설")
                .ecoType(EcoType.ELECTRICITY)
                .build();
    }
}
