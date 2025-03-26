package com.ssafy.econimal.insertdata;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.global.common.enums.ProductType;

@SpringBootTest
public class InsertProduct {

	@Autowired
	private ProductRepository productRepository;

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

}
