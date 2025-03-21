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
	 * Checklist 랜덤 3개의 선택하는 메서드
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