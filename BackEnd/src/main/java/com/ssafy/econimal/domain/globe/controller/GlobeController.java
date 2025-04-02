package com.ssafy.econimal.domain.globe.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeResponse;
import com.ssafy.econimal.domain.globe.service.GlobeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/globe")
@RequiredArgsConstructor
public class GlobeController {

	private final GlobeService globeService;

	@PostMapping
	public GlobeResponse getGlobeInfo(@RequestBody GlobeInfoRequest globeInfoRequest) {
		return globeService.getGlobeInfoByRDB(globeInfoRequest);
	}
}
