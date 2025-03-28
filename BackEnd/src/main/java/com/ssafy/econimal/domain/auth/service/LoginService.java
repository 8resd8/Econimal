package com.ssafy.econimal.domain.auth.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.auth.dto.request.LoginRequest;
import com.ssafy.econimal.domain.auth.dto.response.LoginResponse;
import com.ssafy.econimal.domain.auth.dto.response.RefreshResponse;
import com.ssafy.econimal.domain.auth.util.AuthValidator;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.global.common.enums.UserType;
import com.ssafy.econimal.global.config.JwtProperties;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LoginService {

	private final JwtUtil jwtUtil;
	private final RedisTemplate<String, String> redisTemplate;
	private final AuthValidator validator;
	private final JwtProperties jwtProperties;
	private final UserCharacterRepository userCharacterRepository;

	private static final String REFRESH_TOKEN_PREFIX = "RT:";

	@Value("${spring.product}")
	private boolean isProduction;

	public LoginResponse login(LoginRequest request, HttpServletResponse response) {
		User user = validator.validateLoginRequest(request);

		String accessToken = jwtUtil.createToken(user.getId(), UserType.USER);
		String refreshToken = jwtUtil.createRefreshToken(user.getId());

		redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + user.getId(), refreshToken,
			jwtProperties.getRefreshExpiration(), TimeUnit.MILLISECONDS);

		// 쿠키에 저장
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
			.httpOnly(true)
			.path("/")
			.maxAge(TimeUnit.MILLISECONDS.toSeconds(jwtProperties.getRefreshExpiration()))
			.secure(isProduction)
			.sameSite("Lax") // Strict, Lax, None
			.build();
		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

		user.updateLastLoginAt();

		return new LoginResponse(accessToken, jwtUtil.getAccessExpireTime(),
			userCharacterRepository.findByUserAndMainIsTrue(user).isEmpty());
	}

	public RefreshResponse refreshToken(String refreshToken, HttpServletResponse response) {
		Long userId = validator.validateRefreshToken(refreshToken);

		String newAccessToken = jwtUtil.createToken(userId, UserType.USER);
		String newRefreshToken = jwtUtil.createRefreshToken(userId);

		redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + userId, newRefreshToken,
			jwtProperties.getRefreshExpiration(), TimeUnit.MILLISECONDS);

		// 쿠키에 저장
		ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", newRefreshToken)
			.httpOnly(true)
			.path("/")
			.maxAge(TimeUnit.MILLISECONDS.toSeconds(jwtProperties.getRefreshExpiration()))
			.secure(isProduction)
			.sameSite("Strict")
			.build();
		response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

		return new RefreshResponse(newAccessToken, jwtUtil.getAccessExpireTime());
	}
}
