package com.ssafy.econimal.domain.checklist.util;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserChecklist;
import com.ssafy.econimal.domain.user.repository.UserChecklistRepository;
import com.ssafy.econimal.domain.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DailyChecklistRefresher {

	private final ChecklistRandomUtil randomUtil;
	private final UserChecklistRepository userChecklistRepository;
	private final UserRepository userRepository;

	/**
	 * 매일 자정 00:00 실행
	 * 1. 모든 유저의 체크리스트를 삭제
	 * 2. 새로운 체크리스트 항목을 생성하고 저장
	 */
	@Scheduled(cron = "0 0 0 * * ?")
	@Transactional
	public void refreshDailyChecklist() {
		userChecklistRepository.deleteAll();

		List<User> users = userRepository.findAll();
		for (User user : users) {
			List<Checklist> newChecklists = randomUtil.getRandomChecklistPerDifficulty();
			for (Checklist checklist : newChecklists) {
				UserChecklist userChecklist = UserChecklist.builder()
					.checklist(checklist)
					.isComplete(false)
					.user(user)
					.build();
				userChecklistRepository.save(userChecklist);
			}
		}
	}

}
