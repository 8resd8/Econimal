package com.ssafy.econimal.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserBackgroundService {

	private final UserBackgroundRepository userBackgroundRepository;

	public void updateBackground(User user, Long userBackgroundId) {
		UserBackground originBackground = userBackgroundRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("배경을 먼저 선택해주세요."));

		UserBackground updateBackground = userBackgroundRepository.findById(userBackgroundId)
			.orElseThrow(() -> new InvalidArgumentException("해당 배경이 없습니다."));

		originBackground.updateIsMain(false); // 기존 배경
		updateBackground.updateIsMain(true); // 바꿀 배경
	}
}
