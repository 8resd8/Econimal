package com.ssafy.econimal.domain.auth.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.auth.dto.SignupRequest;
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
	public void 회원가입() {
		signUpService.signup(signupRequest);

		// Assert: 회원가입 후 User가 생성되었는지 검증
		Optional<User> user = userRepository.findByEmail(signupRequest.email());
		assertThat(user).isPresent();

		User findUser = user.get();

		List<UserChecklist> userChecklists = userChecklistRepository.findByUser(findUser);
		assertEquals(3, userChecklists.size(), "체크리스트 3건이 등록되어야 합니다.");

		Town town = findUser.getTown();
		List<Infrastructure> infrastructures = infrastructureRepository.findByTown(town);
		assertEquals(4, infrastructures.size(), "인프라스트럭처 2건이 등록되어야 합니다.");
	}

	@Test
	public void 이메일중복() {
		signUpService.signup(signupRequest);

		// 동일요청 똑같이 보냄
		assertThatThrownBy(() -> signUpService.signup(signupRequest))
			.isInstanceOf(InvalidArgumentException.class);

	}

}
