package com.ssafy.econimal.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateNicknameRequest(
	@NotBlank(message = "{required}")
	@Size(max = 255, message = "{max.length}")
	String updateNickname
) {
}
