package com.ssafy.econimal.domain.user.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.user.dto.UserInfoDto;
import com.ssafy.econimal.domain.user.dto.UserInfoResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;

import jakarta.transaction.Transactional;
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
}
