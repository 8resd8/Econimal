package com.ssafy.econimal.domain.town.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TownNameUpdateRequest(
	@NotBlank(message = "{required}")
	@Size(max = 30, message = "{max.length}")
	String townName
) {
}
