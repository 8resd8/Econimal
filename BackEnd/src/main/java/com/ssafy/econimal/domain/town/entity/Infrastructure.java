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
@Table(name = "infrastructure")
public class Infrastructure extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "infra_id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "town_id", nullable = false)
	private Town town;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "facility_id", nullable = false)
	private Facility facility;

	@Column(name = "is_clean", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
	private boolean isClean = false;

	@Builder
	public Infrastructure(Town town, Facility facility, boolean isClean) {
		this.town = town;
		this.facility = facility;
		this.isClean = isClean;
	}
}
