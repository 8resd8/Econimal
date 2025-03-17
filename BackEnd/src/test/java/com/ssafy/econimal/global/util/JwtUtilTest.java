package com.ssafy.econimal.global.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;

import com.ssafy.econimal.global.common.enums.UserType;
import com.ssafy.econimal.global.config.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@SpringBootTest
class JwtUtilTest {

	private final String TEST_SECRET_KEY = "VGhpc0lzVGVzdFNlY3JldEtleUZvckp3dFV0aWxUZXN0aW5nUHVycG9zZXNPbmx5";
	private final Long TEST_USER_ID = 123L;
	private final UserType TEST_USER_TYPE = UserType.USER;

	@Autowired
	private JwtProperties jwtProperties;

	@Autowired
	private JwtUtil jwtUtil;

	@BeforeEach
	void setUp() {
		ReflectionTestUtils.setField(jwtProperties, "secretKey", TEST_SECRET_KEY);
		ReflectionTestUtils.setField(jwtProperties, "refreshExpiration", 1000L * 60 * 60 * 24 * 7); // 7일
	}

	@Test
	@DisplayName("액세스 토큰 생성 및 검증 테스트")
	void createAndValidateAccessToken() {
		// given
		String token = jwtUtil.createToken(TEST_USER_ID, TEST_USER_TYPE);

		// when
		boolean isValid = jwtUtil.isTokenValid(token);
		Long extractedUserId = jwtUtil.getUserIdFromToken(token);
		String extractedRole = jwtUtil.getUserRoleFromToken(token);

		// then
		assertThat(token).isNotNull();
		assertTrue(isValid);
		assertThat(extractedUserId).isEqualTo(TEST_USER_ID);
		assertThat(extractedRole).isEqualTo(TEST_USER_TYPE.name());
	}

	@Test
	@DisplayName("리프레시 토큰 생성 및 검증 테스트")
	void createAndValidateRefreshToken() {
		// given
		String refreshToken = jwtUtil.createRefreshToken(TEST_USER_ID);

		// when
		boolean isValid = jwtUtil.isTokenValid(refreshToken);
		Long extractedUserId = jwtUtil.getUserIdFromToken(refreshToken);
		Claims claims = jwtUtil.validateAndExtractClaims(refreshToken);

		// then
		assertThat(refreshToken).isNotNull();
		assertTrue(isValid);
		assertThat(extractedUserId).isEqualTo(TEST_USER_ID);
		assertThat(claims.get("tokenType")).isEqualTo("refresh");
	}

	@Test
	@DisplayName("만료된 토큰 검증 테스트")
	void validateExpiredToken() {
		// given
		// 만료 시간이 -1인 토큰 생성
		Date now = new Date();
		Date expiration = new Date(now.getTime() - 1000);

		String expiredToken = Jwts.builder()
			.subject(TEST_USER_ID.toString())
			.claim("userId", TEST_USER_ID)
			.claim("role", TEST_USER_TYPE.name())
			.issuedAt(now)
			.expiration(expiration)
			.signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(TEST_SECRET_KEY)))
			.compact();

		// when & then
		assertFalse(jwtUtil.isTokenValid(expiredToken));
	}

	@Test
	@DisplayName("잘못된 서명 키로 생성된 토큰 검증 테스트")
	void validateTokenWithInvalidSignature() {
		// given
		String wrongSecretKey = "V3JvbmdTZWNyZXRLZXlGb3JUZXN0aW5nUHVycG9zZXNPbmx5SGVyZURvbnRVc2VJdA==";

		Date now = new Date();
		Date expiration = new Date(now.getTime() + 1000 * 60 * 60 * 24);

		String invalidToken = Jwts.builder()
			.subject(TEST_USER_ID.toString())
			.claim("userId", TEST_USER_ID)
			.claim("role", TEST_USER_TYPE.name())
			.issuedAt(now)
			.expiration(expiration)
			.signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(wrongSecretKey)))
			.compact();

		// when & then
		assertFalse(jwtUtil.isTokenValid(invalidToken));
	}

	@Test
	@DisplayName("클레임 추출 테스트")
	void extractClaims() {
		// given
		String token = jwtUtil.createToken(TEST_USER_ID, TEST_USER_TYPE);

		// when
		Claims claims = jwtUtil.validateAndExtractClaims(token);

		// then
		assertThat(claims.getSubject()).isEqualTo(TEST_USER_ID.toString());
		assertThat(claims.get("userId", Long.class)).isEqualTo(TEST_USER_ID);
		assertThat(claims.get("role", String.class)).isEqualTo(TEST_USER_TYPE.name());
		assertDoesNotThrow(() -> claims.getExpiration());
		assertDoesNotThrow(() -> claims.getIssuedAt());
	}

	@Test
	@DisplayName("UserType 검증 테스트")
	void createAndValidateTokensForDifferentUserTypes() {
		// given
		String userToken = jwtUtil.createToken(TEST_USER_ID, UserType.USER);
		String adminToken = jwtUtil.createToken(TEST_USER_ID, UserType.ADMIN);

		// when & then
		assertThat(jwtUtil.getUserRoleFromToken(userToken)).isEqualTo(UserType.USER.name());
		assertThat(jwtUtil.getUserRoleFromToken(adminToken)).isEqualTo(UserType.ADMIN.name());
	}
}