package com.ssafy.econimal.domain.user.entity;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.ExpressionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "user_character")
public class UserCharacter extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_character_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "character_id", nullable = false)
	private Character character;

	@Column(name = "level", nullable = false, columnDefinition = "INT DEFAULT 1")
	private int level = 1;

	@Column(name = "total_exp", nullable = false)
	private int totalExp;

	@Column(name = "expression")
	@Enumerated(EnumType.STRING)
	private ExpressionType expression;

	@Column(name = "is_main", nullable = false)
	private boolean isMain;

	@Builder
	private UserCharacter(User user, Character character, int level, int totalExp, ExpressionType expression,
		boolean isMain) {
		this.user = user;
		this.character = character;
		this.level = level;
		this.totalExp = totalExp;
		this.expression = expression;
		this.isMain = isMain;
	}


	/**
	 * 기본적으로 레벨을 1,
	 * 총 경험치를 0으로 설정
	 * 캐릭터의 감정 상태를 {@code ExpressionType.SADNESS}로 고정
	 * 메인 캐릭터가 아님({@code isMain=false})을 명시
	 *
	 * @param user      해당 캐릭터를 소유한 User 객체
	 * @param character 초기화할 Character 객체
	 * @return 기본값이 적용된 UserCharacter 객체
	 */
	public static UserCharacter createUserCharacter(User user, Character character) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.level(1)
			.totalExp(0)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	public void updateIsMain(boolean isMain) {
		this.isMain = isMain;
	}

	public void updateExpression(ExpressionType expression) {
		this.expression = expression;
	}

	public void updateExp(int exp) {
		this.totalExp = exp;
	}

	public void updateLevel(int level) {
		this.level = level;
	}

}