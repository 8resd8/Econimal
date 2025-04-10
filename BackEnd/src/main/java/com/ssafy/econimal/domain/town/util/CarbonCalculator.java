package com.ssafy.econimal.domain.town.util;

import com.ssafy.econimal.global.common.enums.ExpressionType;

public class CarbonCalculator {

	public static final double EXP_TO_CARBON_PERCENT_RATIO = -1.0 / 25;

	public static final double EXP_TO_REAL_CARBON_RATIO = -1312.9846 / 25;

	private static final int ROUNDING_SCALE = 1000;

	private CarbonCalculator() {
	}

	public static double calculateCarbonPercent(int exp) {
		return Math.round(convertExpToPercent(exp) * ROUNDING_SCALE) / (double)ROUNDING_SCALE;
	}

	public static double calculateRealCarbon(int exp) {
		return Math.round(convertExpToRealCarbon(exp) * ROUNDING_SCALE) / (double)ROUNDING_SCALE;
	}

	public static double convertExpToPercent(int exp) {
		return exp * EXP_TO_CARBON_PERCENT_RATIO;
	}

	public static double convertExpToRealCarbon(int exp) {
		return exp * EXP_TO_REAL_CARBON_RATIO;
	}

	public static ExpFeedback evaluateExp(int rawExp) {
		if (rawExp > 0) {
			return new ExpFeedback(rawExp, rawExp, true, ExpressionType.JOY.name());
		} else if (rawExp < 0) {
			return new ExpFeedback(0, 0, false, ExpressionType.SADNESS.name());
		} else {
			return new ExpFeedback(0, 0, false, ExpressionType.NEUTRAL.name());
		}
	}
}
