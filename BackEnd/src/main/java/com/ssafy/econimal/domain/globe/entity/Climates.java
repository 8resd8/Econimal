package com.ssafy.econimal.domain.globe.entity;

import java.time.LocalDateTime;

import com.ssafy.econimal.global.common.entity.BaseTimeEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "climates")
public class Climates extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "climate_id")
	private Long id;

	@Column(name = "country_code", nullable = false)
	private String countryCode;

	@Column(name = "latitude", nullable = false)
	private float latitude;

	@Column(name = "longitude", nullable = false)
	private float longitude;

	@Column(name = "temperature")
	private Float temperature;

	@Column(name = "humidity")
	private Float humidity;

	@Column(name = "reference_date", nullable = false)
	private LocalDateTime referenceDate;

	@Column(name = "year", nullable = false)
	private int year;

	@Column(name = "month", nullable = false)
	private int month;

	@Column(name = "day", nullable = false)
	private int day;

	@Column(name = "hour", nullable = false)
	private int hour;
}