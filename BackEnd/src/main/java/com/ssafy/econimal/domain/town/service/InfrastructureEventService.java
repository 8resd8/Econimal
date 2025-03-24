package com.ssafy.econimal.domain.town.service;

import com.ssafy.econimal.domain.carbonlog.entity.CarbonLog;
import com.ssafy.econimal.domain.carbonlog.repository.CarbonLogRepository;
import com.ssafy.econimal.domain.town.dto.EcoAnswerDto;
import com.ssafy.econimal.domain.town.dto.EcoAnswerResponse;
import com.ssafy.econimal.domain.town.dto.EcoQuizDto;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventDetailResponse;
import com.ssafy.econimal.domain.town.dto.InfrastructureEventResponse;
import com.ssafy.econimal.domain.town.dto.TownStatusResponse;
import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.InfrastructureEvent;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureEventRepository;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class InfrastructureEventService {

    private final InfrastructureEventRepository infrastructureEventRepository;
    private final EcoAnswerRepository ecoAnswerRepository;
    private final UserCharacterRepository userCharacterRepository;
    private final CarbonLogRepository carbonLogRepository;
    private final InfrastructureRepository infrastructureRepository;

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

            if (positive != null && negative != null) break;
        }

        return Stream.of(positive, negative)
            .filter(Objects::nonNull)
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

    @Transactional(readOnly = true)
	public InfrastructureEventDetailResponse getInfrastructureEventDetail(Long infraEventId) {
        InfrastructureEvent event = infrastructureEventRepository.findById(infraEventId)
            .orElseThrow(() -> new InvalidArgumentException("존재하지 않는 infraEventId입니다."));

        EcoQuiz quiz = event.getEcoQuiz();
        EcoQuizDto quizDto = EcoQuizDto.from(quiz);

        List<EcoAnswer> shuffledAnswers = getShuffledAnswers(quiz);

        List<EcoAnswerDto> selectedAnswers =
            quiz.getFacility().getEcoType() == EcoType.COURT
                ? selectCourtAnswers(shuffledAnswers)
                : selectGeneralAnswers(shuffledAnswers, quiz);

        return new InfrastructureEventDetailResponse(quizDto, selectedAnswers);
	}

    private EcoAnswer getEcoAnswerById(Long ecoAnswerId) {
        return ecoAnswerRepository.findById(ecoAnswerId)
            .orElseThrow(() -> new InvalidArgumentException("존재하지 않는 ecoAnswerId입니다."));
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

    private void updateCharacterExpression(UserCharacter userCharacter, EcoAnswerResponse response) {
        ExpressionType newExpression = ExpressionType.valueOf(response.expression());
        userCharacter.updateExpression(newExpression);
    }


    public EcoAnswerResponse getEcoAnswer(User user, Long ecoAnswerId) {
        EcoAnswer answer = getEcoAnswerById(ecoAnswerId);
        EcoAnswerResponse response = EcoAnswerResponse.from(answer);
        UserCharacter userCharacter = getMainCharacter(user);

        saveCarbonLog(response, user, answer);
        updateCharacterExpression(userCharacter, response);

        return response;
	}
}
