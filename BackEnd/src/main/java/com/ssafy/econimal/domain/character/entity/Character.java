package com.ssafy.econimal.domain.character.entity;

import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.CharacterType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "characters")
public class Character extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "character_id")
	private Long id;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(name = "character_name", nullable = false)
	private String name;

	@Column(name = "character_type", columnDefinition = "ENUM('POLAR', 'FOREST', 'OCEAN')")
	@Enumerated(EnumType.STRING)
	private CharacterType type;

	@Column(name = "summary", nullable = false, columnDefinition = "TEXT")
	private String summary;

	@Column(name = "description", nullable = false, columnDefinition = "TEXT")
	private String description;

	@Column(name = "exp_per_level", nullable = false, columnDefinition = "INT DEFAULT 1000")
	private int expPerLevel = 100;

	@Column(name = "max_level", nullable = false, columnDefinition = "INT DEFAULT 3")
	private int maxLevel = 3;

	@Column(name = "is_original", columnDefinition = "TINYINT DEFAULT 0")
	private boolean isOriginal;

	@Builder
	private Character(Product product, String name, CharacterType type, String summary, String description,
		boolean isOriginal) {
		this.product = product;
		this.name = name;
		this.type = type;
		this.summary = summary;
		this.description = description;
		this.isOriginal = isOriginal;
	}

	public static Character createCharacter(Product product, String name, CharacterType type, String summary,
		String description) {
		return Character.builder()
			.product(product)
			.name(name)
			.type(type)
			.summary(summary)
			.description(description)
			.build();
	}
}
