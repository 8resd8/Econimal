package com.ssafy.econimal.global.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.ssafy.econimal.domain.auth.exception.JwtException;
import com.ssafy.econimal.global.common.enums.UserType;
import com.ssafy.econimal.global.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Getter
public class JwtUtil {

	private final JwtProperties jwtProperties;
	// private final long accessExpireTime = 1000 * 60 * 30; // 30분 1초 * 60, 1분
	private final long accessExpireTime = 1000 * 60 * 15; // 15분
	// private final long accessExpireTime = 1000 * 30; // 30초

	// 액세스 토큰 생성
	public String createToken(Long userId, UserType userType) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + accessExpireTime);

		return Jwts.builder()
			.subject(userId.toString())
			.claim("userId", userId)
			.claim("role", userType.name())
			.claim("tokenType", "access")
			.issuedAt(now)
			.expiration(expiration)
			.signWith(getSigningKey())
			.compact();
	}

	// 리프레시 토큰 생성
	public String createRefreshToken(Long userId) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + jwtProperties.getRefreshExpiration());

		return Jwts.builder()
			.subject(userId.toString())
			.claim("userId", userId)
			.claim("tokenType", "refresh")
			.issuedAt(now)
			.expiration(expiration)
			.signWith(getSigningKey())
			.compact();
	}

	// 토큰 검증 및 클레임 추출
	public Claims validateAndExtractClaims(String token) {
		try {
			JwtParser parser = Jwts.parser()
				.verifyWith(getSigningKey())
				.build();
			return parser.parseSignedClaims(token).getPayload();
		} catch (JwtException e) {
			throw new JwtException("Invalid JWT token: " + e.getMessage());
		}
	}

	// 토큰 유효성 검사
	public boolean isTokenValid(String token) {
		try {
			Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// 사용자 ID 추출
	public Long getUserIdFromToken(String token) {
		Claims claims = validateAndExtractClaims(token);
		return claims.get("userId", Long.class);
	}

	// 사용자 역할 추출
	public String getUserRoleFromToken(String token) {
		Claims claims = validateAndExtractClaims(token);
		return claims.get("role", String.class);
	}

	// 토큰 타입 검증
	public boolean isAccessToken(String token) {
		Claims claims = validateAndExtractClaims(token);
		return "access".equals(claims.get("tokenType", String.class));
	}

	public boolean isRefreshToken(String token) {
		Claims claims = validateAndExtractClaims(token);
		return "refresh".equals(claims.get("tokenType", String.class));
	}

	// 서명 키 생성
	private SecretKey getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecretKey());
		if (keyBytes.length < 32) {
			throw new IllegalArgumentException("키의 길이가 짧은 오류, 256비트 이상이어야 함");
		}
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String getResolveAccessToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}