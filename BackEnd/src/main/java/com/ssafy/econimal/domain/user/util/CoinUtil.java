package com.ssafy.econimal.domain.user.util;

import com.ssafy.econimal.domain.user.entity.User;

public class CoinUtil {

	private CoinUtil() {
	}

	public static void addCoin(long coin, User user) {
		user.updateCoin(user.getCoin() + coin);
	}
}
