package com.ssafy.econimal.domain.character.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCharacterService {

	private final UserCharacterRepository userCharacterRepository;

	public UserCharacterResponse getUserCharacters(User user) {
		return new UserCharacterResponse(userCharacterRepository.findCharacterDtoByUser(user));
	}

	public UserCharacterDetailResponse getUserCharacterDetail(User user, Long userCharacterId) {
		return new UserCharacterDetailResponse(
			userCharacterRepository.findCharacterDetailByUser(user, userCharacterId));
	}

	public void updateUserCharacterMain(User user, Long userCharacterId) {
		// 기존 대표 캐릭터: false 변경
		userCharacterRepository.findByUserAndMainIsTrue(user)
			.ifPresent(userCharacter -> userCharacter.updateIsMain(false));

		// 변경할 대표 캐릭터 true 설정
		userCharacterRepository.findByUserAndId(user, userCharacterId).
			ifPresent(userCharacter -> userCharacter.updateIsMain(true));
	}
}
