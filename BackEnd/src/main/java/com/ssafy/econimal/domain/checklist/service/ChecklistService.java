package com.ssafy.econimal.domain.checklist.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.checklist.dto.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDetailDto;
import com.ssafy.econimal.domain.checklist.dto.DailyUserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.UserChecklistResponse;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChecklistService {

	private final RedisTemplate<String, String> redisTemplate;
	private final UserChecklistRepository userChecklistRepository;

	private static final int MAX_CHECKLIST_PER_DAY = 5;
	private static final String CHECKLIST_PREFIX = "CC:";

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

	public void addCustomChecklist(User user, CustomChecklistRequest request) {
		// 입력 순서 보장을 위한 zset
		// 체크리스트 상세(isComplete 등)을 담을 hash(map)
		// 중복 없는 체크리스트 내용을 담을 set
		String userKey = CustomChecklistUtil.buildUserKey(user);
		String descKey = CustomChecklistUtil.buildDescKey(user);

		// 최대 체크리스트 개수 초과 여부 검사
		Long count = redisTemplate.opsForZSet().size(userKey);
		CustomChecklistUtil.assertChecklistLimitNotExceeded(count, MAX_CHECKLIST_PER_DAY);

		// 체크리스트 내용 중복 여부 체크
		String description = request.description();
		Boolean isMember = redisTemplate.opsForSet().isMember(descKey, description);
		CustomChecklistUtil.assertDescriptionUnique(isMember);

		// 고유 값을 키로 해서 체크리스트 저장
		String uuid = UUID.randomUUID().toString();
		String hashKey = CHECKLIST_PREFIX + uuid;

		redisTemplate.opsForHash().put(hashKey, "userId", user.getId().toString());
		redisTemplate.opsForHash().put(hashKey, "description", description);
		redisTemplate.opsForHash().put(hashKey, "isComplete", "false");
		redisTemplate.opsForHash().put(hashKey, "exp", "30");

		// 체크리스트 입력 순서
		long score = System.currentTimeMillis();
		redisTemplate.opsForZSet().add(userKey, uuid, score);
		redisTemplate.opsForSet().add(descKey, description);
	}

	public void deleteCustomChecklist(User user, String checklistId) {
		// checklistId: UUID
		String userKey = CustomChecklistUtil.buildUserKey(user);
		String hashKey = CustomChecklistUtil.buildHashKey(checklistId);
		String descKey = CustomChecklistUtil.buildDescKey(user);

		// 완료되지 않았으면 체크리스트 set에서 삭제
		checkCompleteAndDelete(hashKey, descKey);

		// UUID에 해당하는 체크리스트 삭제
		redisTemplate.opsForZSet().remove(userKey, checklistId);
		redisTemplate.delete(hashKey);
	}
	
	private void checkCompleteAndDelete(String hashKey, String descKey) {
		Boolean isExist = redisTemplate.hasKey(hashKey);
		CustomChecklistUtil.assertChecklistExists(isExist);

		// 완료한 체크리스트일 경우 예외
		String isCompleteStr = (String)redisTemplate.opsForHash().get(hashKey, "isComplete");
		CustomChecklistUtil.assertNotCompleted(isCompleteStr);

		String oldDesc = (String)redisTemplate.opsForHash().get(hashKey, "description");
		if (oldDesc != null) {
			redisTemplate.opsForSet().remove(descKey, oldDesc);
		}
	}
}
