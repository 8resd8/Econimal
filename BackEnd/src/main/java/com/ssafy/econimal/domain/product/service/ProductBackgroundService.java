package com.ssafy.econimal.domain.product.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.product.dto.ProductBackgroundDto;
import com.ssafy.econimal.domain.product.dto.ProductBackgroundResponse;
import com.ssafy.econimal.domain.product.repository.ProductBackgroundQueryRepository;
import com.ssafy.econimal.domain.product.repository.ProductRepository;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserCharacterRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductBackgroundService {

	private final ProductBackgroundQueryRepository backgroundRepository;
	private final ProductRepository productRepository;
	private final UserCharacterRepository userCharacterRepository;

	public ProductBackgroundResponse getBackgroundProducts(User user) {
		List<ProductBackgroundDto> backgrounds = backgroundRepository.findAllBackground(user);
		return new ProductBackgroundResponse(backgrounds);
	}
}