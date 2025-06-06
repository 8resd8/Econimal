package com.ssafy.econimal.domain.town.entity;

import com.ssafy.econimal.global.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "town")
public class Town extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "town_id")
	private Long id;

	@Column(name = "town_name", length = 30)
	private String name = "이름없는 마을";

	@Builder
	private Town(String name) {
		this.name = name;
	}

	public static Town createTown(String name) {
		if (name == null || name.isEmpty()) {
			name = "이름없는 마을";
		}
		return Town.builder()
			.name(name)
			.build();
	}

	public void updateTownName(String townName) {
		this.name = townName;
	}
}
