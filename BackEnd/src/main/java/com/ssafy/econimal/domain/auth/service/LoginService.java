package com.ssafy.econimal.domain.auth.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.dto.LoginRequest;
import com.ssafy.econimal.domain.auth.dto.LoginResponse;
import com.ssafy.econimal.domain.auth.exception.AuthenticationException;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.common.enums.UserType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LoginService {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder encoder;
	private final RedisTemplate<String, String> redisTemplate;

	private static final String REFRESH_TOKEN_PREFIX = "RT:";

	@Value("${spring.product}")
	private boolean isProduction;

	public LoginResponse login(LoginRequest request, HttpServletResponse response) {
		User user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new InvalidArgumentException("잘못된 이메일 주소입니다."));

		if (!verifyPassword(request.password(), user.getPassword())) {
			throw new InvalidArgumentException("비밀번호가 일치하지 않습니다.");
		}

		String accessToken = jwtUtil.createToken(user.getId(), UserType.USER);
		String refreshToken = jwtUtil.createRefreshToken(user.getId());

		redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + user.getId(), refreshToken,
			jwtUtil.getRefreshExpiration(), TimeUnit.MILLISECONDS);

		response.setHeader("Refresh-Token", refreshToken);

		// 쿠키에 저장
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
			.httpOnly(true)
			.path("/")
			.maxAge(TimeUnit.MILLISECONDS.toSeconds(jwtUtil.getRefreshExpiration()))
			.secure(isProduction)
			.sameSite("Strict") // Strict, Lax, None
			.build();
		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

		return new LoginResponse(accessToken, jwtUtil.getAccessExpireTime());
	}

	public LoginResponse refreshToken(String refreshToken, HttpServletResponse response) {
		if (!jwtUtil.isTokenValid(refreshToken) || jwtUtil.isRefreshToken(refreshToken)) {
			throw new AuthenticationException("유효하지 않은 리프레시 토큰입니다.");
		}

		Long userId = jwtUtil.getUserIdFromToken(refreshToken);

		if (!userRepository.existsById(userId)) {
			throw new AuthenticationException("존재하지 않는 사용자입니다.");
		}

		String newAccessToken = jwtUtil.createToken(userId, UserType.USER);
		String newRefreshToken = jwtUtil.createRefreshToken(userId);

		redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + userId, newRefreshToken,
			jwtUtil.getRefreshExpiration(), TimeUnit.MILLISECONDS);

		// 쿠키에 저장
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", newRefreshToken)
			.httpOnly(true)
			.path("/")
			.maxAge(TimeUnit.MILLISECONDS.toSeconds(jwtUtil.getRefreshExpiration()))
			.secure(isProduction)
			.sameSite("Strict")
			.build();
		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

		return new LoginResponse(newAccessToken, jwtUtil.getAccessExpireTime());
	}

	private boolean verifyPassword(String requestPassword, String encodedPassword) {
		return encoder.matches(requestPassword, encodedPassword);
	}
}
