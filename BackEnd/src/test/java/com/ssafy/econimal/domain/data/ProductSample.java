package com.ssafy.econimal.domain.data;

import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.common.enums.ProductType;

public class ProductSample {
	public static Product product() {
		return Product.builder()
			.price(0)
			.type(ProductType.CHARACTER)
			.build();
	}

}