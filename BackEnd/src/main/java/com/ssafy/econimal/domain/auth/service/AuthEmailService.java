package com.ssafy.econimal.domain.auth.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.dto.request.UpdatePasswordRequest;
import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.user.entity.User;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthEmailService {

	private final BCryptPasswordEncoder encoder;
	private final AuthValidator validator;

	public void updatePassword(UpdatePasswordRequest request) {
		// 비밀번호 일치 확인
		validator.verifyUpdatePassword(request.newPassword1(), request.newPassword2());

		User findUser = validator.findUser(request.userId());
		String encodedPassword = encoder.encode(request.newPassword1());

		findUser.updatePassword(encodedPassword);
	}
}
