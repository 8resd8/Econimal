package com.ssafy.econimal.domain.auth.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.auth.dto.request.SignupRequest;
import com.ssafy.econimal.domain.town.entity.Infrastructure;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.town.repository.InfrastructureRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.common.enums.UserType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

@SpringBootTest
@Transactional
public class SignUpServiceIntegrationTest {

	@Autowired
	private SignUpService signUpService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserChecklistRepository userChecklistRepository;

	@Autowired
	private InfrastructureRepository infrastructureRepository;

	private SignupRequest signupRequest;

	@BeforeEach
	public void setup() {
		// 4. 회원가입 요청 객체 생성
		signupRequest = new SignupRequest(
			"newuser3@example.com",
			"password123",
			"password123",
			"Test User",
			"testuser",
			LocalDate.of(2020, 2, 1), // LocalDate.of() 사용
			UserType.USER);
	}

	@Test
	@Disabled
	public void 회원가입() {
		User signup = signUpService.signup(signupRequest);

		List<UserChecklist> userChecklists = userChecklistRepository.findByUser(signup);
		assertEquals(3, userChecklists.size());

		Town town = signup.getTown();
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(town);
		assertEquals(4, infrastructures.size());
	}

	@Test
	public void 이메일중복() {
		signUpService.signup(signupRequest);

		// 동일요청 똑같이 보냄
		assertThatThrownBy(() -> signUpService.signup(signupRequest))
			.isInstanceOf(InvalidArgumentException.class);
	}

}
