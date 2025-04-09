package com.ssafy.econimal.domain.globe.service;

import static com.ssafy.econimal.global.util.Prompt.*;

import java.util.Optional;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.econimal.domain.carbonlog.repository.CarbonLogRepository;
import com.ssafy.econimal.domain.carbonlog.repository.UserLogQueryRepository;
import com.ssafy.econimal.domain.globe.dto.UserLogDto;
import com.ssafy.econimal.domain.globe.dto.response.GlobeAIResponseDto;
import com.ssafy.econimal.domain.globe.dto.response.GlobeFeedbackResponse;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class GlobeFeedbackService {

	private final ChatModel chatModel;
	private final CarbonLogRepository carbonLogRepository;
	private final UserLogQueryRepository userLogQueryRepository;

	// controller 에게 응답 제공
	@Transactional(readOnly = true)
	public GlobeFeedbackResponse getFeedback(User user) {
		UserLogDto userLogDto = getUserLog(user);
		Double totalCarbon = Optional.ofNullable(getUserCarbonTotal(user)).orElse(0.0);
		GlobeAIResponseDto globeAIFeedbackDto = getAIFeedback(userLogDto, totalCarbon);
		return new GlobeFeedbackResponse(userLogDto, globeAIFeedbackDto);
	}

	// 해당하는 유저의 모든 로그 조회, 정답 개수와 총 개수를 계산
	private UserLogDto getUserLog(User user) {
		return userLogQueryRepository.getUserLog(user);
	}

	// 유저의 총 탄소 변화량을 합산
	private Double getUserCarbonTotal(User user) {
		return carbonLogRepository.getUserCarbonTotal(user.getId());
	}

	// chatGPT 프롬프팅을 통한 피드백 제공
	private GlobeAIResponseDto getAIFeedback(UserLogDto userLogDto, Double totalCarbon) {
		String aiResponse = chatModel.call(globeFeedbackPrompt(userLogDto, totalCarbon));
		ObjectMapper objectMapper = new ObjectMapper();
		GlobeAIResponseDto response = null;
		try {
			response = objectMapper.readValue(aiResponse, GlobeAIResponseDto.class);
			return response;
		} catch (JsonProcessingException e) {
			return new GlobeAIResponseDto("파싱 실패", 0.0, 0.0);
		}
	}
}
