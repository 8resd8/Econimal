package com.ssafy.econimal.domain.store.repository;

import static com.ssafy.econimal.domain.character.entity.QCharacter.*;
import static com.ssafy.econimal.domain.store.entity.QProduct.*;
import static com.ssafy.econimal.domain.user.entity.QUserCharacter.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.store.dto.QStoreDto;
import com.ssafy.econimal.domain.store.dto.StoreDto;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductCharacterQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<StoreDto> findAllCharactersStore(User user) {
		return queryFactory
			.select(new QStoreDto(
				product.id,
				character.name.as("characterName"),
				userCharacter.id.isNotNull()
			))
			.from(character)
			.leftJoin(userCharacter)
			.on(userCharacter.character.eq(character), userCharacter.user.id.eq(user.getId()))
			.fetch();
	}
}
