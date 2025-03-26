package com.ssafy.econimal.domain.user.util;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

public class CoinUtil {

	private CoinUtil() {
	}

	public static void addCoin(long coin, User user) {
		user.updateCoin(user.getCoin() + coin);
	}

	// 상점에서 품목 구매
	public static void buyProductByCoin(User user, long productPrice) {
		if (user.getCoin() < productPrice) {
			throw new InvalidArgumentException("보유한 코인이 부족합니다.");
		}

		user.updateCoin(user.getCoin() - productPrice);
	}
}
