package com.ssafy.econimal.domain.town.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.carbonlog.entity.CarbonLog;
import com.ssafy.econimal.domain.carbonlog.repository.CarbonLogRepository;
import com.ssafy.econimal.domain.character.util.ExpUtil;
import com.ssafy.econimal.domain.town.dto.EcoAnswerDto;
import com.ssafy.econimal.domain.town.dto.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.dto.EcoQuizDto;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownNameUpdateRequest;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.town.util.InfrastructureEventInitializer;
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
public class TownService {

	private final InfrastructureEventRepository infrastructureEventRepository;
	private final EcoAnswerRepository ecoAnswerRepository;
	private final UserCharacterRepository userCharacterRepository;
	private final CarbonLogRepository carbonLogRepository;
	private final InfrastructureRepository infrastructureRepository;
	private final InfrastructureEventInitializer infrastructureEventInitializer;

	private List<EcoAnswer> getShuffledAnswers(EcoQuiz quiz) {
		List<EcoAnswer> answers = new ArrayList<>(ecoAnswerRepository.findAllByEcoQuizId(quiz.getId()));
		Collections.shuffle(answers);
		return answers;
	}

	private List<EcoAnswerDto> selectCourtAnswers(List<EcoAnswer> answers) {
		return answers.stream()
			.limit(4)
			.map(EcoAnswerDto::from)
			.toList();
	}

	private List<EcoAnswerDto> selectGeneralAnswers(List<EcoAnswer> answers, EcoQuiz quiz) {
		EcoAnswerDto positive = null;
		EcoAnswerDto negative = null;

		for (EcoAnswer answer : answers) {
			if (positive == null && answer.getExp() > 0) {
				positive = EcoAnswerDto.from(answer);
			} else if (negative == null && answer.getExp() <= 0) {
				negative = new EcoAnswerDto(answer.getId(), answer.getDescription(), 0);
			}

			if (positive != null && negative != null)
				break;
		}

		return Stream.of(positive, negative)
			.filter(Objects::nonNull)
			.toList();
	}

	private void updateInactiveEvents(List<InfrastructureEvent> events) {
		LocalDateTime now = LocalDateTime.now();
		events.forEach(event -> {
			System.out.println(event.getUpdatedAt());
			// 활성화 되어 있지 않고 1분이 넘었을 경우 활성화, 배경은 그대로
			if (!event.isActive() && event.getUpdatedAt().isBefore(now.minusMinutes(1))) {
				event.updateActive(event.getInfrastructure().isClean(), true);
			}
		});
	}

	private EcoAnswer getEcoAnswerById(Long ecoAnswerId) {
		return ecoAnswerRepository.findById(ecoAnswerId)
			.orElseThrow(() -> new InvalidArgumentException("존재하지 않는 ecoAnswerId입니다."));
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

	private UserCharacter getMainCharacter(User user) {
		return userCharacterRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("메인 캐릭터가 존재하지 않습니다."));
	}

	private void saveCarbonLog(EcoAnswerResponse response, User user, EcoAnswer answer) {
		// 유저가 속한 town의 infrastructure 조회
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(user.getTown());

		// answer가 가진 ecoQuiz와 매칭되는 이벤트 찾기
		InfrastructureEvent infraEvent = infrastructures.stream()
			.map(infra -> infrastructureEventRepository.findByInfrastructureAndEcoQuiz(infra, answer.getEcoQuiz()))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.findFirst()
			.orElseThrow(() -> new InvalidArgumentException("해당 유저의 타운 인프라 중 연결된 퀴즈 이벤트가 없습니다."));

		// CarbonLog 생성 및 저장
		CarbonLog carbonLog = CarbonLog.builder()
			.user(user)
			.infrastructureEvent(infraEvent)
			.ecoAnswer(answer)
			.carbonQuantity(BigDecimal.valueOf(response.carbon()))
			.build();

		carbonLogRepository.save(carbonLog);
	}

