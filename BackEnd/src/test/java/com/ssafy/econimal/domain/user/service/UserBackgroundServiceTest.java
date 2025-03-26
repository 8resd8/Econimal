package com.ssafy.econimal.domain.user.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class UserBackgroundServiceTest {
	@Autowired
	UserRepository userRepository;

	@Autowired
	UserBackgroundRepository userBackgroundRepository;

	@Autowired
	UserBackgroundService userBackgroundService;

	User user;
	@Autowired
	private ProductRepository productRepository;

	@BeforeEach
	void setUp() {
		user = userRepository.findById(1L).get();
	}

	@Test
	void 배경변경() {
		Product product = productRepository.findById(6L).get();
		// 새 배경 추가
		UserBackground userBackground = UserBackground.builder()
			.product(product)
			.user(user)
			.isMain(false)
			.build();

		UserBackground updateBackground = userBackgroundRepository.save(userBackground);
		UserBackground originBackground = userBackgroundRepository.findByUserAndMainIsTrue(user).get();

		userBackgroundService.updateBackground(user, updateBackground.getId());

		assertThat(originBackground.isMain()).isFalse();
		assertThat(updateBackground.isMain()).isTrue();
	}
}