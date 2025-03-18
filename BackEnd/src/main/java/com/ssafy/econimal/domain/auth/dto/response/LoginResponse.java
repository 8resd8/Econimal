package com.ssafy.econimal.domain.auth.dto.response;

public record LoginResponse(
	String accessToken,
	long timeToLive,
	boolean isFirst
) {
}
