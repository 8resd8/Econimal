package com.ssafy.econimal.domain.character.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.data.helper.TestEntityHelper;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;

@SpringBootTest
@Transactional
public class UserCharacterServiceTest {

	@Autowired
	private UserCharacterService userCharacterService;

	@Autowired
	private TestEntityHelper helper;
	@Autowired
	private UserCharacterRepository userCharacterRepository;

	private Town town;
	private User user;
	private Product product1;
	private Product product2;
	private Character character1;
	private Character character2;
	private UserCharacter userCharacter1;
	private UserCharacter userCharacter2;



	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);

		product1 = helper.createProduct();
		product2 = helper.createProduct();

		character1 = helper.createCharacter(product1);
		character2 = helper.createCharacter(product2);

		userCharacter1 = helper.createUserCharacter(user, character1);
		userCharacter2 = helper.createUserCharacter(user, character2);
	}

	@Test
	void 유저가_보유한_캐릭터_목록_조회() {
		// When
		UserCharacterResponse response = userCharacterService.getUserCharacters(user);

		// Then
		assertNotNull(response);
		assertNotNull(response.characters());
		assertEquals(2, response.characters().size());
	}

	@Test
	void 유저가_보유한_특정_캐릭터_상세_조회() {
		Long userCharacterId = userCharacter1.getId();

		// When
		UserCharacterDetailResponse response = userCharacterService.getUserCharacterDetail(user, userCharacterId);

		// Then
		assertNotNull(response);
	}

	@Test
	void 유저_대표_캐릭터_변경() {
		userCharacter1.updateIsMain(true); // 초기 대표 캐릭터 설정
		Long newMainCharacterId = userCharacter2.getId();

		// When
		userCharacterService.updateUserCharacterMain(user, newMainCharacterId);

		// Then
		UserCharacter newMainCharacter = userCharacterRepository.findById(newMainCharacterId).orElse(null);
		assertNotNull(newMainCharacter);
		assertTrue(newMainCharacter.isMain());

		UserCharacter oldMainCharacter = userCharacterRepository.findById(userCharacter1.getId()).orElse(null);
		assertNotNull(oldMainCharacter);
		assertFalse(oldMainCharacter.isMain());

		// 유저의 대표 캐릭터가 1개인지 확인
		Optional<UserCharacter> byUserAndMainIsTrue = userCharacterRepository.findByUserAndMainIsTrue(user);
		Assertions.assertThat(byUserAndMainIsTrue).isPresent();
	}
}
