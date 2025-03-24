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
	public UserCharacter(User user, Character character, int level, int totalExp, ExpressionType expression, boolean isMain) {
		this.user = user;
		this.character = character;
		this.level = level;
		this.totalExp = totalExp;
		this.expression = expression;
		this.isMain = isMain;
	}

	public void updateIsMain(boolean isMain) {
		this.isMain = isMain;
	}
}