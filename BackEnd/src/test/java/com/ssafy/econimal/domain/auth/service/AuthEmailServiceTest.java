package com.ssafy.econimal.domain.auth.service;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.ssafy.econimal.domain.auth.dto.request.UpdatePasswordRequest;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
class AuthEmailServiceTest {

	@Autowired
	private TestEntityHelper helper;

	@Autowired
	private AuthEmailService authEmailService;

	@Autowired
	private BCryptPasswordEncoder encoder;

	@Autowired
	private UserRepository userRepository;

	private Town town;
	private User user;

	@BeforeEach
	void setUp() {
		town = helper.createTown();
		user = helper.createUser(town);
	}

	@Test
	void 비밀번호변경성공() {
		UpdatePasswordRequest request = new UpdatePasswordRequest(
			user.getId(),
			"newPassword!",
			"newPassword!");

		authEmailService.updatePassword(request);

		User updateUser = userRepository.findById(user.getId()).orElse(null);

		assertThat(updateUser).isNotNull();
		assertThat(encoder.matches(request.newPassword1(), updateUser.getPassword())).isTrue();
	}

	@Test
	void 비밀번호변경실패() {
		UpdatePasswordRequest request = new UpdatePasswordRequest(
			user.getId(),
			"newPassword!",
			"worngworngworng!!");

		User updateUser = userRepository.findById(user.getId()).orElse(null);

		assertThat(updateUser).isNotNull();
		assertThatThrownBy(() -> authEmailService.updatePassword(request))
			.isInstanceOf(InvalidArgumentException.class);
	}
}