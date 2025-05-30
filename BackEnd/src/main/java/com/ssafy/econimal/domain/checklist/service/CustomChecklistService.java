package com.ssafy.econimal.domain.checklist.service;

import static com.ssafy.econimal.global.util.Prompt.*;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistAIDto;
import com.ssafy.econimal.domain.checklist.dto.request.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.dto.request.CustomChecklistValidationRequest;
import com.ssafy.econimal.domain.checklist.dto.response.CustomChecklistResponse;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomChecklistService {

	private final RedisTemplate<String, String> redisTemplate;
	private final ChatModel chatModel;

	private static final int MAX_CHECKLIST_PER_DAY = 5;
	private static final String CHECKLIST_PREFIX = "CC:";
	private static final String EXP_PREFIX = "EE:";

	// AI 환경내용 검사
	public CustomChecklistResponse CustomChecklistValidation(User user, CustomChecklistValidationRequest request) {
		String aiResponse = chatModel.call(environmentPrompt(request.description()));

		ObjectMapper objectMapper = new ObjectMapper();
		CustomChecklistAIDto response = null;
		boolean result = false;
		int exp = 0;
		try {
			response = objectMapper.readValue(aiResponse, CustomChecklistAIDto.class);
			if (response.point() >= 6) {
				result = true;
				exp = response.point() * 2;
			}
		} catch (JsonProcessingException e) {
			return new CustomChecklistResponse(new CustomChecklistAIDto(0, "파싱 실패"), result, exp, "Not Created UUID");
		}

		// 경험치 저장
		String uuid = getUuid();
		redisTemplate.opsForValue().set(EXP_PREFIX + user.getId() + uuid, String.valueOf(exp));

		return new CustomChecklistResponse(response, result, exp, uuid);
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
		String uuid = getUuid();
		String hashKey = CHECKLIST_PREFIX + uuid;

		redisTemplate.opsForHash().put(hashKey, "userId", user.getId().toString());
		redisTemplate.opsForHash().put(hashKey, "description", description);
		redisTemplate.opsForHash().put(hashKey, "isComplete", "false");

		// AI 검증에서 경험치 가져와서 입력
		String exp = redisTemplate.opsForValue().get(EXP_PREFIX + user.getId() + request.expId());
		redisTemplate.opsForHash().put(hashKey, "exp", exp == null ? "0" : exp);

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

			// AI 검증에서 경험치 가져와서 입력
			String exp = redisTemplate.opsForValue().get(EXP_PREFIX + user.getId() + request.expId());
			System.out.println(exp);
			redisTemplate.opsForHash().put(hashKey, "exp", exp == null ? "0" : exp);

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

	private static String getUuid() {
		return UUID.randomUUID().toString();
	}
}
