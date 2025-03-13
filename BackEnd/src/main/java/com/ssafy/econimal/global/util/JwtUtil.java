package com.ssafy.econimal.global.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ssafy.econimal.global.common.enums.UserType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;

@Component
@Getter
public class JwtUtil {

	@Value("${jwt.secret}")
	private String secretKey;

	private final long accessExpireTime = 1000 * 60 * 30; // 30분

	@Value("${jwt.refresh-expiration}")
	private long refreshExpiration;

	// 토큰 생성
	public String createToken(Long userId, UserType userType) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + accessExpireTime);

		return Jwts.builder()
			.subject(userId.toString())
			.claim("userId", userId)
			.claim("role", userType.name())
			.issuedAt(now)
			.expiration(expiration)
			.signWith(getSigningKey())
			.compact();
	}

	// 리프레시 토큰
	public String createRefreshToken(Long userId) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + refreshExpiration);

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
		JwtParser parser = Jwts.parser()
			.verifyWith(getSigningKey())
			.build();

		return parser.parseSignedClaims(token).getPayload();
	}

	// 토큰 유효성 검사만 수행
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

	// 서명방식
	private SecretKey getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
