package com.ssafy.econimal.bigdata;

import static com.ssafy.econimal.domain.globe.entity.QClimates.*;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.ConstantImpl;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.DateTemplate;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.globe.entity.QClimates;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@SpringBootTest
@Transactional
public class QueryTest {

	@PersistenceContext
	EntityManager em;

	@Autowired
	JPAQueryFactory queryFactory;

	QClimates c;

	@BeforeEach
	void setUp() {
		c = climates;
	}

	@Test
	@Disabled
	void 국가별평균온도() {
		List<Tuple> fetch = queryFactory
			.select(c.countryCode, c.temperature.avg())
			.from(climates)
			.groupBy(c.countryCode)
			.fetch();

		// 41.3초
		fetch.forEach(System.out::println);
	}

	@Test
	@Disabled
	void 연도별평균온도() {
		List<Tuple> fetch = queryFactory
			.select(c.year, c.temperature.avg())
			.from(climates)
			.groupBy(c.year)
			.fetch();

		// 31.8초
		fetch.forEach(System.out::println);
	}

	@Test
	@Disabled
	void 국가별월별평균기후() {
		List<Tuple> fetch = queryFactory
			.select(
				c.countryCode,
				Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m')", c.referenceDate).as("ym"),
				c.temperature.avg(),
				c.humidity.avg()
			)
			.from(c)
			.groupBy(
				c.countryCode,
				Expressions.stringTemplate("DATE_FORMAT({0}, '%Y-%m')", c.referenceDate)
			)
			.fetch();

		fetch.forEach(System.out::println);
	}

	public static record GlobeInfoDto(
		String country,
		String formattedDateTime,
		Double avgTemperature,
		Double avgHumidity) {
	}

	@Test
	@Disabled
	void 날짜별_기후조회() {
		String type = "DAY"; // "HOUR", "DAY", "MONTH" 중 선택
		LocalDateTime startDate = LocalDateTime.of(2023, 1, 1, 0, 0);
		LocalDateTime endDate = LocalDateTime.of(2023, 12, 31, 23, 59);

		String format = "";
		String dateTimeFormat = "";
		switch (type) {
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
			default -> System.out.println("실패");
		}

		System.out.println("날짜 포맷: " + format + ", " + dateTimeFormat);

		DateTemplate<String> formattedDate = Expressions.dateTemplate(
			String.class
			, "DATE_FORMAT({0}, {1})"
			, climates.referenceDate
			, ConstantImpl.create("%Y-%m-%d"));

		List<GlobeInfoDto> results = queryFactory
			.select(Projections.constructor(
				GlobeInfoDto.class,
				climates.countryCode,
				formattedDate,
				climates.temperature.avg(),
				climates.humidity.avg()
			))
			.from(climates)
			.where(climates.referenceDate.between(startDate, endDate))
			.groupBy(
				climates.countryCode,
				formattedDate
			)
			.fetch();

		System.out.println("전체 그룹 개수: " + results.size());

		for (int i = 0; i < 100; i++) {
			System.out.println("results.get(i) = " + results.get(i));
		}
		results.forEach(System.out::println);
	}

}
