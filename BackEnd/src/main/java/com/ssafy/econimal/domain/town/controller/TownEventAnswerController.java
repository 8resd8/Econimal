package com.ssafy.econimal.domain.town.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.town.dto.response.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.service.TownEventAnswerService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/towns/ecoAnswer")
@RequiredArgsConstructor
public class TownEventAnswerController {

	private final TownEventAnswerService answerService;

	@PostMapping("/{ecoAnswerId}")
	public EcoAnswerResponse getEcoAnswer(@Login User user, @PathVariable("ecoAnswerId") Long ecoAnswerId) {
		return answerService.getEcoAnswer(user, ecoAnswerId);
	}
}
