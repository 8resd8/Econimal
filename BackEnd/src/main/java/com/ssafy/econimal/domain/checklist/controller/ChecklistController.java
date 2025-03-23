package com.ssafy.econimal.domain.checklist.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.checklist.dto.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistResponse;
import com.ssafy.econimal.domain.checklist.service.ChecklistService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/checklists")
@RequiredArgsConstructor
public class ChecklistController {

	private final ChecklistService checklistService;

	@GetMapping()
	public UserChecklistResponse getUserChecklist(@Login User user) {
		return checklistService.getUserChecklist(user);
	}

	@PostMapping("/custom")
	public void addCustomChecklist(@Login User user, @RequestBody CustomChecklistRequest request) {
		checklistService.addCustomChecklist(user, request);
	}
}
