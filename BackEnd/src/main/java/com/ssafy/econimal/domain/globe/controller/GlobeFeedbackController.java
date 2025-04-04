package com.ssafy.econimal.domain.globe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.globe.dto.response.GlobeFeedbackResponse;
import com.ssafy.econimal.domain.globe.service.GlobeFeedbackService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/globe/feedback")
@RequiredArgsConstructor
public class GlobeFeedbackController {

	private final GlobeFeedbackService globeFeedbackService;

	@GetMapping
	public GlobeFeedbackResponse getFeedback(@Login User user) {
		return globeFeedbackService.getFeedback(user);
	}
}
