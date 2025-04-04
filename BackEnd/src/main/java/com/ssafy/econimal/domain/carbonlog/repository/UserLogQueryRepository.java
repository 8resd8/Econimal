package com.ssafy.econimal.domain.carbonlog.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.econimal.domain.carbonlog.entity.QCarbonLog;
import com.ssafy.econimal.domain.globe.dto.LogInfoDto;
import com.ssafy.econimal.domain.globe.dto.UserLogDto;
import com.ssafy.econimal.domain.town.entity.QFacility;
import com.ssafy.econimal.domain.town.entity.QInfrastructure;
import com.ssafy.econimal.domain.town.entity.QInfrastructureEvent;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.EcoType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserLogQueryRepository {

	private final JPAQueryFactory queryFactory;

	public UserLogDto getUserLog(User user) {

		QCarbonLog carbonLog = QCarbonLog.carbonLog;
		QInfrastructureEvent infrastructureEvent = QInfrastructureEvent.infrastructureEvent;
		QInfrastructure infrastructure = QInfrastructure.infrastructure;
		QFacility facility = QFacility.facility;

		// carbonQuantity가 음수인 경우 1, 그렇지 않으면 0을 반환
		NumberExpression<Long> correctSum = new CaseBuilder()
			.when(carbonLog.carbonQuantity.lt(0))
			.then(1L)
			.otherwise(0L)
			.sum();
		NumberExpression<Long> correctExpr = correctSum.as("correct");
		NumberExpression<Long> totalExpr = carbonLog.count().as("total");

		// Tuple 형태로 결과를 fetch() 합니다.
		List<Tuple> results = queryFactory
			.select(
				facility.ecoType,
				correctSum.as("correct"),
				carbonLog.count().as("total")
			)
			.from(carbonLog)
			.join(carbonLog.infrastructureEvent, infrastructureEvent)
			.join(infrastructureEvent.infrastructure, infrastructure)
			.join(infrastructure.facility, facility)
			.where(carbonLog.user.id.eq(user.getId()))
			.groupBy(facility.ecoType)
			.fetch();

		// fetch() 결과를 Map<EcoType, LogInfoDto>로 변환
		Map<EcoType, LogInfoDto> logs = results.stream()
			.collect(Collectors.toMap(
				tuple -> tuple.get(facility.ecoType),
				tuple -> new LogInfoDto(
					Optional.ofNullable(tuple.get(correctExpr)).orElse(0L),
					Optional.ofNullable(tuple.get(totalExpr)).orElse(0L)
				)
			));

		return new UserLogDto(logs);
	}
}
