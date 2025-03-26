package com.ssafy.econimal.domain.data.sample;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.global.common.enums.CharacterType;

public class CharacterSample {
	public static Character character(Product product) {
		return Character.builder()
			.name("테스트이름")
			.description("설명")
			.type(CharacterType.OCEAN)
			.summary("요약")
			.product(product)
			.build();
	}
}