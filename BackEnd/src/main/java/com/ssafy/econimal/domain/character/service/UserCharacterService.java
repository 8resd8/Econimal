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
@Transactional(readOnly = true)
public class UserCharacterService {

	private final UserCharacterRepository userCharacterRepository;

	public UserCharacterResponse getUserCharacters(User user) {
		return new UserCharacterResponse(userCharacterRepository.findCharacterDtoByUser(user));
	}

	public UserCharacterDetailResponse getUserCharacterDetail(User user, Long userCharacterId) {
		return new UserCharacterDetailResponse(
			userCharacterRepository.findCharacterDetailByUser(user, userCharacterId));
	}
}
