package com.ssafy.econimal.global.common.enums;

import com.ssafy.econimal.global.exception.InvalidArgumentException;

public enum ExpressionType {
	JOY("JOY"),
	SADNESS("SADNESS"),
	NEUTRAL("NEUTRAL");

	String type;

	ExpressionType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	// 문자열로부터 찾기
	public static ExpressionType fromString(String input) {
		for (ExpressionType expressionType : ExpressionType.values()) {
			if (expressionType.type.equalsIgnoreCase(input)) {
				return expressionType;
			}
		}
		throw new InvalidArgumentException("Unknown Type: " + input);
	}
}
