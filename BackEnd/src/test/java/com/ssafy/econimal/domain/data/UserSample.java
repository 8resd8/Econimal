package com.ssafy.econimal.domain.data;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ssafy.econimal.domain.town.entity.Town;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.common.enums.UserType;

public class UserSample {


	public static User user(Town town) {
		return User.builder()
			.town(town)
			.email("test@naver.com")
			.name("테스트이름")
			.birth(LocalDate.from(LocalDateTime.now()))
			.password("!11112222")
			.nickname("테스트닉네임")
			.role(UserType.USER)
			.build();
	}

	public static User user(Town town, String email, String password) {
		return User.builder()
			.town(town)
			.email(email)
			.name("테스트이름")
			.birth(LocalDate.from(LocalDateTime.now()))
			.password(password)
			.nickname("테스트닉네임")
			.role(UserType.USER)
			.build();
	}
}
