package com.ssafy.econimal.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.user.dto.UpdateNicknameRequest;
import com.ssafy.econimal.domain.user.dto.UserInfoDto;
import com.ssafy.econimal.domain.user.dto.UserInfoResponse;
import com.ssafy.econimal.domain.user.dto.UserProfileDto;
import com.ssafy.econimal.domain.user.dto.UserProfileResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

	private final UserRepository userRepository;

	public UserInfoResponse getUserInfo(User user) {
		UserInfoDto userInfo = userRepository.findUserInfoById(user.getId());
		return new UserInfoResponse(userInfo);
	}

	public UserProfileResponse getUserProfile(User user) {
		UserProfileDto userProfile = userRepository.findUserProfileById(user.getId());
		return new UserProfileResponse(userProfile);
	}

	public void updateNickname(User user, UpdateNicknameRequest request) {
		if (user.getNickname().equals(request.updateNickname())) {
			throw new InvalidArgumentException("이미 존재하는 닉네임입니다.");
		}

		user.updateNickname(request.updateNickname());
	}
}
