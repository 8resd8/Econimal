package com.ssafy.econimal.domain.auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.auth.util.RefreshHelper;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutService {

	private final JwtUtil jwtUtil;
	private final RedisTemplate<String, String> redisTemplate;
	private final AuthValidator validator;
	private final RefreshHelper refreshHelper;
	private static final String REFRESH_TOKEN_PREFIX = "RT:";

	@Value("${spring.product}")
	private boolean isProduction;

	public void logout(String refreshToken, HttpServletResponse response) {
		validator.validateNullRefreshToken(refreshToken);

		Long userId = jwtUtil.getUserIdFromToken(refreshToken);
		String redisKey = REFRESH_TOKEN_PREFIX + userId;

		redisTemplate.delete(redisKey);

		// 쿠키 만료
		ResponseCookie refreshTokenCookie = refreshHelper.getResponseCookie("", 0);

		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
	}
}