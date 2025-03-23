package com.ssafy.econimal.domain.checklist.util;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

public class CustomChecklistUtil {

	private static final String CHECKLIST_PREFIX = "CC:";

	// zset, value: uuid, score: timestamp
	// command: zrange CC:12 0 -1
	// out: "504b3500-9374-46f5-93be-8b72b2d8fb60"
	public static String buildUserKey(User user) {
		return CHECKLIST_PREFIX + user.getId();
	}

	// hash, hashKey: userId, description, isComplete, exp
	// command: hget CC:504b3500-9374-46f5-93be-8b72b2d8fb60 description
	// out: 물 절약하기
	public static String buildHashKey(String checklistId) {
		return CHECKLIST_PREFIX + checklistId;
	}

	// set, value: description
	// command: smembers CC:desc:462
	// out: 물 절약하기
	public static String buildDescKey(User user) {
		return CHECKLIST_PREFIX + "desc:" + user.getId();
	}

	// 체크리스트 최대 개수 확인
	public static void assertChecklistLimitNotExceeded(Long count, int maxChecklistPerDay) {
		if (count != null && count >= maxChecklistPerDay) {
			throw new InvalidArgumentException("체크리스트는 최대 " + maxChecklistPerDay + "개까지만 등록할 수 있습니다.");
		}
	}

	// 체크리스트 중복 검사
	public static void assertDescriptionUnique(Boolean isExist) {
		if (Boolean.TRUE.equals(isExist)) {
			throw new InvalidArgumentException("동일한 체크리스트가 존재합니다.");
		}
	}

	// 체크리스트 존재 여부 검사
	public static void assertChecklistExists(Boolean isExist) {
		if (Boolean.FALSE.equals(isExist)) {
			throw new InvalidArgumentException("해당 체크리스트가 존재하지 않습니다.");
		}
	}

	// 체크리스트 완료 여부 검사
	public static void assertNotCompleted(String isCompleteStr) {
		if (isCompleteStr == null) {
			throw new IllegalArgumentException("잘못된 체크리스트 데이터입니다.");
		}
		if (Boolean.parseBoolean(isCompleteStr)) {
			throw new InvalidArgumentException("이미 완료된 체크리스트입니다.");
		}
	}

	public static long calcExpireSeconds() {
		return ChronoUnit.SECONDS.between(
			LocalDateTime.now(),
			LocalDateTime.now().toLocalDate().plusDays(1).atStartOfDay()
		);
	}
}
