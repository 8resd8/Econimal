package com.ssafy.econimal.domain.product.util;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

@Component
public class ProductValidator {

	public void buyUserCoin(User user, long productPrice) {
		if (user.getCoin() < productPrice) {
			throw new InvalidArgumentException("보유한 코인이 부족합니다.");
		}
	}
}
