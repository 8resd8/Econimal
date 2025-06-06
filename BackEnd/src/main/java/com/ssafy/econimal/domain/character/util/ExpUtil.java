package com.ssafy.econimal.domain.character.util;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.user.entity.UserCharacter;

public class ExpUtil {

	private ExpUtil() {
	}

	public static Integer getLevel(int totalExp, UserCharacter userCharacter) {
		int maxLevel = userCharacter.getCharacter().getMaxLevel(); // 최대 레벨
		int level = totalExp / userCharacter.getCharacter().getExpPerLevel() + 1; // 현재 레벨 계산
		return Math.min(level, maxLevel);
	}

	public static Integer getExp(int totalExp, UserCharacter userCharacter) {
		Character character = userCharacter.getCharacter();

		int maxLevel = character.getMaxLevel();
		int expPerLevel = character.getExpPerLevel();

		int maxExp = maxLevel * expPerLevel; // 경험치를 가질 수 있는 최대치
		int exp = totalExp % expPerLevel; // 현재 경험치
		// 최대레벨이면 경험치바 꽉채워서 보여줌
		return maxLevel == userCharacter.getLevel() ? expPerLevel : Math.min(exp, maxExp);
	}

	public static Integer getMaxExp(Character character) {
		return character.getExpPerLevel() * character.getMaxLevel();
	}

	public static void addExp(int exp, UserCharacter userCharacter) {
		int totalExp = userCharacter.getTotalExp();
		int maxExp = getMaxExp(userCharacter.getCharacter());
		if (totalExp + exp <= maxExp) {
			userCharacter.updateExp(totalExp + exp);
			userCharacter.updateLevel(getLevel(totalExp, userCharacter));
		}
	}
}
