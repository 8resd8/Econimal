package com.ssafy.econimal.domain.globe.repository;

import static com.ssafy.econimal.domain.globe.entity.QClimates.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.QGlobeInfoDto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClimateQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<GlobeInfoDto> findClimateAverageByTime(GlobeInfoRequest request) {

		// 날짜 형식 동적 처리
		String format = "";
		switch (request.type().name()) {
			case "HOUR" -> {
				format = "%Y-%m-%d %H:00:00";
			}
			case "DAY" -> {
				format = "%Y-%m-%d 00:00:00";
			}
			case "MONTH" -> {
				format = "%Y-%m-01 00:00:00";
			}
		}

		DateTemplate<String> formattedDate = Expressions.dateTemplate(
			String.class
			, "DATE_FORMAT({0}, {1})"
			, climates.referenceDate
			, ConstantImpl.create(format));

		return queryFactory
			.select(new QGlobeInfoDto(
				climates.countryCode.as("country"),
				formattedDate,
				climates.temperature.avg(),
				climates.humidity.avg()
			))
			.from(climates)
			.where(climates.referenceDate.between(request.startDate(), request.endDate()))
			.groupBy(
				climates.countryCode,
				formattedDate
			)
			.fetch();
	}
}
