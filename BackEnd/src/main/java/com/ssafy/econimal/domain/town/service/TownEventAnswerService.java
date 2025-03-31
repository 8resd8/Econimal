package com.ssafy.econimal.domain.town.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.carbonlog.util.CarbonLogUtil;
import com.ssafy.econimal.domain.character.util.ExpUtil;
import com.ssafy.econimal.domain.town.dto.response.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.util.CoinUtil;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TownEventAnswerService {

	private final InfrastructureEventRepository infrastructureEventRepository;
	private final EcoAnswerRepository ecoAnswerRepository;
	private final UserCharacterRepository userCharacterRepository;
	private final InfrastructureRepository infrastructureRepository;
	private final CarbonLogUtil carbonLogUtil;

	public EcoAnswerResponse getEcoAnswer(User user, Long ecoAnswerId) {
		// 사용자의 선택 가져오기
		EcoAnswer answer = getEcoAnswer(ecoAnswerId);

		// 실제 정답 선지 가져오기
		String description = "";
		if (answer.getEcoQuiz().getFacility().getEcoType().equals(EcoType.COURT)) {
			description = getEcoAnswerDescription(answer.getEcoQuiz().getId());
		}

		EcoAnswerResponse response = EcoAnswerResponse.from(answer, description);
		System.out.println(response.exp());
		UserCharacter userCharacter = getUserCharacter(user);

		carbonLogUtil.saveCarbonLog(response, user, answer);
		rewardCharacter(userCharacter, response);
		InfrastructureEvent event = getEventForAnswer(user, answer);

		// 정답 여부에 따른 배경 변경
		if (response.isOptimal()) {
			event.getInfrastructure().updateClean(true);
		} else {
			event.getInfrastructure().updateClean(false);
		}

		event.deactivate();
		return response;
	}

	private EcoAnswer getEcoAnswer(Long ecoAnswerId) {
		return ecoAnswerRepository.findById(ecoAnswerId)
			.orElseThrow(() -> new InvalidArgumentException("존재하지 않는 ecoAnswerId입니다."));
	}

	private UserCharacter getUserCharacter(User user) {
		return userCharacterRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("메인 캐릭터가 존재하지 않습니다."));
	}

	// 법원(COURT)에 대해서 ecoQuizeId를 이용해서 정답인 선지 설명 반환
	private String getEcoAnswerDescription(Long ecoQuizId) {
		List<EcoAnswer> answerList = ecoAnswerRepository.findAllByEcoQuizId(ecoQuizId);
		for (EcoAnswer answer : answerList) {
			if (answer.getExp() > 0)
				return answer.getDescription();
		}
		throw new InvalidArgumentException("해당 ecoQuizId에서 정답이 없습니다.");
	}

	// 보상 지급
	private void rewardCharacter(UserCharacter userCharacter, EcoAnswerResponse response) {
		userCharacter.updateExpression(ExpressionType.fromString(response.expression()));
		ExpUtil.addExp(response.exp(), userCharacter);
		CoinUtil.addCoin(response.coin(), userCharacter.getUser());
	}

	private InfrastructureEvent getEventForAnswer(User user, EcoAnswer answer) {
		// 유저가 속한 town의 모든 시설(Infrastructure)을 조회
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(user.getTown());

		// 각 시설에서 ecoQuiz와 매칭되는 이벤트를 찾아 반환
		return infrastructures.stream()
			.map(infra -> infrastructureEventRepository.findByInfrastructureAndEcoQuiz(infra.getId(),
				answer.getEcoQuiz().getId()))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.findFirst()
			.orElseThrow(() -> new InvalidArgumentException("해당 유저의 타운 인프라 중 연결된 퀴즈 이벤트가 없습니다."));
	}

}
