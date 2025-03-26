package com.ssafy.econimal.domain.product.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.product.dto.ProductCharacterResponse;
import com.ssafy.econimal.domain.product.service.ProductCharacterService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product/characters")
@RequiredArgsConstructor
public class ProductCharacterController {

	private final ProductCharacterService productCharacterService;

	@GetMapping
	public ProductCharacterResponse getCharacterProducts(@Login User user) {
		return productCharacterService.getCharacterProducts(user);
	}

	@PostMapping("/{productId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void buyCharacterProducts(@Login User user, @PathVariable("productId") Long productId) {
		productCharacterService.buyCharacterProduct(user, productId);
	}

}
