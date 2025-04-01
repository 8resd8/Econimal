package com.ssafy.econimal.domain.town.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.town.dto.EcoAnswerDto;
import com.ssafy.econimal.domain.town.dto.EcoQuizDto;
import com.ssafy.econimal.domain.town.dto.response.InfraEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.response.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.response.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TownEventService {

	private final InfrastructureRepository infraRepository;
	private final InfrastructureEventRepository infraEventRepository;
	private final EcoAnswerRepository ecoAnswerRepository;

	public TownStatusResponse getTownStatus(User user) {

		Town town = user.getTown();

		// InfraEvent 조회
		List<InfrastructureEvent> events = infraEventRepository.findLatestByTown(town);

		List<InfrastructureEventResponse> responseList = events.stream()
			.map(InfrastructureEventResponse::from)
			.collect(Collectors.toList());

		return new TownStatusResponse(town.getName(), responseList);
	}

	public InfraEventDetailResponse getInfraEventDetail(Long infraEventId) {
		InfrastructureEvent event = infraEventRepository.findById(infraEventId)
			.orElseThrow(() -> new InvalidArgumentException("존재하지 않는 infraEvent"));

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

		return new InfraEventDetailResponse(quizDto, selectedAnswers);
	}

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

		List<EcoAnswerDto> generalAnswers = new ArrayList<>(Stream.of(positive, negative)
			.filter(Objects::nonNull)
			.toList());

		Collections.shuffle(generalAnswers);
		return generalAnswers;
	}
}
