package com.ssafy.econimal.domain.town.dto.response;

import static com.ssafy.econimal.domain.town.util.CarbonCalculator.*;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.util.ExpFeedback;

public record EcoAnswerResponse(
	double carbon,
	int exp,
	int coin,
	String expression,
	boolean isOptimal,
	String description
) {
	public static EcoAnswerResponse from(EcoAnswer answer, String description) {
		int rawExp = answer.getExp();

		double carbon = calculateCarbonPercent(rawExp);
		ExpFeedback feedback = evaluateExp(rawExp);

		return new EcoAnswerResponse(
			carbon,
			feedback.exp(),
			feedback.coin(),
			feedback.expression(),
			feedback.isOptimal(),
			description
		);
	}
}
