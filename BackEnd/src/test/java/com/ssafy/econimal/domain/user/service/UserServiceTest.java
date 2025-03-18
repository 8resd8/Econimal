package com.ssafy.econimal.domain.user.service;

import static org.junit.jupiter.api.Assertions.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.dto.UpdateNicknameRequest;
import com.ssafy.econimal.domain.user.dto.UserInfoResponse;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

@SpringBootTest
@Transactional
public class UserServiceTest {

	@Autowired
	private UserService userService;

	@Autowired
	private TestEntityHelper testEntityHelper;

	private Town town;
	private User user;
	private UserInfoResponse response;

	@BeforeEach
	void setUp() {
		town = testEntityHelper.createTown();
		user = testEntityHelper.createUser(town);

		response = userService.getUserInfo(user);
	}

	@Test
	public void 유저정보조회() {
		assertNotNull(response);
		assertEquals(user.getEmail(), response.userInfo().email());
		assertEquals(user.getName(), response.userInfo().name());
		assertEquals(user.getNickname(), response.userInfo().nickname());
	}

	@Test
	public void 닉네임변경성공() {
		String oldNickname = user.getNickname();
		String newNickname = oldNickname + "_new";
		UpdateNicknameRequest request = new UpdateNicknameRequest(newNickname);

		// 닉네임 업데이트 호출
		userService.updateNickname(user, request);

		// 닉네임이 변경되었는지 확인
		assertEquals(newNickname, user.getNickname());
	}

	@Test
	public void 닉네임변경실패() {
		String duplicateNickname = user.getNickname();
		UpdateNicknameRequest request = new UpdateNicknameRequest(duplicateNickname);

		Assertions.assertThatThrownBy(() -> userService.updateNickname(user, request))
			.isInstanceOf(InvalidArgumentException.class);
	}
}
