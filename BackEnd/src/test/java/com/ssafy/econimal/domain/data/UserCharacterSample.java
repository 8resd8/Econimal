package com.ssafy.econimal.domain.data;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.global.common.enums.ExpressionType;

public class UserCharacterSample {
	public static UserCharacter character(User user, com.ssafy.econimal.domain.character.entity.Character character) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(1)
			.totalExp(0)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	public static UserCharacter userCharacter(User user, com.ssafy.econimal.domain.character.entity.Character character, int level) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(level)
			.totalExp(0)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	public static UserCharacter userCharacter(User user, com.ssafy.econimal.domain.character.entity.Character character) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(1)
			.totalExp(0)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	public static UserCharacter userCharacter(User user, com.ssafy.econimal.domain.character.entity.Character character, int level, int totalExp) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(level)
			.totalExp(totalExp)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	public static UserCharacter userCharacter(User user, com.ssafy.econimal.domain.character.entity.Character character, int level, int totalExp, ExpressionType expression) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(level)
			.totalExp(totalExp)
			.expression(expression)
			.isMain(false)
			.build();
	}

	public static UserCharacter userCharacter(User user, com.ssafy.econimal.domain.character.entity.Character character, int level, int totalExp, ExpressionType expression, boolean isMain) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(level)
			.totalExp(totalExp)
			.expression(expression)
			.isMain(isMain)
			.build();
	}
}