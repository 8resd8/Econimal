package com.ssafy.econimal.domain.product.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.character.entity.Character;
import com.ssafy.econimal.domain.product.dto.ProductCharacterDto;
import com.ssafy.econimal.domain.product.dto.ProductCharacterResponse;
import com.ssafy.econimal.domain.product.entity.Product;
import com.ssafy.econimal.domain.product.repository.ProductCharacterQueryRepository;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.entity.UserCharacter;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;
import com.ssafy.econimal.global.common.enums.ExpressionType;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

	private final ProductCharacterQueryRepository productQueryRepository;
	private final ProductRepository productRepository;
	private final UserCharacterRepository userCharacterRepository;

	public ProductCharacterResponse getCharacterProducts(User user) {
		List<ProductCharacterDto> products = productQueryRepository.findAllCharactersStore(user);
		return new ProductCharacterResponse(products);
	}

	public void buyCharacterProduct(User user, Long productId) {
		Product wantProductItem = findProductById(productId);
		validateUserCoin(user, wantProductItem.getPrice());

		UserCharacter userCharacter = createUserCharacter(user, wantProductItem.getCharacter());
		userCharacterRepository.save(userCharacter);

		updateUserCoin(user, wantProductItem.getPrice());
	}

	private Product findProductById(Long productId) {
		return productRepository.findById(productId)
			.orElseThrow(() -> new IllegalArgumentException("해당 상품을 찾을 수 없습니다."));
	}

	private void validateUserCoin(User user, long productPrice) {
		if (user.getCoin() < productPrice) {
			throw new InvalidArgumentException("보유한 코인이 부족합니다.");
		}
	}

	private UserCharacter createUserCharacter(User user, Character character) {
		return UserCharacter.builder()
			.user(user)
			.character(character)
			.expression(ExpressionType.SADNESS)
			.isMain(false)
			.build();
	}

	private void updateUserCoin(User user, long productPrice) {
		user.updateCoin(user.getCoin() - productPrice);
	}
}