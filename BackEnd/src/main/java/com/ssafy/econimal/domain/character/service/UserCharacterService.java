package com.ssafy.econimal.domain.character.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterMainDto;
import com.ssafy.econimal.domain.character.dto.UserCharacterMainResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.character.util.ExpUtil;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.global.exception.InitialSettingException;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserCharacterService {

	private final UserCharacterRepository userCharacterRepository;
	private final UserBackgroundRepository userBackgroundRepository;
	private final ProductRepository productRepository;

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
		UserCharacter mainChar = userCharacterRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("메인 캐릭터를 먼저 골라주세요."));
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

	// 최초 1회 메인 캐릭터 선택 및 캐릭터마다 배경 지급
	public void setInitCharacterAndBackground(User user, Long userCharacterId) {
		if (userCharacterRepository.findByUserAndMainIsTrue(user).isPresent()) {
			return; // 예외 발생하지 않고 바로 종료
		}

		UserCharacter userCharacter = userCharacterRepository.findByUserAndId(user, userCharacterId)
			.orElseThrow(() -> new InvalidArgumentException("잘못된 캐릭터 선택입니다."));

		// 메인 캐릭터 선택
		userCharacter.updateIsMain(true);

		// 캐릭터마다 기본 배경 지정
		if (userCharacter.getCharacter().getId().equals(1L)) {
			Product bugibugi = productRepository.findById(1774L)
				.orElseThrow(() -> new InitialSettingException("거북이 배경 지급오류"));

			createUserBackground(user, bugibugi);
		} else if (userCharacter.getCharacter().getId().equals(2L)) {
			Product penguin = productRepository.findById(1775L)
				.orElseThrow(() -> new InitialSettingException("펭귄 배경 지급오류"));
			createUserBackground(user, penguin);

		} else if (userCharacter.getCharacter().getId().equals(3L)) {
			Product horangE = productRepository.findById(1776L)
				.orElseThrow(() -> new InitialSettingException("호랑이 배경 지급오류"));
			createUserBackground(user, horangE);
		}
	}

	private void createUserBackground(User user, Product product) {
		UserBackground userBackground = UserBackground.builder()
			.user(user)
			.product(product)
			.isMain(true)
			.build();
		userBackgroundRepository.save(userBackground);
	}
}
