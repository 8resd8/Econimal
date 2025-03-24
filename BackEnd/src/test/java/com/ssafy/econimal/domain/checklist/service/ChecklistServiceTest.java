package com.ssafy.econimal.domain.checklist.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.util.Set;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import com.ssafy.econimal.domain.checklist.dto.ChecklistCompleteRequest;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

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
	void 커스텀체크리스트생성_실패_중복내용() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);
		assertEquals(1, redisTemplate.opsForZSet().size(userKey));

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertNotNull(uuids);
		assertEquals(1, uuids.size());

		Assertions.assertThatThrownBy(() -> checklistService.addCustomChecklist(user, request))
			.isInstanceOf(InvalidArgumentException.class)
			.hasMessage("동일한 체크리스트가 존재합니다.");
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
			checklistService.deleteCustomChecklist(user, uuid);
		});

		uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertEquals(0, uuids.size());
	}

	@Test
	@Disabled
	void 커스텀체크리스트삭제_실패_완료된체크리스트() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertNotNull(uuids);
		assertEquals(1, uuids.size());

		uuids.forEach(uuid -> {
			ChecklistCompleteRequest completeRequest = new ChecklistCompleteRequest("CUSTOM", uuid);
			checklistService.completeChecklist(user, completeRequest);
			Assertions.assertThatThrownBy(() -> checklistService.deleteCustomChecklist(user, uuid))
				.isInstanceOf(InvalidArgumentException.class)
				.hasMessage("이미 완료된 체크리스트입니다.");
		});

		uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		assertEquals(1, uuids.size());
	}

	@Test
	void 커스텀체크리스트수정() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualDescription = (String)data.get("description");
			assertEquals("형광등 전원 끄기", actualDescription);
		});

		CustomChecklistRequest newRequest = new CustomChecklistRequest("수도꼭지 잠그기");
		uuids.forEach(uuid -> {
			checklistService.updateCustomChecklist(user, uuid, newRequest);
		});

		assertEquals(1, uuids.size());
		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualDescription = (String)data.get("description");
			assertEquals("수도꼭지 잠그기", actualDescription);
		});
	}

	@Test
	@Disabled
	void 커스텀체크리스트수정_실패_완료된체크리스트() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualDescription = (String)data.get("description");
			assertEquals("형광등 전원 끄기", actualDescription);
		});

		uuids.forEach(uuid -> {
			ChecklistCompleteRequest completeRequest = new ChecklistCompleteRequest("CUSTOM", uuid);
			checklistService.completeChecklist(user, completeRequest);

			CustomChecklistRequest newRequest = new CustomChecklistRequest("수도꼭지 잠그기");
			Assertions.assertThatThrownBy(() -> checklistService.updateCustomChecklist(user, uuid, newRequest))
				.isInstanceOf(InvalidArgumentException.class)
				.hasMessage("이미 완료된 체크리스트입니다.");
		});
	}

	@Test
	@Disabled
	void 커스텀체크리스트완료() {
		CustomChecklistRequest request = new CustomChecklistRequest("형광등 전원 끄기");
		checklistService.addCustomChecklist(user, request);
		String userKey = CustomChecklistUtil.buildUserKey(user);

		Set<String> uuids = redisTemplate.opsForZSet().range(userKey, 0, -1);
		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualComplete = (String)data.get("isComplete");
			assertEquals("false", actualComplete);
		});

		uuids.forEach(uuid -> {
			ChecklistCompleteRequest completeRequest = new ChecklistCompleteRequest("CUSTOM", uuid);
			checklistService.completeChecklist(user, completeRequest);
		});

		uuids.forEach(uuid -> {
			Map<Object, Object> data = redisTemplate.opsForHash().entries(CHECKLIST_PREFIX + uuid);
			String actualComplete = (String)data.get("isComplete");
			assertEquals("true", actualComplete);
		});
	}
}
