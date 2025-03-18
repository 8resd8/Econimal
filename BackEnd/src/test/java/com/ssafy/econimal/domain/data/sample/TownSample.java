package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.town.entity.Town;

public class TownSample {

	public static Town town() {
		return Town.builder()
			.name("테스트이름")
			.build();
	}

}
