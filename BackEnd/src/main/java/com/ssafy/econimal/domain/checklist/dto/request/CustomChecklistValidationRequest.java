package com.ssafy.econimal.domain.checklist.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomChecklistValidationRequest(
	@NotNull(message = "{required}")
	@Size(max = 50, message = "{max.length}")
	String description
) {
}
