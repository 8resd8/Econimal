package com.ssafy.econimal.domain.checklist.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record CustomChecklistDto(
	boolean canAddChecklist,
	int total,
	int todo,
	int done,
	List<CustomChecklistDetailDto> checklist
) {
	public static CustomChecklistDto of(List<CustomChecklistDetailDto> checklist) {
		int total = checklist.size();
		boolean canAddChecklist = total < 5;
		int done = (int)checklist.stream().filter(CustomChecklistDetailDto::isComplete).count();
		int todo = total - done;

		return CustomChecklistDto.builder()
			.canAddChecklist(canAddChecklist)
			.total(total)
			.todo(todo)
			.done(done)
			.checklist(checklist)
			.build();
	}
}