	private void updateCharacter(UserCharacter userCharacter, EcoAnswerResponse response) {
		userCharacter.updateExpression(ExpressionType.fromString(response.expression()));
		ExpUtil.addExp(response.exp(), userCharacter);
		CoinUtil.addCoin(response.coin(), userCharacter.getUser());
	}

	private InfrastructureEvent getEventForAnswer(User user, EcoAnswer answer) {
		// 유저가 속한 town의 모든 시설(Infrastructure)을 조회
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(user.getTown());

		// 각 시설에서 ecoQuiz와 매칭되는 이벤트를 찾아 반환
		return infrastructures.stream()
			.map(infra -> infrastructureEventRepository.findByInfrastructureAndEcoQuiz(infra, answer.getEcoQuiz()))
			.filter(Optional::isPresent)
			.map(Optional::get)
			.findFirst()
			.orElseThrow(() -> new InvalidArgumentException("해당 유저의 타운 인프라 중 연결된 퀴즈 이벤트가 없습니다."));
	}

	public EcoAnswerResponse getEcoAnswer(User user, Long ecoAnswerId) {
		// 사용자의 선택 가져오기
		EcoAnswer answer = getEcoAnswerById(ecoAnswerId);

		// 실제 정답 선지 가져오기
		String description = "";
		if (answer.getEcoQuiz().getFacility().getEcoType().equals(EcoType.COURT)) {
			description = getEcoAnswerDescription(answer.getEcoQuiz().getId());
		}

		EcoAnswerResponse response = EcoAnswerResponse.from(answer, description);
		UserCharacter userCharacter = getMainCharacter(user);

		saveCarbonLog(response, user, answer);
		updateCharacter(userCharacter, response);
		InfrastructureEvent event = getEventForAnswer(user, answer);

		// 정답 여부에 따른 배경 변경
		if (response.isOptimal()) {
			event.getInfrastructure().setClean(true);
		} else {
			event.getInfrastructure().setClean(false);
		}

		event.deactivate();
		return response;
	}

	public TownStatusResponse getTownStatus(User user) {
		Town town = user.getTown();

		// 내부 InfrastructureEvent를 조회하기 전 없을 경우 InfrastructureEvent를 추가
		infrastructureEventInitializer.createMissingEventsForTown(town);

		// InfrastructureEvent 조회
		List<InfrastructureEvent> events = infrastructureEventRepository.findByInfrastructureTownId(town.getId());

		updateInactiveEvents(events);

		List<InfrastructureEventResponse> responseList = events.stream()
			.map(InfrastructureEventResponse::from)
			.toList();

		return new TownStatusResponse(user.getTown().getName(), responseList);
	}

	public InfrastructureEventDetailResponse getInfrastructureEventDetail(Long infraEventId) {
		InfrastructureEvent event = infrastructureEventRepository.findById(infraEventId)
			.orElseThrow(() -> new InvalidArgumentException("존재하지 않는 infraEventId입니다."));

		EcoQuiz quiz = event.getEcoQuiz();
		EcoQuizDto quizDto = EcoQuizDto.from(quiz);

		// 랜덤 이벤트 발생을 위한 배열 내 shuffle 진행
		List<EcoAnswer> shuffledAnswers = getShuffledAnswers(quiz);

		// COURT와 나머지 타입에 대해 수행하는 메소드가 다름
		// COURT : 4개 전체 가져옴
		// 나머지 : 좋은 선지와 안좋은 선지 하나씩 가져옴
		List<EcoAnswerDto> selectedAnswers =
			quiz.getFacility().getEcoType() == EcoType.COURT
				? selectCourtAnswers(shuffledAnswers)
				: selectGeneralAnswers(shuffledAnswers, quiz);

		return new InfrastructureEventDetailResponse(quizDto, selectedAnswers);
	}

	public void updateTownName(User user, TownNameUpdateRequest townNameUpdateRequest) {
		user.getTown().updateTownName(townNameUpdateRequest.townName());
	}

}
