package com.ssafy.econimal.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailAuthRequest(
	@NotBlank(message = "{required}")
	@Email(message = "{valid}")
	@Size(max = 255, message = "{max.length}")
	String email,

	@NotBlank(message = "{required}")
	@Size(max = 6, message = "{max.length}")
	String authCode
) {
}
