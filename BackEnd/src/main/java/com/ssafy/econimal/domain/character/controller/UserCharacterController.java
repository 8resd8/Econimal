package com.ssafy.econimal.domain.character.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterMainResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.character.service.UserCharacterService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/characters/users")
@RequiredArgsConstructor
public class UserCharacterController {

	private final UserCharacterService userCharacterService;

	@GetMapping
	public UserCharacterResponse getUserCharacters(@Login User user) {
		return userCharacterService.getUserCharacters(user);
	}

	@GetMapping("/{userCharacterId}")
	public UserCharacterDetailResponse getUserCharacterDetail(@Login User user,
		@PathVariable("userCharacterId") Long userCharacterId) {
		return userCharacterService.getUserCharacterDetail(user, userCharacterId);
	}

	@GetMapping("/main")
	public UserCharacterMainResponse getUserCharacterMain(@Login User user) {
		return userCharacterService.getUserCharacterMain(user);
	}

	@PatchMapping("/main/{userCharacterId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void patchUserCharacterMain(@Login User user, @PathVariable("userCharacterId") Long userCharacterId) {
		userCharacterService.updateUserCharacterMain(user, userCharacterId);
	}

	// 최초 1회 캐릭터 선택 및 배경 지급
	@PostMapping("/initial/main/{userCharacterId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void initialUserCharacterMain(@Login User user, @PathVariable("userCharacterId") Long userCharacterId) {
		userCharacterService.setInitCharacterAndBackground(user, userCharacterId);
	}
}
