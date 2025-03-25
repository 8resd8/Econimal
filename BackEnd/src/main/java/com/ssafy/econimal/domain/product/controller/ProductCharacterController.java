package com.ssafy.econimal.domain.product.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.product.dto.ProductResponse;
import com.ssafy.econimal.domain.product.service.ProductService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductCharacterController {

	private final ProductService productService;

	@GetMapping("/characters")
	public ProductResponse getCharacterProducts(@Login User user) {
		return productService.getCharacterProducts(user);
	}

	@PostMapping("/characters/{productId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void buyCharacterProducts(@Login User user, @PathVariable("productId") Long productId) {
		productService.buyCharacterProduct(user, productId);
	}

}
