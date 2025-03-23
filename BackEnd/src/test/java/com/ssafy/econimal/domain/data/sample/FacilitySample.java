package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.Facility;

public class FacilitySample {
    public static Facility facility() {
        return Facility.builder()
                .facilityName("테스트 시설")
                .ecoType("테스트 EcoType")
                .build();
    }
}
