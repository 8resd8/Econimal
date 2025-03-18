package com.ssafy.econimal.domain.character.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterMainDto;
import com.ssafy.econimal.domain.character.dto.UserCharacterMainResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.character.util.ExpUtil;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCharacterService {

	private final UserCharacterRepository userCharacterRepository;

	// 보유한 캐릭터 전체조회
	public UserCharacterResponse getUserCharacters(User user) {
		return new UserCharacterResponse(userCharacterRepository.findCharacterDtoByUser(user));
	}

	// 캐릭터 상세조회
	public UserCharacterDetailResponse getUserCharacterDetail(User user, Long userCharacterId) {
		return new UserCharacterDetailResponse(
			userCharacterRepository.findCharacterDetailByUser(user, userCharacterId));
	}

	// 메인 페이지 캐릭터 상세 조회
	public UserCharacterMainResponse getUserCharacterMain(User user) {
		UserCharacter mainChar = userCharacterRepository.findByUserAndMainIsTrue(user).orElseThrow();
		UserCharacterMainDto mainDto = UserCharacterMainDto.builder()
			.coin(user.getCoin())
			.exp(ExpUtil.getExp(mainChar.getTotalExp(), mainChar))
			.level(ExpUtil.getLevel(mainChar.getTotalExp(), mainChar))
			.expression(mainChar.getExpression())
			.build();

		return new UserCharacterMainResponse(mainDto);
	}

	// 대표 캐릭터 변경
	public void updateUserCharacterMain(User user, Long userCharacterId) {
		// 기존 대표 캐릭터: false 변경
		userCharacterRepository.findByUserAndMainIsTrue(user)
			.ifPresent(userCharacter -> userCharacter.updateIsMain(false));

		// 변경할 대표 캐릭터 true 설정
		userCharacterRepository.findByUserAndId(user, userCharacterId).
			ifPresent(userCharacter -> userCharacter.updateIsMain(true));
	}
}
