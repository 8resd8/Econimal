package com.ssafy.econimal.domain.town.entity;

import com.ssafy.econimal.global.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "infrastructure_event")
public class InfrastructureEvent extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "infra_event_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "infra_id", nullable = false)
	private Infrastructure infrastructure;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eco_quiz_id", nullable = false)
	private EcoQuiz ecoQuiz;

	@Column(name = "is_active", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
	private boolean isActive;

	@Builder
	public InfrastructureEvent(Infrastructure infrastructure, EcoQuiz ecoQuiz, boolean isActive) {
		this.infrastructure = infrastructure;
		this.ecoQuiz = ecoQuiz;
		this.isActive = isActive;
	}

	public void setActive(boolean isClean, boolean isActive) {
		this.infrastructure.setClean(isClean);
		this.isActive = isActive;
	}

	public void deactivate() {
		this.isActive = false;
	}
}