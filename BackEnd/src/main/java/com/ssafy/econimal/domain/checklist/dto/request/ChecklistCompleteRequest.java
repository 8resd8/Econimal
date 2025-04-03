package com.ssafy.econimal.domain.checklist.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChecklistCompleteRequest(
	@NotBlank(message = "{required}")
	@Size(max = 255, message = "{max.length}")
	String type,

	@NotBlank(message = "{required}")
	@Size(max = 255, message = "{max.length}")
	String checklistId,

	@NotBlank(message = "{required}")
	@Size(max = 50, message = "{max.length}")
	String expId
) {
}
