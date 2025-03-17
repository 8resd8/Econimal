package com.ssafy.econimal.domain.character.service;

import static org.junit.jupiter.api.Assertions.*;

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

@SpringBootTest
@Transactional
public class UserCharacterServiceTest {

	@Autowired
	private UserCharacterService userCharacterService;

	@Autowired
	private TestEntityHelper helper;

	@Test
	void 유저가_보유한_캐릭터_목록_조회() {
		// Given
		Town town = helper.createTown();
		User user = helper.createUser(town);

		Product product1 = helper.createProduct();
		Product product2 = helper.createProduct();

		Character character1 = helper.createCharacter(product1);
		Character character2 = helper.createCharacter(product2);

		helper.createUserCharacter(user, character1);
		helper.createUserCharacter(user, character2);

		// When
		UserCharacterResponse response = userCharacterService.getUserCharacters(user);

		// Then
		assertNotNull(response);
		assertNotNull(response.characters());
		assertEquals(2, response.characters().size());
	}

	@Test
	void 유저가_보유한_특정_캐릭터_상세_조회() {
		// Given
		Town town = helper.createTown();
		User user = helper.createUser(town);

		Product product = helper.createProduct();

		Character character = helper.createCharacter(product);

		UserCharacter userCharacter = helper.createUserCharacter(user, character);
		Long userCharacterId = userCharacter.getId();

		// When
		UserCharacterDetailResponse response = userCharacterService.getUserCharacterDetail(user, userCharacterId);

		// Then
		assertNotNull(response);
	}
}
