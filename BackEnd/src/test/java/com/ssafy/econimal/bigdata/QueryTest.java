package com.ssafy.econimal.bigdata;

import static com.ssafy.econimal.domain.bigdata.entity.QClimates.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.bigdata.entity.QClimates;

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
		 c = QClimates.climates;
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

}
