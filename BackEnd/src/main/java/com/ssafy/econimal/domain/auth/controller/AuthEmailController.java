package com.ssafy.econimal.domain.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.auth.dto.request.EmailAuthRequest;
import com.ssafy.econimal.domain.auth.dto.request.EmailRequest;
import com.ssafy.econimal.domain.auth.dto.request.UpdatePasswordRequest;
import com.ssafy.econimal.domain.auth.service.AuthEmailSendService;
import com.ssafy.econimal.domain.auth.service.AuthEmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AuthEmailController {

	private final AuthEmailService authEmailService;
	private final AuthEmailSendService authEmailSendService;

	@PatchMapping("/password")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
		authEmailService.updatePassword(request);
	}

	@PostMapping("/email/password/reset/request")
	@ResponseStatus(HttpStatus.CREATED)
	public void sendEmailAuthCode(@Valid @RequestBody EmailRequest request) {
		authEmailSendService.handleSendEmail(request);
	}

	@PostMapping("/email/password/reset/confirm")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void verifyEmailAuthCode(@Valid @RequestBody EmailAuthRequest request) {
		authEmailService.verifyCode(request);
	}

}
