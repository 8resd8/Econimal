package com.ssafy.econimal.domain.product.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.StoreDto;
import com.ssafy.econimal.domain.product.dto.StoreResponse;
import com.ssafy.econimal.domain.product.repository.ProductCharacterQueryRepository;
import com.ssafy.econimal.domain.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreService {

	private final ProductCharacterQueryRepository productQueryRepository;

	public StoreResponse getCharacterProducts(User user) {
		List<StoreDto> products = productQueryRepository.findAllCharactersStore(user);
		return new StoreResponse(products);
	}
}
