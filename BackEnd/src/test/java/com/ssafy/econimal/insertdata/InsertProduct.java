package com.ssafy.econimal.insertdata;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.common.enums.ProductType;

@SpringBootTest
public class InsertProduct {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserBackgroundRepository backgroundRepository;

	@Autowired
	private UserBackgroundRepository userBackgroundRepository;

	@Test
	@Disabled
	void 배경상점항목추가() {
		int price = 200;
		for (int i = 0; i < 6; i++) {
			Product background = Product.builder()
				.type(ProductType.BACKGROUND)
				.price(price)
				.build();
			price += 50;
			productRepository.save(background);
		}

	}

	@Test
	@Disabled
	void 유저배경추가() {
		User user = userRepository.findById(12L).get();
		Product product = productRepository.findById(1779L).get();
		UserBackground userBackground = UserBackground.builder()
			.product(product)
			.user(user)
			.isMain(true)
			.build();
		userBackgroundRepository.save(userBackground);
	}

}
