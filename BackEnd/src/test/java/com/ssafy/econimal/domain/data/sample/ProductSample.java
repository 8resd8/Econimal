package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.global.common.enums.ProductType;

public class ProductSample {
	public static Product product() {
		return Product.builder()
			.price(0)
			.type(ProductType.CHARACTER)
			.build();
	}

}