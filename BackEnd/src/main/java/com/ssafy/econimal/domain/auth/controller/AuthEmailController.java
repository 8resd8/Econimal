package com.ssafy.econimal.domain.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.auth.dto.request.UpdatePasswordRequest;
import com.ssafy.econimal.domain.auth.service.AuthEmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AuthEmailController {

	private final AuthEmailService authEmailService;

	@PatchMapping("/password")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
		authEmailService.updatePassword(request);
	}
}
