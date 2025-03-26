package com.ssafy.econimal.domain.product.repository;

import static com.ssafy.econimal.domain.character.entity.QCharacter.*;
import static com.ssafy.econimal.domain.product.entity.QProduct.*;
import static com.ssafy.econimal.domain.user.entity.QUserCharacter.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.product.dto.ProductCharacterDto;
import com.ssafy.econimal.domain.product.dto.QProductCharacterDto;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.ProductType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductCharacterQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<ProductCharacterDto> findAllCharactersStore(User user) {
		return queryFactory
			.select(new QProductCharacterDto(
				product.id,
				character.name.as("characterName"),
				userCharacter.id.isNotNull(),
				product.price
			))
			.from(character)
			.leftJoin(userCharacter)
			.on(userCharacter.character.eq(character), userCharacter.user.id.eq(user.getId()))
			.where(product.type.eq(ProductType.CHARACTER))
			.fetch();
	}
}
