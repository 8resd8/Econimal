package com.ssafy.econimal.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailDuplicationRequest(
	@NotBlank(message = "{required}")
	@Email(message = "{valid}")
	@Size(max = 255, message = "{max.length}")
	String email
) {
}
