package com.ssafy.econimal.domain.auth.service;

import java.security.SecureRandom;
import java.time.Duration;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.dto.request.EmailAuthRequest;
import com.ssafy.econimal.domain.auth.dto.request.UpdatePasswordRequest;
import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthEmailService {

	private final BCryptPasswordEncoder encoder;
	private final AuthValidator validator;
	private final RedisTemplate<String, String> redisTemplate;

	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final SecureRandom random = new SecureRandom();
	private static final long EXPIRATION_TIME = 5;  // 인증 코드의 만료 시간 (분)

	// 이메일 - 인증코드 확인
	public void verifyCode(EmailAuthRequest request) {
		String authCode = redisTemplate.opsForValue().get(request.email());

		validator.verifyAuthCode(request, authCode);

		redisTemplate.delete(request.email());
	}

	// 6자리 무작위 인증코드 생성
	public String generateVerificationCode() {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < 6; i++) {
			int index = random.nextInt(CHARACTERS.length());
			sb.append(CHARACTERS.charAt(index));
		}
		return sb.toString();
	}

	// 이메일, 암호 레디스 저장
	public void saveVerificationCode(String email, String code) {
		redisTemplate.opsForValue().set(email, code, Duration.ofMinutes(EXPIRATION_TIME));
	}

	// 비밀번호 일치 확인
	public void updatePassword(UpdatePasswordRequest request) {
		validator.verifyUpdatePassword(request.newPassword1(), request.newPassword2());

		User findUser = validator.findUser(request.userId());
		String encodedPassword = encoder.encode(request.newPassword1());

		findUser.updatePassword(encodedPassword);
	}
}
