package com.ssafy.econimal.domain.town.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.town.dto.response.InfraEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.response.TownStatusResponse;
import com.ssafy.econimal.domain.town.service.TownEventService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/towns/events")
@RequiredArgsConstructor
public class TownEventController {

	private final TownEventService townEventService;

	@GetMapping
	public TownStatusResponse getTownStatus(@Login User user) {
		return townEventService.getTownStatus(user);
	}

	@GetMapping("/{infraEventId}")
	public InfraEventDetailResponse getInfraEventDetail(@PathVariable("infraEventId") Long infraEventId) {
		return townEventService.getInfraEventDetail(infraEventId);
	}
}
