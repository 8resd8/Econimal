package com.ssafy.econimal.domain.auth.dto;

public record RefreshResponse(
	String accessToken,
	long timeToLive
) {
}
