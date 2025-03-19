package com.ssafy.econimal.domain.auth.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.auth.dto.request.EmailAuthRequest;
import com.ssafy.econimal.domain.auth.dto.request.LoginRequest;
import com.ssafy.econimal.domain.auth.dto.request.SignupRequest;
import com.ssafy.econimal.domain.auth.exception.AuthenticationException;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import com.ssafy.econimal.global.util.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthValidator {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder encoder;
	private final JwtUtil jwtUtil;


	// 회원가입 요청 검증
	public void validateSignUpUser(SignupRequest request) {
		if (userRepository.findByEmail(request.email()).isPresent()) {
			throw new InvalidArgumentException("중복된 이메일입니다.");
		}

		if (!request.password1().equals(request.password2())) {
			throw new InvalidArgumentException("비밀번호가 일치하지 않습니다.");
		}
	}

	// 로그인 요청 검증
	public User validateLoginRequest(LoginRequest request) {
		User user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new InvalidArgumentException("잘못된 이메일 주소입니다."));

		if (!verifyPassword(request.password(), user.getPassword())) {
			throw new InvalidArgumentException("비밀번호가 일치하지 않습니다.");
		}

		// 유저 캐릭터 있는지 없는지 확인 - 시연을 위해 생략
		// 실제 서비스라면 회원가입 시 캐릭터 유무로 판단하여 매번 로그인 시 조건검사 안해도 됨

		return user;
	}

	// 리프레시 토큰 사용자 검증
	public Long validateRefreshToken(String refreshToken) {
		if (!jwtUtil.isTokenValid(refreshToken) || jwtUtil.isRefreshToken(refreshToken)) {
			throw new AuthenticationException("유효하지 않은 리프레시 토큰입니다.");
		}

		Long userId = jwtUtil.getUserIdFromToken(refreshToken);

		if (!userRepository.existsById(userId)) {
			throw new AuthenticationException("존재하지 않는 사용자입니다.");
		}
		return userId;
	}

	// 리프레시 토큰 유효 검증
	public void validateNullRefreshToken(String refreshToken) {
		if (refreshToken == null || refreshToken.isEmpty()) {
			throw new AuthenticationException("리프레시 토큰이 없습니다.");
		}

		if (!jwtUtil.isTokenValid(refreshToken)) {
			throw new AuthenticationException("유효하지 않은 리프레시 토큰입니다.");
		}
	}

	// 비밀번호 검증
	private boolean verifyPassword(String requestPassword, String encodedPassword) {
		return encoder.matches(requestPassword, encodedPassword);
	}

	// 비밀번호 변경시 일치하는가 확인
	public void verifyUpdatePassword(String newPassword1, String newPassword2) {
		if (!newPassword1.equals(newPassword2)) {
			throw new InvalidArgumentException("비밀번호가 일치하지 않습니다.");
		}
	}

	public User findUser(Long userId) {
		return userRepository.findById(userId).orElseThrow(() -> new InvalidArgumentException("해당 유저가 없습니다."));
	}

	public void verifyAuthCode(EmailAuthRequest request, String authCode) {
		if (authCode == null || !authCode.equals(request.authCode())) {
			log.debug("인증 실패: 이메일: {}, 저장된 코드: {}, 입력된 코드: {}", request.email(), authCode, request.authCode());
			throw new InvalidArgumentException("이메일 인증 실패");
		}
	}
}
