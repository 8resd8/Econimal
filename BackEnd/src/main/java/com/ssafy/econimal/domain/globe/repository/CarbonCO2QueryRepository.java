package com.ssafy.econimal.domain.globe.repository;

import static com.ssafy.econimal.domain.globe.entity.QCarbonCO2.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.globe.dto.co2.CarbonCO2Dto;
import com.ssafy.econimal.domain.globe.dto.co2.QCarbonCO2Dto;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CarbonCO2QueryRepository {

	private final JPAQueryFactory queryFactory;

	// 전체
	public List<CarbonCO2Dto> findCO2AverageAll() {
		LocalDateTime now = LocalDateTime.now();
		int fixedDay = 1; // 1일 고정

		StringTemplate formattedDate = Expressions.stringTemplate(
			"CONCAT(CAST({0} AS char), '-', LPAD(CAST({1} AS char), 2, '0'), '-', LPAD(CAST({2} AS char), 2, '0'), ' 00:00:00')",
			carbonCO2.year, Expressions.constant(fixedDay), Expressions.constant(fixedDay)
		);

		// 전체 연도 개수, 1972 ~ 2024, 53개
		// 1972-01-01 00:00:00
		// 1973-01-01 00:00:00
		// 2024-01-01 00:00:00
		// 2025-01-01 00:00:00

		return queryFactory
			.select(new QCarbonCO2Dto(
				carbonCO2.countryCode.as("country"),
				formattedDate,                    // 포맷팅된 날짜 문자열 (예: "2023-01")
				carbonCO2.co2.avg()       // 평균 이산화탄소 농도
			))
			.from(carbonCO2)
			.groupBy(
				carbonCO2.countryCode,
				carbonCO2.year
			)
			.fetch();
	}
}
