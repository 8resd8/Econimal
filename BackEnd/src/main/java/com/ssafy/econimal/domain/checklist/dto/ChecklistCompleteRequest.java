package com.ssafy.econimal.domain.checklist.dto;

public record ChecklistCompleteRequest(
	String type,
	String checklistId
) {
}
