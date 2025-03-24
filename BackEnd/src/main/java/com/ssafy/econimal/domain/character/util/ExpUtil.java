package com.ssafy.econimal.domain.character.util;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.user.entity.UserCharacter;

public class ExpUtil {

	private ExpUtil() {
	}

	public static Integer getLevel(int totalExp, UserCharacter userCharacter) {
		return totalExp / userCharacter.getCharacter().getExpPerLevel() + 1;
	}

	public static Integer getExp(int totalExp, UserCharacter userCharacter) {
		return totalExp % userCharacter.getCharacter().getExpPerLevel();
	}

	public static Integer getLevel(int totalExp, Character character) {
		return totalExp / character.getExpPerLevel() + 1;
	}

	public static Integer getExp(int totalExp, Character character) {
		return totalExp % character.getExpPerLevel();
	}

	public static Integer getMaxExp(Character character) {
		return character.getExpPerLevel() * character.getMaxLevel();
	}

	public static void addExp(int exp, UserCharacter userCharacter) {
		int totalExp = userCharacter.getTotalExp();
		int maxExp = getMaxExp(userCharacter.getCharacter());
		if (maxExp <= totalExp + exp) {
			userCharacter.updateExp(totalExp + exp);
		}
	}
}
