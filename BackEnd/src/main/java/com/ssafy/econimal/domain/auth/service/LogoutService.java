package com.ssafy.econimal.domain.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.exception.AuthenticationException;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutService {

	private final JwtUtil jwtUtil;
	private final RedisTemplate<String, String> redisTemplate;
	private static final String REFRESH_TOKEN_PREFIX = "RT:";

	@Value("${spring.product}")
	private boolean isProduction;

	public void logout(String refreshToken, HttpServletResponse response) {
		validation(refreshToken);

		Long userId = jwtUtil.getUserIdFromToken(refreshToken);
		String redisKey = REFRESH_TOKEN_PREFIX + userId;

		redisTemplate.delete(redisKey);

		// 쿠키 만료
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
			.httpOnly(true)
			.path("/")
			.maxAge(0)
			.secure(isProduction)
			.sameSite("Strict")
			.build();
		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
	}

	private void validation(String refreshToken) {
		if (refreshToken == null || refreshToken.isEmpty()) {
			throw new AuthenticationException("리프레시 토큰이 없습니다.");
		}

		if (!jwtUtil.isTokenValid(refreshToken)) {
			throw new AuthenticationException("유효하지 않은 리프레시 토큰입니다.");
		}
	}
}