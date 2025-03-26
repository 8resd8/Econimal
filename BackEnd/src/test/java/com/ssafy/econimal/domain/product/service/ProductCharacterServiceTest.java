package com.ssafy.econimal.domain.product.service;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.ProductCharacterDto;
import com.ssafy.econimal.domain.product.dto.ProductCharacterResponse;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql")
class ProductCharacterServiceTest {

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserCharacterRepository userCharacterRepository;

	@Autowired
	ProductCharacterService productCharacterService;

	User user;
	
	@Autowired
	private ProductRepository productRepository;

	@BeforeEach
	void setUp() {
		user = userRepository.findById(1L).get();
	}

	@Test
	void 캐릭터상점조회() {
		ProductCharacterResponse actual = productCharacterService.getCharacterProducts(user);
		assertThat(actual).isNotNull();

		List<ProductCharacterDto> products = actual.products();
		assertThat(products.size()).isEqualTo(4);
	}

	@Test
	void 캐릭터구입실패() {
		Product product = productRepository.findById(4L).get();

		assertThatThrownBy(() -> productCharacterService.buyCharacterProduct(user, product.getId()))
			.isInstanceOf(InvalidArgumentException.class)
			.hasMessage("보유한 코인이 부족합니다.");
	}

	@Test
	void 캐릭터구입성공() {
		Product product = productRepository.findById(4L).get();
		user.updateCoin(500);

		productCharacterService.buyCharacterProduct(user, product.getId());
		List<UserCharacter> userCharacters = userCharacterRepository.findByUser(user);

		assertThat(user.getCoin()).isEqualTo(0);
		assertThat(userCharacters.size()).isEqualTo(4);
	}
}