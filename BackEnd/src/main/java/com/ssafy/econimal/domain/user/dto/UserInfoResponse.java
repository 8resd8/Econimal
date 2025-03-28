package com.ssafy.econimal.domain.user.dto;

import java.util.List;

public record UserInfoResponse(
	UserInfoDto userInfo,
	List<Long> userBackgroundIds,
	List<Long> userCharacterIds) {
}
