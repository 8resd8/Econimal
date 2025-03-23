package com.ssafy.econimal.domain.store.repository;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.store.dto.StoreDto;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
// @ActiveProfiles("test")
class ProductCharacterQueryRepositoryTest {

	@Autowired
	private TestEntityHelper helper;

	@Autowired
	private ProductCharacterQueryRepository productCharacterQueryRepository;

	private User user;
	private Town town;
	private Character character1;
	private Character character2;
	private UserCharacter userCharacter;
	private Product product1;
	private Product product2;

	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);

		product1 = helper.createProduct();
		product2 = helper.createProduct();
		character1 = helper.createCharacter(product1);
		character2 = helper.createCharacter(product2);

		userCharacter = helper.createUserCharacter(user, character1);
	}

	@Test
	void 캐릭터상점항목조회() {
		List<StoreDto> charactersStore = productCharacterQueryRepository.findAllCharactersStore(user);

		assertThat(charactersStore.size()).isEqualTo(5); // 테스트로 올리면 2로 바꿔야함
		long ownedCount = charactersStore.stream()
			.filter(StoreDto::owned)
			.count();
		assertThat(ownedCount).isEqualTo(1);
	}
}