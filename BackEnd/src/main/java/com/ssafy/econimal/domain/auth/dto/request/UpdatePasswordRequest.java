package com.ssafy.econimal.domain.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
	@NotBlank(message = "{required}")
	Long userId,

	@NotBlank(message = "{required}")
	@Size(min = 8, max = 255, message = "{length}")
	@Pattern(regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "{password}")
	String newPassword1,

	@NotBlank(message = "{required}")
	@Size(min = 8, max = 255, message = "{length}")
	@Pattern(regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "{password}")
	String newPassword2
) {
}
