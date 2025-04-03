package com.ssafy.econimal.domain.globe.repository;

import static com.ssafy.econimal.domain.globe.entity.QClimates.*;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
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

	public List<GlobeInfoDto> findClimateAverageByTimeV2(GlobeInfoRequest request) {
		// MySQL의 DATE_FORMAT 함수를 사용하여 날짜를 "연도-월-일 시간:00:00" 형식으로 포맷팅
		StringTemplate formattedDate = Expressions.stringTemplate(
			"DATE_FORMAT({0}, '%Y-%m-%d %H:00:00')",
			climates.referenceDate
		);

		return queryFactory
			.select(new QGlobeInfoDto(
				climates.countryCode.as("country"),
				formattedDate,                // 포맷팅된 날짜 문자열
				climates.temperature.avg(),   // 평균 온도
				climates.humidity.avg()       // 평균 습도
			))
			.from(climates)
			.where(climates.referenceDate.between(request.startDate(), request.endDate()))
			.groupBy(
				climates.countryCode,
				formattedDate               // GROUP BY에 동일한 DATE_FORMAT 표현식을 사용
			)
			.fetch();
	}

}
