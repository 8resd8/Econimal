package com.ssafy.econimal.domain.globe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.globe.dto.request.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.response.ClimateResponse;
import com.ssafy.econimal.domain.globe.dto.response.GlobeV2Response;
import com.ssafy.econimal.domain.globe.service.GlobeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/globe")
@RequiredArgsConstructor
public class GlobeController {

	private final GlobeService globeService;

	@PostMapping
	public ClimateResponse getGlobeInfo(@RequestBody GlobeInfoRequest globeInfoRequest) {
		return globeService.getGlobeInfoByRDB(globeInfoRequest);
	}

	// 1년
	@GetMapping("/v2/year")
	public GlobeV2Response getGlobeInfoYear() {
		return globeService.getGlobeInfoYear();
	}

	// 3달
	@GetMapping("/v2/three-month")
	public GlobeV2Response getGlobeInfoMonth() {
		return globeService.getGlobeInfoMonth();
	}

	// 72시간
	@GetMapping("/v2/three-day")
	public GlobeV2Response getGlobeInfoDay() {
		return globeService.getGlobeInfoDay();
	}
}
