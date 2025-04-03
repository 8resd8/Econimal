package com.ssafy.econimal.domain.checklist.dto.response;

import com.ssafy.econimal.domain.checklist.dto.CustomChecklistAIDto;

public record CustomChecklistResponse(
	CustomChecklistAIDto aiResponse,
	boolean result,
	int exp,
	String uuid) {
}
