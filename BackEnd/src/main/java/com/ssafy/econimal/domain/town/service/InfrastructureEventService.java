package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.town.dto.EcoAnswerDto;
import com.ssafy.econimal.domain.town.dto.EcoQuizDto;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.EcoType;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class InfrastructureEventService {

    private final InfrastructureEventRepository infrastructureEventRepository;
    private final EcoAnswerRepository ecoAnswerRepository;

    private List<EcoAnswer> getShuffledAnswers(EcoQuiz quiz) {
        List<EcoAnswer> answers = new ArrayList<>(ecoAnswerRepository.findAllByEcoQuiz(quiz));
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
        Optional<EcoAnswerDto> positive = answers.stream()
            .filter(a -> a.getExp() > 0)
            .findFirst()
            .map(EcoAnswerDto::from);

        Optional<EcoAnswerDto> negative = answers.stream()
            .filter(a -> a.getExp() < 0)
            .findFirst()
            .map(a -> new EcoAnswerDto(a.getEcoQuiz().getId(), a.getDescription(), 0)); // exp 0으로 보정

        return Stream.of(positive, negative)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .toList();
    }

    @Transactional(readOnly = true)
    public TownStatusResponse getTownStatus(User user) {
        Long townId = user.getTown().getId();
        List<InfrastructureEvent> events = infrastructureEventRepository.findByInfrastructureTownId(townId);

        List<InfrastructureEventResponse> responseList = events.stream()
                .map(InfrastructureEventResponse::from)
                .toList();

        return new TownStatusResponse(user.getTown().getName(), responseList);
    }

    @Transactional
	public InfrastructureEventDetailResponse getInfrastructureEventDetail(User user, Long infraEventId) {
        InfrastructureEvent event = infrastructureEventRepository.findById(infraEventId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 infraEventId입니다."));

        EcoQuiz quiz = event.getEcoQuiz();
        EcoQuizDto quizDto = EcoQuizDto.from(quiz);

        List<EcoAnswer> shuffledAnswers = getShuffledAnswers(quiz);

        List<EcoAnswerDto> selectedAnswers =
            quiz.getFacility().getEcoType() == EcoType.COURT
                ? selectCourtAnswers(shuffledAnswers)
                : selectGeneralAnswers(shuffledAnswers, quiz);

        return new InfrastructureEventDetailResponse(quizDto, selectedAnswers);
	}
}
