package com.ssafy.econimal.domain.product.util;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductValidator {

	private final UserBackgroundRepository userBackgroundRepository;

	public void buyUserCoin(User user, long productPrice) {
		if (user.getCoin() < productPrice) {
			throw new InvalidArgumentException("보유한 코인이 부족합니다.");
		}
	}

	public void alreadyOwned(User user, Long productId) {
		if (userBackgroundRepository.existsByUserAndProductId(user, productId)) {
			throw new InvalidArgumentException("이미 보유한 물건입니다.");
		}
	}
}
