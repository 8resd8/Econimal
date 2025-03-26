package com.ssafy.econimal.global.common.enums;

import com.ssafy.econimal.global.exception.InvalidArgumentException;

public enum EcoType {
	ELECTRICITY("ELECTRICITY", 0.5),
	GAS("GAS", 1.2),
	WATER("WATER", 0.3),
	COURT("COURT", 1.5); // 지역난방

	private final String type;
	private final double weight;

	EcoType(String type, double weight) {
		this.type = type;
		this.weight = weight;
	}

	public String getType() {
		return type;
	}

	public double getWeight() {
		return weight;
	}

	// 문자열로부터 EcoType 찾기
	public static EcoType fromString(String input) {
		for (EcoType ecoType : EcoType.values()) {
			if (ecoType.type.equalsIgnoreCase(input)) {
				return ecoType;
			}
		}
		throw new InvalidArgumentException("Unknown EcoType: " + input);
	}
}
