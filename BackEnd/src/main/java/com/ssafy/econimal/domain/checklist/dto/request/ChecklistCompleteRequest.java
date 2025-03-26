package com.ssafy.econimal.domain.checklist.dto.request;

public record ChecklistCompleteRequest(
	String type,
	String checklistId
) {
}
