package com.ssafy.econimal.domain.data.sample;

import java.time.LocalDateTime;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;

public class UserChecklistSample {

	public static UserChecklist userChecklist(User user, Checklist checklist) {
		return UserChecklist.builder()
			.user(user)
			.checklist(checklist)
			.isComplete(false)
			.completionDate(LocalDateTime.now())
			.build();
	}

}
