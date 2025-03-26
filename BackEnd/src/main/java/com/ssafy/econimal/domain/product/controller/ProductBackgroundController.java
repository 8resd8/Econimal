package com.ssafy.econimal.domain.product.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.product.dto.ProductBackgroundResponse;
import com.ssafy.econimal.domain.product.service.ProductBackgroundService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/product/backgrounds")
@RequiredArgsConstructor
public class ProductBackgroundController {

	private final ProductBackgroundService backgroundService;

	@GetMapping
	public ProductBackgroundResponse getCharacterProducts(@Login User user) {
		return backgroundService.getBackgroundProducts(user);
	}

}
