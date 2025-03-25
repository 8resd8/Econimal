package com.ssafy.econimal.domain.checklist.service;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;
import java.util.Set;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.checklist.dto.ChecklistCompleteRequest;
import com.ssafy.econimal.domain.checklist.dto.CustomChecklistRequest;
import com.ssafy.econimal.domain.checklist.util.CustomChecklistUtil;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import com.ssafy.econimal.global.util.RedisUtilTest;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:/test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class ChecklistServiceTest {

	@Autowired
	private ChecklistService checklistService;

	@Autowired
	private RedisUtilTest redisUtilTest;

	@Autowired
	UserRepository userRepository;

	@Autowired
	UserCharacterRepository userCharacterRepository;

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	private final String CHECKLIST_PREFIX = "CC:";

	User user;
	UserCharacter userCharacter;

	@BeforeEach
	void setUp() {
		user = userRepository.findById(1L).orElse(null);
		userCharacter = userCharacterRepository.findByUserAndMainIsTrue(user).orElse(null);
	}

	@AfterEach
	void afterAll() {
		redisUtilTest.flushRedis();
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
