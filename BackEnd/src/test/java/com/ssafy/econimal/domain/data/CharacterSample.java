package com.ssafy.econimal.domain.data;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.store.entity.Product;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.global.common.enums.CharacterType;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.common.enums.ProductType;

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