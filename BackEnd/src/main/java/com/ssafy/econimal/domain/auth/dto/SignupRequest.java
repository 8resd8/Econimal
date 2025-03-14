package com.ssafy.econimal.domain.auth.dto;

import java.time.LocalDate;

import com.ssafy.econimal.global.common.enums.UserType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
	@NotBlank(message = "{required}")
	@Email(message = "{valid}")
	String email,

	@NotBlank(message = "{required}")
	@Size(min = 8, message = "{min.length}")
	@Pattern(regexp = "^(?=.*[!@#$%^&*(),.?\":{}|<>]).*$", message = "{password}")
	String password1,

	@NotBlank(message = "{required}")
	String password2,

	@NotBlank(message = "{required}")
	@Size(max = 255, message = "{max.length}")
	String name,

	@Size(max = 10, message = "{max.length}")
	String nickname,

	@Past(message = "{past}")
	LocalDate birth,

	@NotNull(message = "{required}")
	UserType userType
) {
}
