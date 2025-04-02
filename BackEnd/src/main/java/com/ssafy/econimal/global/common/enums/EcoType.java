package com.ssafy.econimal.global.common.enums;

import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.Getter;

@Getter
public enum EcoType {
	ELECTRICITY("ELECTRICITY"),
	GAS("GAS"),
	WATER("WATER"),
	COURT("COURT"); // 지역난방

	private final String type;

	EcoType(String type) {
		this.type = type;
	}

	public static EcoType fromString(String input) {
		for (EcoType ecoType : EcoType.values()) {
			if (ecoType.type.equalsIgnoreCase(input)) {
				return ecoType;
			}
		}
		throw new InvalidArgumentException("Unknown EcoType: " + input);
	}
}
