package com.ssafy.econimal.domain.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.service.UserBackgroundService;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users/background")
@RequiredArgsConstructor
public class UserBackgroundController {

	private final UserBackgroundService userBackgroundService;

	@PatchMapping("/{userBackgroundId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void updateBackgroundMain(@Login User user, @PathVariable("userBackgroundId") Long userBackgroundId) {
		userBackgroundService.updateBackground(user, userBackgroundId);
	}
}
