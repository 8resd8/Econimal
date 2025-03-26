package com.ssafy.econimal.domain.character.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.dto.UserCharacterDetailResponse;
import com.ssafy.econimal.domain.character.dto.UserCharacterResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class UserCharacterServiceTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserCharacterService userCharacterService;

	@Autowired
	private UserCharacterRepository userCharacterRepository;

	private User user;

	@Autowired
	private UserBackgroundRepository userBackgroundRepository;

	@BeforeEach
	void setUp() {
		user = userRepository.findById(1L).get();
	}

	@Test
	void 유저가_보유한_캐릭터_목록_조회() {
		// When
		UserCharacterResponse response = userCharacterService.getUserCharacters(user);

		// Then
		assertNotNull(response);
		assertNotNull(response.characters());
		assertEquals(3, response.characters().size());
	}

	@Test
	void 유저가_보유한_특정_캐릭터_상세_조회() {
		List<UserCharacter> userCharacters = userCharacterRepository.findAll();

		UserCharacterDetailResponse response = userCharacterService.getUserCharacterDetail(user,
			userCharacters.get(0).getId());

		assertNotNull(response);
	}

	@Test
	void 유저_대표_캐릭터_변경() {
		List<UserCharacter> userCharacters = userCharacterRepository.findAll();
		UserCharacter origin = null;
		UserCharacter change = null;
		for (UserCharacter userCharacter : userCharacters) {
			if (userCharacter.isMain()) {
				origin = userCharacter;
			} else {
				change = userCharacter;
			}
		}

		assertNotNull(origin);
		assertNotNull(change);

		userCharacterService.updateUserCharacterMain(user, change.getId());

		assertThat(origin.isMain()).isFalse();
		assertThat(change.isMain()).isTrue();

		// 유저의 대표 캐릭터가 1개인지 확인
		Optional<UserCharacter> byUserAndMainIsTrue = userCharacterRepository.findByUserAndMainIsTrue(user);
		assertThat(byUserAndMainIsTrue).isPresent();
	}

	// @Test
	// void 최초_1회_메인_캐릭터_선택_및_배경_지급() throws IllegalAccessException, NoSuchFieldException {
	// 	List<UserCharacter> userCharacters = userCharacterRepository.findAll();
	// 	for (UserCharacter userCharacter : userCharacters) {
	// 		userCharacter.updateIsMain(false);
	// 	}
	// 	UserCharacter userCharacter = userCharacters.get(0);
	//
	// 	// 리플렉션으로 id 강제 설정
	// 	Character character = userCharacter.getCharacter();
	// 	Field idFiled = Character.class.getDeclaredField("id");
	// 	idFiled.setAccessible(true);
	// 	idFiled.set(character, 1L);
	//
	// 	userCharacterService.setInitCharacterAndBackground(user, userCharacter.getId());
	//
	// 	// Then
	// 	UserCharacter mainCharacter = userCharacterRepository.findById(userCharacter.getId()).orElse(null);
	// 	assertNotNull(mainCharacter);
	// 	assertTrue(mainCharacter.isMain());
	//
	// 	// 기본 배경 설정 여부 확인
	// 	// Long characterId = mainCharacter.getCharacter().getId();
	// 	// Long expectedBackgroundId = null;
	// 	// if (characterId.equals(1L))
	// 	// 	expectedBackgroundId = 1774L;
	// 	// else if (characterId.equals(2L))
	// 	// 	expectedBackgroundId = 1775L;
	// 	// else if (characterId.equals(3L))
	// 	// 	expectedBackgroundId = 1776L;
	// 	//
	// 	// assertNotNull(expectedBackgroundId);
	// 	//
	// 	// UserBackground background = userBackgroundRepository.findById(expectedBackgroundId).orElse(null);
	// 	// assertNotNull(background);
	// 	// assertTrue(background.isMain());
	//
	// 	// 이미 설정된 경우 예외 테스트
	// 	assertThatThrownBy(() -> userCharacterService.setInitCharacterAndBackground(user, userCharacter.getId()))
	// 		.isInstanceOf(InvalidArgumentException.class);
	// }
}
