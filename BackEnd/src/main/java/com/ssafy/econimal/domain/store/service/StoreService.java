package com.ssafy.econimal.domain.store.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.econimal.domain.store.dto.StoreDto;
import com.ssafy.econimal.domain.store.dto.StoreResponse;
import com.ssafy.econimal.domain.store.repository.ProductCharacterQueryRepository;
import com.ssafy.econimal.domain.store.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;

import jakarta.transaction.Transactional;
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
