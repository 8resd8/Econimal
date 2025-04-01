package com.ssafy.econimal.domain.product.service;

import static com.ssafy.econimal.domain.user.util.CoinUtil.*;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.ProductBackgroundDto;
import com.ssafy.econimal.domain.product.dto.ProductBackgroundResponse;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductBackgroundQueryRepository;
import com.ssafy.econimal.domain.product.util.ProductUtil;
import com.ssafy.econimal.domain.product.util.ProductValidator;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserBackground;
import com.ssafy.econimal.domain.user.repository.UserBackgroundRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductBackgroundService {

	private final ProductBackgroundQueryRepository backgroundRepository;
	private final UserBackgroundRepository userBackgroundRepository;
	private final ProductUtil productUtil;
	private final ProductValidator validator;

	public ProductBackgroundResponse getBackgroundProducts(User user) {
		List<ProductBackgroundDto> backgrounds = backgroundRepository.findAllBackground(user);
		return new ProductBackgroundResponse(backgrounds);
	}

	public void buyBackgroundProduct(User user, Long productId) {
		Product wantProductItem = productUtil.findProductById(productId);
		validator.buyUserCoin(user, wantProductItem.getPrice());
		validator.alreadyOwned(user, productId);

		UserBackground background = UserBackground.createUserBackground(user, wantProductItem, false,
			wantProductItem.getName());
		userBackgroundRepository.save(background);

		buyProductByCoin(user, wantProductItem.getPrice());
	}
}