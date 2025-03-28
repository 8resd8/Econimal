package com.ssafy.econimal.domain.town.dto.response;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.global.common.enums.EcoType;
import com.ssafy.econimal.global.common.enums.ExpressionType;

public record EcoAnswerResponse(
	double carbon,
	int exp,
	int coin,
	String expression,
	boolean isOptimal,
	String description
) {
	public static EcoAnswerResponse from(EcoAnswer answer, String description) {
		EcoType type = answer.getEcoQuiz().getFacility().getEcoType();

		// 해당 유형의 가중치로 carbon 계산
		double carbon = 0;
		if(!type.toString().equals(EcoType.COURT.toString())) {
			carbon = type.getWeight() * (-answer.getExp());
		}

		int exp = answer.getExp();
		int coin = exp;

		String expression = ExpressionType.NEUTRAL.name();
		boolean isOptimal = false;
		if(exp > 0) {
			expression = ExpressionType.JOY.name();
			isOptimal = true;
		} else if(exp < 0) {
			exp = 0;
			coin = 0;
			expression = ExpressionType.SADNESS.name();
		}

		return new EcoAnswerResponse(
			carbon,
			exp,
			coin,
			expression,
			isOptimal,
			description
		);
	}
}
