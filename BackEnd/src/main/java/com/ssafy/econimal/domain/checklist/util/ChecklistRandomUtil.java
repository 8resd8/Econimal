package com.ssafy.econimal.domain.checklist.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.repository.ChecklistRepository;
import com.ssafy.econimal.global.common.enums.DifficultyType;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ChecklistRandomUtil {

	private final ChecklistRepository checklistRepository;
	/**
	 * 주어진 Checklist 리스트에서 랜덤하게 3개의 Checklist를 반환하는 메서드
	 * 리스트의 크기가 3보다 작거나 같으면 전체 리스트를 반환.
	 */
	public List<Checklist> getRandomChecklistPerDifficulty() {
		List<Checklist> result = new ArrayList<>();

		for (DifficultyType difficulty : DifficultyType.values()) {
			List<Checklist> listByDifficulty = checklistRepository.findByDifficulty(difficulty);

			if (listByDifficulty != null && !listByDifficulty.isEmpty()) {
				Collections.shuffle(listByDifficulty);
				result.add(listByDifficulty.get(0));
			}
		}
		return result;
	}
}