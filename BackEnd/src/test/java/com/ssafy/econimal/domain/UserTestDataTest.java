package com.ssafy.econimal.domain;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.character.repository.CharacterRepository;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.store.repository.ProductRepository;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:/test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class UserTestDataTest {

	@Autowired
	ProductRepository productRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	InfrastructureRepository infrastructureRepository;

	@Autowired
	CharacterRepository characterRepository;

	@Test
	void 전체유저수() {
		List<User> allUsers = userRepository.findAll();
		assertThat(allUsers.size()).isEqualTo(1);
	}

	@Test
	void 전체캐릭터수() {
		List<Product> products = productRepository.findAll();
		List<Character> characters = characterRepository.findAll();
		assertThat(characters.size()).isEqualTo(4);
	}

	@Test
	void 전체상점항목수() {
		List<Product> products = productRepository.findAll();
		assertThat(products.size()).isEqualTo(4);
	}

	@Test
	void 전체인프라수() {
		List<Infrastructure> infrastructures = infrastructureRepository.findAll();
		assertThat(infrastructures.size()).isEqualTo(4);
	}

}