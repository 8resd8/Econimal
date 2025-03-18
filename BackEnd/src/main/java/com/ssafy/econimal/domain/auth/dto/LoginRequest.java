package com.ssafy.econimal.domain.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginRequest(
	@NotBlank(message = "{required}")
	@Email(message = "{valid}")
	@Size(max = 255, message = "{max.length}")
	String email,

	@NotBlank(message = "{required}")
	@Size(min = 8, max = 255, message = "{length}")
	@Pattern(regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "{password}")
	String password
) {
}
