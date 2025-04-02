package com.ssafy.econimal.domain.town.util;

public record ExpFeedback(
	int exp,
	int coin,
	boolean isOptimal,
	String expression
) {
}
