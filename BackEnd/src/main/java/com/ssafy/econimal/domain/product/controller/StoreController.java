package com.ssafy.econimal.domain.product.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.product.dto.StoreResponse;
import com.ssafy.econimal.domain.product.service.StoreService;
import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.global.annotation.Login;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/store")
@RequiredArgsConstructor
public class StoreController {

	private final StoreService storeService;

	@GetMapping("/characters")
	public StoreResponse getCharacterProducts(@Login User user) {
		return storeService.getCharacterProducts(user);
	}

}
