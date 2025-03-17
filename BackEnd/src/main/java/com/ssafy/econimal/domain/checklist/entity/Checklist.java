package com.ssafy.econimal.domain.checklist.entity;

import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.DifficultyType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "checklist")
public class Checklist extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "checklist_id")
	private Long id;

	@Column(name = "difficulty", columnDefinition = "ENUM('HIGH', 'MEDIUM', 'LOW')")
	@Enumerated(EnumType.STRING)
	private DifficultyType difficulty;

	@Column(name = "eco_type")
	private String ecoType;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "exp")
	private int exp = 30;

	@Builder
	public Checklist(DifficultyType difficulty, String ecoType, String description) {
		this.difficulty = difficulty;
		this.ecoType = ecoType;
		this.description = description;
	}
}