package com.ssafy.econimal.domain.checklist.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomChecklistRequest(
	@NotBlank(message = "{required}")
	@Size(max = 50, message = "{max.length}")
	String description
) {
}
