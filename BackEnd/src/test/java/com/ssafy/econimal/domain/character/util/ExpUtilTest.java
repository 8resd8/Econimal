package com.ssafy.econimal.domain.character.util;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpUtilTest {

	@Mock
	private UserCharacter userCharacter;

	@Mock
	private Character character;

	@BeforeEach
	void setUp() {
		when(userCharacter.getCharacter()).thenReturn(character);
	}

	@Test
	void 현재레벨계산() {
		when(character.getMaxLevel()).thenReturn(3);
		when(character.getExpPerLevel()).thenReturn(100);

		assertEquals(1, ExpUtil.getLevel(0, userCharacter));
		assertEquals(2, ExpUtil.getLevel(100, userCharacter));
		assertEquals(3, ExpUtil.getLevel(250, userCharacter));
		assertEquals(3, ExpUtil.getLevel(1000, userCharacter)); // 최대 레벨 초과 시 최대 레벨 반환
	}

	@Test
	void 현재경험치계산() {
		when(character.getMaxLevel()).thenReturn(3);
		when(character.getExpPerLevel()).thenReturn(100);


		assertEquals(0, ExpUtil.getExp(0, userCharacter));
		assertEquals(0, ExpUtil.getExp(100, userCharacter));
		assertEquals(0, ExpUtil.getExp(200, userCharacter));
		assertEquals(0, ExpUtil.getExp(300, userCharacter));
		assertEquals(50, ExpUtil.getExp(250, userCharacter));
		assertEquals(10, ExpUtil.getExp(310, userCharacter));

		// 초과하면 꽉채움
		when(userCharacter.getLevel()).thenReturn(3);
		assertEquals(100, ExpUtil.getExp(333, userCharacter));
	}

	@Test
	void 최대경험치계산() {
		when(character.getMaxLevel()).thenReturn(3);
		when(character.getExpPerLevel()).thenReturn(100);

		assertEquals(300, ExpUtil.getMaxExp(userCharacter.getCharacter()));

		when(character.getExpPerLevel()).thenReturn(1000);
		assertEquals(3000, ExpUtil.getMaxExp(userCharacter.getCharacter()));
	}
	@Test
	void 경험치추가() {
		when(userCharacter.getTotalExp()).thenReturn(200); // 현재 경험치 200
		when(character.getMaxLevel()).thenReturn(5); // 최대 레벨 5
		when(character.getExpPerLevel()).thenReturn(100); // 레벨업당 경험치 100

		ExpUtil.addExp(50, userCharacter);
		verify(userCharacter).updateExp(250);

		ExpUtil.addExp(300, userCharacter);
		verify(userCharacter).updateExp(500);
	}
}