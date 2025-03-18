package com.ssafy.econimal.domain.auth.dto.response;

public record RefreshResponse(
	String accessToken,
	long timeToLive
) {
}
