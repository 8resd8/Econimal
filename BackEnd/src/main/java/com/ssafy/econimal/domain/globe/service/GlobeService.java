package com.ssafy.econimal.domain.globe.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeResponse;
import com.ssafy.econimal.domain.globe.repository.ClimateQueryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class GlobeService {

	private final ClimateQueryRepository climateQueryRepository;

	@Transactional(readOnly = true)
	public GlobeResponse getGlobeInfo(GlobeInfoRequest globeInfoRequest) {
		List<GlobeInfoDto> response = climateQueryRepository.findClimateAverageByTime(globeInfoRequest);
		return new GlobeResponse(response);
	}
}
