package com.ssafy.econimal.domain.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailRequest(
	@NotBlank(message = "{required}")
	@Email(message = "{valid}")
	@Size(max = 255, message = "{max.length}")
	String email
) {
}
