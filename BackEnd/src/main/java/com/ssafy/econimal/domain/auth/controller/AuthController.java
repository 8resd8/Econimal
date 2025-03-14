package com.ssafy.econimal.domain.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.auth.dto.LoginRequest;
import com.ssafy.econimal.domain.auth.dto.LoginResponse;
import com.ssafy.econimal.domain.auth.dto.SignupRequest;
import com.ssafy.econimal.domain.auth.service.LoginService;
import com.ssafy.econimal.domain.auth.service.LogoutService;
import com.ssafy.econimal.domain.auth.service.SignUpService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AuthController {

	private final SignUpService signUpService;
	private final LoginService loginService;
	private final LogoutService logoutService;

	@PostMapping("/signup")
	@ResponseStatus(HttpStatus.CREATED)
	public void signup(@Valid @RequestBody SignupRequest request) {
		signUpService.signup(request);
	}

	@PostMapping("/login")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
		HttpServletResponse response) {
		LoginResponse result = loginService.login(request, response);

		return ResponseEntity.ok()
			.header("Cache-Control", "no-store")
			.body(result);
	}

	@PostMapping("/logout")
	public void logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
		HttpServletResponse response) {

		logoutService.logout(refreshToken, response);
	}

	@PostMapping("/refresh")
	public ResponseEntity<LoginResponse> refreshToken(@CookieValue(name = "refreshToken") String refreshToken,
		HttpServletResponse response) {
		LoginResponse loginResponse = loginService.refreshToken(refreshToken, response);
		return ResponseEntity.ok()
			.header("Cache-Control", "no-store")
			.body(loginResponse);
	}
}
