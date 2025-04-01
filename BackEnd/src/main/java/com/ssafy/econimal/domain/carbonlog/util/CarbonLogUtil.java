package com.ssafy.econimal.domain.carbonlog.util;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.carbonlog.entity.CarbonLog;
import com.ssafy.econimal.domain.carbonlog.repository.CarbonLogRepository;
import com.ssafy.econimal.domain.town.dto.response.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CarbonLogUtil {

	private final InfrastructureEventRepository infraEventRepository;
	private final InfrastructureRepository infraRepository;
	private final CarbonLogRepository carbonLogRepository;

	public void saveCarbonLog(EcoAnswerResponse response, User user, EcoAnswer answer) {
		// answer가 가진 ecoQuiz와 매칭되는 이벤트 찾기
		InfrastructureEvent infraEvent = infraEventRepository.findByEcoQuizAndTown(
				answer.getEcoQuiz().getId(),
				user.getTown().getId())
			.orElseThrow(() -> new InvalidArgumentException("해당 유저의 타운 인프라 중 연결된 퀴즈 이벤트가 없습니다."));

		// CarbonLog 생성 및 저장
		CarbonLog carbonLog = CarbonLog.createCarbonLog(user, infraEvent, answer,
			BigDecimal.valueOf(response.carbon()));
		carbonLogRepository.save(carbonLog);
	}
}
