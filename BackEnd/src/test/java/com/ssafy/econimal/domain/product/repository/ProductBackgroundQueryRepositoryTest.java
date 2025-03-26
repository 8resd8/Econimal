package com.ssafy.econimal.domain.product.repository;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.ProductBackgroundDto;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql")
class ProductBackgroundQueryRepositoryTest {

	@Autowired
	private ProductBackgroundQueryRepository backgroundQueryRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserBackgroundRepository userBackgroundRepository;

	@Test
	void 유저배경상점조회() {
		User user = userRepository.findById(1L).get();

		Product product = productRepository.findById(5L).get();
		UserBackground userBackground = UserBackground.builder()
			.product(product)
			.user(user)
			.isMain(true)
			.build();
		userBackgroundRepository.save(userBackground);

		List<ProductBackgroundDto> background = backgroundQueryRepository.findAllBackground(user);

		assertThat(background).isNotEmpty();
		assertThat(background.size()).isEqualTo(2);
	}
}