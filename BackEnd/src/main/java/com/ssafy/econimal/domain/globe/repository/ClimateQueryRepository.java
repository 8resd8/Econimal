package com.ssafy.econimal.domain.globe.repository;

import static com.ssafy.econimal.domain.globe.entity.QClimates.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.QGlobeInfoDto;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClimateQueryRepository {

	private final JPAQueryFactory queryFactory;

	public List<GlobeInfoDto> findClimateAverageByTime(GlobeInfoRequest request) {

		// 날짜 형식 동적 처리
		String format;
		String dateTimeFormat;
		switch (request.type()) {
			case "HOUR" -> {
				format = "%Y-%m-%d %H:00:00";
				dateTimeFormat = "%Y-%m-%d %H:00:00";
			}
			case "DAY" -> {
				format = "%Y-%m-%d";
				dateTimeFormat = "%Y-%m-%d 00:00:00";
			}
			case "MONTH" -> {
				format = "%Y-%m";
				dateTimeFormat = "%Y-%m-01 00:00:00";
			}
			default -> throw new InvalidArgumentException("Invalid type: " + request.type());
		}

		return queryFactory
			.select(new QGlobeInfoDto(
				climates.countryCode,
				Expressions.dateTemplate(LocalDateTime.class,
					"STR_TO_DATE(DATE_FORMAT({0}, {1}), {2})",
					climates.referenceDate,
					Expressions.constant(format),
					Expressions.constant(dateTimeFormat)
				),
				climates.temperature.avg(),
				climates.humidity.avg()
			))
			.from(climates)
			.where(climates.referenceDate.between(request.startDate(), request.endDate()))
			.groupBy(
				climates.countryCode,
				Expressions.stringTemplate("DATE_FORMAT({0}, {1})", climates.referenceDate,
					Expressions.constant(format))
			)
			.fetch();
	}
}
