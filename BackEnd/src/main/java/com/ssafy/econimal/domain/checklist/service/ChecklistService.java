package com.ssafy.econimal.domain.checklist.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDetailDto;
import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChecklistService {

	private final UserChecklistRepository userChecklistRepository;

	public UserChecklistResponse getUserChecklist(User user) {
		DailyUserChecklistDto dailyUserChecklistDto = getDailyUserChecklist(user);
		UserChecklistDto checklists = new UserChecklistDto(dailyUserChecklistDto);
		return new UserChecklistResponse(checklists);
	}

	private DailyUserChecklistDto getDailyUserChecklist(User user) {
		List<UserChecklist> userChecklists = userChecklistRepository.findByUser(user);
		List<DailyUserChecklistDetailDto> details = userChecklists.stream()
			.map(DailyUserChecklistDetailDto::of)
			.toList();
		return DailyUserChecklistDto.of(details);
	}
}
