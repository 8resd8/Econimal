package com.ssafy.econimal.domain.town.entity;

import com.ssafy.econimal.global.common.entity.BaseTimeEntity;
import com.ssafy.econimal.global.common.enums.EcoType;

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
@Table(name = "facility")
public class Facility extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "facility_id")
	private Long id;

	@Column(name = "facility_name")
	private String facilityName;

	@Column(name = "eco_type")
	@Enumerated(EnumType.STRING)
	private EcoType ecoType;

	@Builder
	private Facility(String facilityName, EcoType ecoType) {
		this.facilityName = facilityName;
		this.ecoType = ecoType;
	}
}
