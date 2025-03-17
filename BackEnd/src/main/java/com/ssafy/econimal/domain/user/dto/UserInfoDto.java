package com.ssafy.econimal.domain.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.econimal.global.common.enums.UserType;

public record UserInfoDto (
	String email,
	String name,
	String nickname,
	LocalDate birth,
	Long coin,
	UserType role,
	LocalDateTime lastLoginAt,
	String townName
) {
}
