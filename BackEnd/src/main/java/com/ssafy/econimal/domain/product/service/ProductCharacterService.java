package com.ssafy.econimal.domain.product.service;

import static com.ssafy.econimal.domain.user.util.CoinUtil.*;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.product.dto.ProductCharacterDto;
import com.ssafy.econimal.domain.product.dto.ProductCharacterResponse;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductCharacterQueryRepository;
import com.ssafy.econimal.domain.product.util.ProductUtil;
import com.ssafy.econimal.domain.product.util.ProductValidator;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.global.common.enums.ExpressionType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductCharacterService {

	private final ProductCharacterQueryRepository productQueryRepository;
	private final UserCharacterRepository userCharacterRepository;
	private final ProductUtil productUtil;
	private final ProductValidator validator;

	public ProductCharacterResponse getCharacterProducts(User user) {
		List<ProductCharacterDto> products = productQueryRepository.findAllCharactersStore(user);
		return new ProductCharacterResponse(products);
	}

	public void buyCharacterProduct(User user, Long productId) {
		Product wantProduct = productUtil.findProductById(productId);
		validator.buyUserCoin(user, wantProduct.getPrice());
		validator.alreadyOwned(user, productId);

		UserCharacter userCharacter = UserCharacter.createUserCharacter(user, wantProduct.getCharacter());
		userCharacterRepository.save(userCharacter);

		buyProductByCoin(user, wantProduct.getPrice());
	}
}