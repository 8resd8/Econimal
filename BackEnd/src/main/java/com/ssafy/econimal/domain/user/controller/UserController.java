package com.ssafy.econimal.domain.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.user.dto.UserInfoResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.service.UserService;
import com.ssafy.econimal.global.annotation.Login;

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
}
