package com.ssafy.econimal.domain.globe.dto.response;

import com.ssafy.econimal.domain.globe.dto.UserLogDto;

public record GlobeFeedbackResponse(
	UserLogDto logs,
	GlobeAIResponseDto aiResponse
) {
}