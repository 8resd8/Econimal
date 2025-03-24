package com.ssafy.econimal.domain.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserProfileDto(
	String email,
	String name,
	String nickname,
	LocalDate birth,
	String townName,
	LocalDateTime lastLoginAt
) {
}
