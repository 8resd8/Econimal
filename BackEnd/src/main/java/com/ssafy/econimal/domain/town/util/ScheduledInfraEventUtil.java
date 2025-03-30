package com.ssafy.econimal.domain.town.util;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.EcoQuizRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledInfraEventUtil {

	private final InfrastructureRepository infraRepository;
	private final InfrastructureEventRepository infraEventRepository;
	private final EcoQuizRepository ecoQuizRepository;

	/**
	 * 1분 간격으로 실행
	 * 1. 모든 유저의 인프라를 조회
	 * 2. 이벤트가 없거나 다음과 같은 경우 인프라 이벤트 삽입을 실시
	 * 	- 마지막 이벤트가 비활성 상태
	 * 	- 업데이트된 지 1분 이상 지남
	 */
	@Scheduled(fixedRate = 60000)
	public void scheduledInsertInfraEvent() {

		// Hibernate SQL 로거의 기존 레벨을 저장하고 OFF로 변경
		Logger sqlLogger = (Logger)LoggerFactory.getLogger("org.hibernate.SQL");
		Level originalSqlLevel = sqlLogger.getLevel();
		sqlLogger.setLevel(Level.OFF);

		// 필요하다면 Hibernate type 로거도 OFF로 변경
		Logger typeLogger = (Logger)LoggerFactory.getLogger("org.hibernate.type.descriptor.sql");
		Level originalTypeLevel = typeLogger.getLevel();
		typeLogger.setLevel(Level.OFF);

		// long time = System.currentTimeMillis();
		List<Infrastructure> infraList = infraRepository.findAll();
		List<InfrastructureEvent> eventsToInsert = new ArrayList<>();

		for (Infrastructure infra : infraList) {
			InfrastructureEvent newEvent = getNewEventIfRequired(infra);
			if (newEvent != null) {
				eventsToInsert.add(newEvent);
			}
		}

		// 이벤트가 하나라도 있다면 bulk insert 진행
		if (!eventsToInsert.isEmpty()) {
			infraEventRepository.saveAll(eventsToInsert);
		}
		// log.info("총 시간 : {} ms", System.currentTimeMillis() - time);

		// 메서드 종료 후 원래의 로그 레벨로 복구
		sqlLogger.setLevel(originalSqlLevel);
		typeLogger.setLevel(originalTypeLevel);
	}

	private InfrastructureEvent getNewEventIfRequired(Infrastructure infra) {

		InfrastructureEvent lastEvent = infraEventRepository.findTopByInfrastructureOrderByUpdatedAtDesc(infra);

		// 이벤트가 없거나 마지막 이벤트가 비활성 상태이고 업데이트된 지 1분 이상 지난 경우
		if (lastEvent == null ||
			(!lastEvent.isActive() &&
				lastEvent.getUpdatedAt().isBefore(LocalDateTime.now().minusMinutes(1)))
		) {
			List<EcoQuiz> ecoQuizList = ecoQuizRepository.findByFacility(infra.getFacility());

			// 조건에 맞는 EcoQuiz가 없으면 이벤트 미생성
			if (ecoQuizList == null || ecoQuizList.isEmpty()) {
				return null;
			}

			// 랜덤 퀴즈 선택
			EcoQuiz ecoQuiz = ecoQuizList.get(new Random().nextInt(ecoQuizList.size()));

			// 새로운 이벤트 생성
			return InfrastructureEvent.builder()
				.infrastructure(infra)
				.ecoQuiz(ecoQuiz)
				.isActive(true)
				.build();
		}
		return null;
	}
}
