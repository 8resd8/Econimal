package com.ssafy.econimal.domain.globe.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeResponse;
import com.ssafy.econimal.domain.globe.dto.GlobeV2Response;
import com.ssafy.econimal.domain.globe.service.GlobeService;
import com.ssafy.econimal.global.common.enums.TimeType;

import jakarta.validation.Valid;
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

	/**
	 * 72시간 3일
	 * 3달
	 * 1년
	 * @param type 원하는 통계 시간
	 */
	@GetMapping("/v2")
	public GlobeV2Response getGlobeInfos(@Valid @RequestParam(name = "timeType") TimeType type) {
		return globeService.getGlobeInfoByRDBV2(type);
	}
}
