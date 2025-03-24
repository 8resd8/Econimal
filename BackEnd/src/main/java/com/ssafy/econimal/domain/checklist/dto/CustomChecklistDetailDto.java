package com.ssafy.econimal.domain.checklist.dto;

import java.util.Map;

import lombok.Builder;

@Builder
public record CustomChecklistDetailDto(
	String checklistId,
	String description,
	int exp,
	boolean isComplete
) {
	public static CustomChecklistDetailDto of(String checklistId, Map<Object, Object> data) {
		String description = (String)data.get("description");
		String isCompleteStr = (String)data.get("isComplete");
		String expStr = (String)data.get("exp");

		boolean isComplete = Boolean.parseBoolean(isCompleteStr);
		int exp = expStr != null ? Integer.parseInt(expStr) : 0;

		return CustomChecklistDetailDto.builder()
			.checklistId(checklistId)
			.description(description)
			.exp(exp)
			.isComplete(isComplete)
			.build();
	}
}
