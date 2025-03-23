package com.ssafy.econimal.domain.checklist.dto;

import java.util.List;

import lombok.Builder;

@Builder
public record DailyUserChecklistDto(
	int total,
	int done,
	int todo,
	List<DailyUserChecklistDetailDto> checklist
) {
	public static DailyUserChecklistDto of(List<DailyUserChecklistDetailDto> checklist) {
		int total = checklist.size();
		int done = (int)checklist.stream().filter(DailyUserChecklistDetailDto::isComplete).count();
		int todo = total - done;

		return DailyUserChecklistDto.builder()
			.total(total)
			.done(done)
			.todo(todo)
			.checklist(checklist)
			.build();
	}
}
