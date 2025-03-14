package com.ssafy.econimal.domain.auth.dto;

public record LoginResponse(
	String accessToken,
	long expireIn
) {
}
