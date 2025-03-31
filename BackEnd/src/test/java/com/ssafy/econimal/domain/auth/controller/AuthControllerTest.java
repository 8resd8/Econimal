package com.ssafy.econimal.domain.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.ssafy.econimal.domain.auth.dto.request.EmailDuplicationRequest;
import com.ssafy.econimal.domain.auth.dto.request.LoginRequest;
import com.ssafy.econimal.domain.auth.dto.request.SignupRequest;
import com.ssafy.econimal.domain.auth.dto.response.EmailDuplicationResponse;
import com.ssafy.econimal.domain.auth.dto.response.LoginResponse;
import com.ssafy.econimal.domain.auth.dto.response.RefreshResponse;
import com.ssafy.econimal.domain.auth.service.LoginService;
import com.ssafy.econimal.domain.auth.service.LogoutService;
import com.ssafy.econimal.domain.auth.service.SignUpService;
import com.ssafy.econimal.domain.data.TestEntityHelper;
import com.ssafy.econimal.domain.data.sample.TownSample;
import com.ssafy.econimal.domain.data.sample.UserSample;
import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.UserType;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

	private TestEntityHelper helper;

	@Mock
	private SignUpService signUpService;

	@Mock
	private LoginService loginService;

	@Mock
	private LogoutService logoutService;

	@Mock
	private HttpServletResponse httpServletResponse;

	@InjectMocks
	private AuthController authController;

	private MockMvc mockMvc;
	private ObjectMapper objectMapper;

	@BeforeEach
	void setUp() {
		mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
		objectMapper = new ObjectMapper();
		JavaTimeModule javaTimeModule = new JavaTimeModule();
		javaTimeModule.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ISO_DATE));
		objectMapper.registerModule(javaTimeModule);
	}

	@Test
	void 회원가입성공() throws Exception {
		SignupRequest request = new SignupRequest(
			"dkanfjgwls@naver.com",
			"!password",
			"!password",
			"Test User",
			"test",
			LocalDate.of(2020, 2, 1),
			UserType.USER);

		Town town = TownSample.town();
		User user = UserSample.user(town);
		when(signUpService.signup(request)).thenReturn(user);

		mockMvc.perform(post("/users/signup")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andDo(print())
			.andExpect(status().isCreated());

		verify(signUpService).signup(any(SignupRequest.class));
	}

	@Test
	void 로그인성공() throws Exception {
		LoginRequest request = new LoginRequest("test@test.com", "!password");
		LoginResponse response = new LoginResponse("accessToken", 90000000L, false);
		when(loginService.login(any(LoginRequest.class), any(HttpServletResponse.class))).thenReturn(response);

		mockMvc.perform(post("/users/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andDo(print())
			.andExpect(status().isOk())
			.andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
			.andExpect(content().json(objectMapper.writeValueAsString(response)));

		verify(loginService).login(any(LoginRequest.class), any(HttpServletResponse.class));
	}

	@Test
	void 로그아웃성공() throws Exception {
		String refreshToken = "test리프레쉬토큰";
		doNothing().when(logoutService).logout(any(String.class), any(HttpServletResponse.class));

		mockMvc.perform(post("/users/logout")
				.cookie(new Cookie("refreshToken", refreshToken))
				.contentType(MediaType.APPLICATION_JSON))
			.andDo(print())
			.andExpect(status().isOk());

		verify(logoutService).logout(any(String.class), any(HttpServletResponse.class));
	}


	@Test
	void 리프레쉬토큰_액세스토큰_재발급성공() throws Exception {
		String refreshToken = "test리프레쉬토큰";
		RefreshResponse response = new RefreshResponse("newAccessToken", 90000000L);
		when(loginService.refreshToken(any(String.class), any(HttpServletResponse.class))).thenReturn(response);

		mockMvc.perform(post("/users/refresh")
				.cookie(new Cookie("refreshToken", refreshToken))
				.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andExpect(header().string(HttpHeaders.CACHE_CONTROL, "no-store"))
			.andExpect(content().json(objectMapper.writeValueAsString(response)));

		verify(loginService).refreshToken(any(String.class), any(HttpServletResponse.class));
	}

	@Test
	void 이메일중복검증성공() throws Exception {
		EmailDuplicationRequest request = new EmailDuplicationRequest("test@test.com");
		EmailDuplicationResponse response = new EmailDuplicationResponse(false);
		when(signUpService.checkDuplicationEmail(any(EmailDuplicationRequest.class))).thenReturn(response);

		mockMvc.perform(post("/users/email-validation")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
			.andExpect(status().isOk())
			.andExpect(content().json(objectMapper.writeValueAsString(response)));

		verify(signUpService).checkDuplicationEmail(any(EmailDuplicationRequest.class));
	}
}