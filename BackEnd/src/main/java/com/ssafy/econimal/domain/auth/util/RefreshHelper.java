package com.ssafy.econimal.domain.auth.util;

import static org.springframework.boot.web.server.Cookie.SameSite.*;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class RefreshHelper {

	public static final String REFRESH_TOKEN = "refreshToken";

	// 쿠키 설정
	public ResponseCookie getResponseCookie(String refreshToken, long maxAge) {
		return ResponseCookie.from(REFRESH_TOKEN, refreshToken)
			.httpOnly(true)
			.path("/")
			.maxAge(maxAge)
			.secure(true)
			.sameSite(NONE.name()) // Strict, Lax, None
			.build();
	}
}
