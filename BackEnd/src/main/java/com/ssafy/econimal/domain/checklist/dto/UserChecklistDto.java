package com.ssafy.econimal.domain.checklist.dto;

public record UserChecklistDto(
	DailyUserChecklistDto daily,
	CustomChecklistDto custom
) {
}
