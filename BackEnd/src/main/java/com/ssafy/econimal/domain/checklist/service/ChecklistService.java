package com.ssafy.econimal.domain.checklist.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.util.ExpUtil;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistDetailDto;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDetailDto;
import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.request.ChecklistCompleteRequest;
import com.ssafy.econimal.domain.checklist.dto.response.UserChecklistResponse;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChecklistService {

	private final RedisTemplate<String, String> redisTemplate;
	private final UserChecklistRepository userChecklistRepository;
	private final UserCharacterRepository userCharacterRepository;

	private static final int MAX_CHECKLIST_PER_DAY = 5;
	private static final String CHECKLIST_PREFIX = "CC:";

	public UserChecklistResponse getUserChecklist(User user) {
		DailyUserChecklistDto dailyUserChecklistDto = getDailyUserChecklist(user);
		CustomChecklistDto customChecklistDto = getCustomChecklist(user);
		UserChecklistDto checklists = new UserChecklistDto(dailyUserChecklistDto, customChecklistDto);
		return new UserChecklistResponse(checklists);
	}

	private DailyUserChecklistDto getDailyUserChecklist(User user) {
		List<UserChecklist> userChecklists = userChecklistRepository.findByUser(user);
		List<DailyUserChecklistDetailDto> details = userChecklists.stream()
			.map(DailyUserChecklistDetailDto::of)
			.toList();
		return DailyUserChecklistDto.of(details);
	}

	private CustomChecklistDto getCustomChecklist(User user) {
		String userKey = CustomChecklistUtil.buildUserKey(user);

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		if (uuids == null || uuids.isEmpty()) {
			return CustomChecklistDto.of(Collections.emptyList());
		}

		// User에 해당하는 모든 UUID (checklistId)
		List<CustomChecklistDetailDto> details = uuids.stream()
			.map(uuid -> Optional.of(redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid))
				.filter(data -> !data.isEmpty())
				.map(data -> CustomChecklistDetailDto.of(uuid, data)) // checklist 상세 조회
				.orElse(null))
			.filter(Objects::nonNull)
			.toList();

		return CustomChecklistDto.of(details); // checklist 완료 개수 등 계산
	}

	public void completeChecklist(User user, ChecklistCompleteRequest request) {
		String checklistId = request.checklistId();
		if (request.type().equals("DAILY")) {
			completeDailyChecklist(user, Long.parseLong(checklistId));
		} else {
			completeCustomChecklist(user, checklistId);
		}
	}

	private void completeDailyChecklist(User user, Long checklistId) {
		UserChecklist userChecklist = userChecklistRepository.findByUserAndChecklistId(user, checklistId)
			.orElseThrow(() -> new IllegalArgumentException("해당하는 체크리스트가 없습니다"));
		userChecklistRepository.completeChecklist(userChecklist.getId());

		UserCharacter userCharacter = userCharacterRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("메인 캐릭터를 먼저 골라주세요."));
		ExpUtil.addExp(userChecklist.getChecklist().getExp(), userCharacter);
	}

	private void completeCustomChecklist(User user, String checklistId) {
		String hashKey = CustomChecklistUtil.buildHashKey(checklistId);

		Boolean isExist = redisTemplate.hasKey(hashKey);
		CustomChecklistUtil.assertChecklistExists(isExist);

		// 완료한 체크리스트일 경우 예외
		String isCompleteStr = (String)redisTemplate.opsForHash().get(hashKey, "isComplete");
		CustomChecklistUtil.assertNotCompleted(isCompleteStr);

		redisTemplate.opsForHash().put(hashKey, "isComplete", "true");

		// 경험치 업데이트
		String expStr = (String)redisTemplate.opsForHash().get(hashKey, "exp");
		int exp = expStr != null ? Integer.parseInt(expStr) : 0;
		UserCharacter userCharacter = userCharacterRepository.findByUserAndMainIsTrue(user)
			.orElseThrow(() -> new InvalidArgumentException("메인 캐릭터를 먼저 골라주세요."));
		ExpUtil.addExp(exp, userCharacter);
	}

}
