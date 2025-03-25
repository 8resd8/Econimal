package com.ssafy.econimal.domain.checklist.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.checklist.dto.request.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.service.CustomChecklistService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/checklists/custom")
@RequiredArgsConstructor
public class CustomChecklistController {

	private final CustomChecklistService customChecklistService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public void addCustomChecklist(@Login User user, @RequestBody CustomChecklistRequest request) {
		customChecklistService.addCustomChecklist(user, request);
	}

	@PatchMapping("/{checklistId}")
	public void updateCustomChecklist(@Login User user, @RequestBody CustomChecklistRequest request,
		@PathVariable("checklistId") String checklistId) {
		customChecklistService.updateCustomChecklist(user, checklistId, request);
	}

	@DeleteMapping("/{checklistId}")
	public void deleteCustomChecklist(@Login User user, @PathVariable("checklistId") String checklistId) {
		customChecklistService.deleteCustomChecklist(user, checklistId);
	}
}
