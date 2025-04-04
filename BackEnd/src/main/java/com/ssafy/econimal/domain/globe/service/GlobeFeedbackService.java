package com.ssafy.econimal.domain.globe.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.carbonlog.repository.CarbonLogRepository;
import com.ssafy.econimal.domain.carbonlog.repository.UserLogQueryRepository;
import com.ssafy.econimal.domain.globe.dto.GlobeAIFeedbackDto;
import com.ssafy.econimal.domain.globe.dto.UserLogDto;
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
		Long totalCarbon = getUserCarbonTotal(user);
		System.out.println(totalCarbon);
		GlobeAIFeedbackDto globeAIFeedbackDto = getAIFeedback(userLogDto, totalCarbon);
		return new GlobeFeedbackResponse(userLogDto, globeAIFeedbackDto);
	}

	// 해당하는 유저의 모든 로그 조회, 정답 개수와 총 개수를 계산
	private UserLogDto getUserLog(User user) {
		return userLogQueryRepository.getUserLog(user);
	}

	// 유저의 총 탄소 변화량을 합산
	private Long getUserCarbonTotal(User user) {
		return carbonLogRepository.getUserCarbonTotal(user.getId());
	}

	// chatGPT 프롬프팅을 통한 피드백 제공
	private GlobeAIFeedbackDto getAIFeedback(UserLogDto userLogDto, Long totalCarbon) {
		return null;
	}
}
