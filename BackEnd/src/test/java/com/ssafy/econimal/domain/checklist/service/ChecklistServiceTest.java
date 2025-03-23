package com.ssafy.econimal.domain.checklist.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import com.ssafy.econimal.domain.checklist.dto.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class ChecklistServiceTest {

	@Autowired
	private ChecklistService checklistService;

	@Autowired
	private TestEntityHelper helper;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	private Town town;
	private User user;
	private Checklist checklist;
	private UserChecklist userChecklist;

	private final String CHECKLIST_PREFIX = "CC:";

	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);
		checklist = helper.createChecklist(DifficultyType.LOW, EcoType.ELECTRICITY);
		userChecklist = helper.createUserChecklist(user, checklist);
	}

	@Test
	void 체크리스트조회() {
		assertNotNull(checklistService.getUserChecklist(user));
	}

	@Test
	void 커스텀체크리스트생성() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);
		assertEquals(1, redisTemplate.opsForZSet().size(userKey));

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertNotNull(uuids);
		assertEquals(1, uuids.size());

		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualDescription = (String)data.get("description");
			assertEquals("형광등 전원 끄기", actualDescription);
		});
	}

	@Test
	void 커스텀체크리스트삭제() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);
		
		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertNotNull(uuids);
		assertEquals(1, uuids.size());

		uuids.forEach(uuid -> {
			checklistService.deleteChecklist(user, uuid);
		});

		uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertEquals(0, uuids.size());
	}
}
