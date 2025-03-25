package com.ssafy.econimal.domain.product.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.ProductDto;
import com.ssafy.econimal.domain.product.dto.ProductResponse;
import com.ssafy.econimal.domain.product.repository.ProductCharacterQueryRepository;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

	private final ProductCharacterQueryRepository productQueryRepository;

	public ProductResponse getCharacterProducts(User user) {
		List<ProductDto> products = productQueryRepository.findAllCharactersStore(user);
		return new ProductResponse(products);
	}
}
