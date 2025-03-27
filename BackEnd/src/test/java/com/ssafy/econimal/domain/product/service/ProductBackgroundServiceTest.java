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

import com.ssafy.econimal.domain.product.dto.ProductBackgroundDto;
import com.ssafy.econimal.domain.product.dto.ProductBackgroundResponse;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class ProductBackgroundServiceTest {
	@Autowired
	UserRepository userRepository;

	@Autowired
	UserBackgroundRepository userBackgroundRepository;

	@Autowired
	ProductBackgroundService productBackgroundService;

	@Autowired
	private ProductRepository productRepository;

	User user;

	@BeforeEach
	void setUp() {
		user = userRepository.findById(1L).get();
	}

	@Test
	void 배경상점조회() {
		ProductBackgroundResponse actual = productBackgroundService.getBackgroundProducts(user);

		List<ProductBackgroundDto> products = actual.products();
		assertThat(products.size()).isEqualTo(2);
	}

	@Test
	void 배경구입실패() {
		Product product = productRepository.findById(5L).get();

		assertThatThrownBy(() -> productBackgroundService.buyBackgroundProduct(user, product.getId()))
			.isInstanceOf(InvalidArgumentException.class)
			.hasMessage("보유한 코인이 부족합니다.");
	}

	@Test
	void 배경구입성공() {
		Product product = productRepository.findById(6L).get(); // 200원
		user.updateCoin(500);

		productBackgroundService.buyBackgroundProduct(user, product.getId());
		List<UserBackground> userBackground = userBackgroundRepository.findByUser(user);

		assertThat(user.getCoin()).isEqualTo(200); // 500 - 300
		assertThat(userBackground.size()).isEqualTo(2);
	}
}