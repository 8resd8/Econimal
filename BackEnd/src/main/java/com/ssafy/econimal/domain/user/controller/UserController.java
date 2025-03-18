package com.ssafy.econimal.domain.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.user.dto.UpdateNicknameRequest;
import com.ssafy.econimal.domain.user.dto.UserInfoResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.service.UserService;
import com.ssafy.econimal.global.annotation.Login;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/info")
	public UserInfoResponse userInfo(@Login User user) {
		return userService.getUserInfo(user);
	}

	@PatchMapping("/nickname")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void updateNickname(@Login User user, @Valid @RequestBody UpdateNicknameRequest request) {
		userService.updateNickname(user, request);
	}
}
