package com.ssafy.econimal.domain.checklist.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.checklist.dto.CustomChecklistDetailDto;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistDto;
import com.ssafy.econimal.domain.checklist.dto.request.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomChecklistService {

	private final RedisTemplate<String, String> redisTemplate;

	private static final int MAX_CHECKLIST_PER_DAY = 5;
	private static final String CHECKLIST_PREFIX = "CC:";

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

		// 유효기간 설정
		long ttl = CustomChecklistUtil.calcExpireSeconds();
		redisTemplate.expire(userKey, ttl, TimeUnit.SECONDS);
		redisTemplate.expire(descKey, ttl, TimeUnit.SECONDS);
		redisTemplate.expire(hashKey, ttl, TimeUnit.SECONDS);
	}

	public void updateCustomChecklist(User user, String checklistId, CustomChecklistRequest request) {
		// checklistId : UUID
		String hashKey = CustomChecklistUtil.buildHashKey(checklistId);
		String descKey = CustomChecklistUtil.buildDescKey(user);

		// 완료한 체크리스트일 경우 예외
		String isCompleteStr = (String)redisTemplate.opsForHash().get(hashKey, "isComplete");
		CustomChecklistUtil.assertNotCompleted(isCompleteStr);

		String oldDesc = (String)redisTemplate.opsForHash().get(hashKey, "description");
		String newDesc = request.description();

		// 기존 체크리스트와 동일하지 않으면 업데이트
		if (!Objects.equals(oldDesc, newDesc)) {
			// 체크리스트 내용 중복 여부 체크
			Boolean isExist = redisTemplate.opsForSet().isMember(descKey, newDesc);
			CustomChecklistUtil.assertDescriptionUnique(isExist);

			redisTemplate.opsForHash().put(hashKey, "description", newDesc);
			redisTemplate.opsForSet().add(descKey, newDesc);
			redisTemplate.opsForSet().remove(descKey, oldDesc);
		}
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
