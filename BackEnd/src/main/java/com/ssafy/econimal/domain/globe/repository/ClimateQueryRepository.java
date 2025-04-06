package com.ssafy.econimal.domain.globe.repository;

import static com.ssafy.econimal.domain.globe.entity.QClimates.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.request.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoV2Dto;
import com.ssafy.econimal.domain.globe.dto.QGlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.QGlobeInfoV2Dto;

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

	// 1년
	public List<GlobeInfoV2Dto> findClimateAverageByYearV2() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime beforeNow = now.minusYears(1);
		int fixedDay = 1; // 1일 고정

		StringTemplate formattedDate = Expressions.stringTemplate(
			"CONCAT(CAST({0} AS char), '-', LPAD(CAST({1} AS char), 2, '0'), '-', LPAD(CAST({2} AS char), 2, '0'), ' 00:00:00')",
			climates.year, climates.month, Expressions.constant(fixedDay)
		);

		// 1년 12달 개수, 12개
		// 2024-01-01 00:00:00
		// 2024-02-01 00:00:00
		// 2024-03-01 00:00:00
		// 2025-01-01 00:00:00

		return queryFactory
			.select(new QGlobeInfoV2Dto(
				climates.countryCode.as("country"),
				formattedDate,                    // 포맷팅된 날짜 문자열 (예: "2023-04")
				climates.temperature.avg(),       // 평균 온도
				climates.humidity.avg()           // 평균 습도
			))
			.from(climates)
			.where(climates.referenceDate.between(beforeNow, now))
			.groupBy(
				climates.countryCode,
				climates.year,
				climates.month
			)
			.fetch();
	}

	public List<GlobeInfoV2Dto> findClimateAverageByMonthV2() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime beforeNow = now.minusMonths(3); // 3달치

		StringTemplate formattedDate = Expressions.stringTemplate(
			"CONCAT(CAST({0} AS char), '-', LPAD(CAST({1} AS char), 2, '0'), '-', LPAD(CAST({2} AS char), 2, '0'), ' 00:00:00')",
			climates.year, climates.month, climates.day);

		// 3달 30일 * 3달 = 약 90개
		// 2024-01-01 00:00:00
		// 2024-01-02 00:00:00
		// 2024-01-03 00:00:00

		return queryFactory
			.select(new QGlobeInfoV2Dto(
				climates.countryCode.as("country"),
				formattedDate,                    // 포맷팅된 날짜
				climates.temperature.avg(),       // 평균 온도
				climates.humidity.avg()           // 평균 습도
			))
			.from(climates)
			.where(climates.referenceDate.between(beforeNow, now))
			.groupBy(
				climates.countryCode,
				climates.year,
				climates.month,
				climates.day
			)
			.fetch();
	}

	public List<GlobeInfoV2Dto> findClimateAverageByDayV2() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime beforeNow = now.minusDays(3); // 3일

		StringTemplate formattedDate = Expressions.stringTemplate(
			"CONCAT(CAST({0} AS char), '-', LPAD(CAST({1} AS char), 2, '0'), '-', LPAD(CAST({2} AS char), 2, '0'), ' ' , LPAD(CAST({3} AS char), 2, '0'), ':00:00')",
			climates.year, climates.month, climates.day, climates.hour);

		// 72시간 24시간 * 3일 = 약 72개
		// 2024-01-01 00:00:00
		// 2024-01-01 01:00:00
		// 2024-01-01 02:00:00

		return queryFactory
			.select(new QGlobeInfoV2Dto(
				climates.countryCode.as("country"),
				formattedDate,                    // 포맷팅된 날짜
				climates.temperature.avg(),       // 평균 온도
				climates.humidity.avg()           // 평균 습도
			))
			.from(climates)
			.where(climates.referenceDate.between(beforeNow, now))
			.groupBy(
				climates.countryCode,
				climates.year,
				climates.month,
				climates.day,
				climates.hour
			)
			.fetch();
	}
}
