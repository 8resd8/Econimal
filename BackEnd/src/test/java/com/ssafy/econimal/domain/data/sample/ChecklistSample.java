package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

public class ChecklistSample {
	public static Checklist checklist(DifficultyType difficulty, EcoType ecoType) {
		return Checklist.builder()
			.difficulty(difficulty)
			.ecoType(ecoType)
			.description("상세 설명")
			.build();
	}
}
