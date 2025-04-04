package com.ssafy.econimal.domain.town.util;

import com.ssafy.econimal.global.common.enums.ExpressionType;

public class CarbonCalculator {

	public static final double CARBON_PERCENT_TO_EXP_RATIO = 1;

	private static final int ROUNDING_SCALE = 10;

	private CarbonCalculator() {
	}

	public static double calculateCarbon(int exp) {
		return -Math.round(convertExpToPercent(exp) * ROUNDING_SCALE) / (double)ROUNDING_SCALE;
	}

	public static double convertExpToPercent(int exp) {
		return exp / CARBON_PERCENT_TO_EXP_RATIO;
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
