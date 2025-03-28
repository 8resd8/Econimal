package com.ssafy.econimal.domain.product.repository;

import static com.ssafy.econimal.domain.product.entity.QProduct.*;
import static com.ssafy.econimal.domain.user.entity.QUserBackground.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.product.dto.ProductBackgroundDto;
import com.ssafy.econimal.domain.product.dto.QProductBackgroundDto;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.ProductType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ProductBackgroundQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<ProductBackgroundDto> findAllBackground(User user) {
		return queryFactory
			.select(new QProductBackgroundDto(
				product.id,
				userBackground.product.isNotNull(),
				product.price
			))
			.from(product)
			.leftJoin(userBackground)
			.on(product.id.eq(userBackground.product.id)
				.and(userBackground.user.eq(user)))
			.where(product.type.eq(ProductType.BACKGROUND))
			.fetch();
	}
}
