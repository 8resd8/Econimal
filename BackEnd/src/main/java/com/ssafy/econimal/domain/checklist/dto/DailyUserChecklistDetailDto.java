package com.ssafy.econimal.domain.checklist.dto;

import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

import lombok.Builder;

@Builder
public record DailyUserChecklistDetailDto(
	Long checklistId,
	DifficultyType difficulty,
	String description,
	EcoType ecoType,
	int exp,
	boolean isComplete
) {
	public static DailyUserChecklistDetailDto of(UserChecklist userChecklist) {
		return DailyUserChecklistDetailDto.builder()
			.checklistId(userChecklist.getChecklist().getId())
			.difficulty(userChecklist.getChecklist().getDifficulty())
			.description(userChecklist.getChecklist().getDescription())
			.ecoType(userChecklist.getChecklist().getEcoType())
			.exp(userChecklist.getChecklist().getExp())
			.isComplete(userChecklist.isComplete())
			.build();
	}
}
