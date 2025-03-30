package com.ssafy.econimal.domain.globe.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.globe.dto.GlobeDataDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeResponse;
import com.ssafy.econimal.domain.globe.dto.GroupByCountryDto;
import com.ssafy.econimal.domain.globe.dto.GroupByDateTimeDto;
import com.ssafy.econimal.domain.globe.repository.ClimateQueryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class GlobeService {

	private final ClimateQueryRepository climateQueryRepository;

	// key : 낧짜, value : 해당 날짜의 국가별 기후 데이터
	private Map<String, Map<String, GlobeDataDto>> groupByDateTime(List<GlobeInfoDto> infoList) {
		return infoList.stream()
			.collect(Collectors.groupingBy(
				GlobeInfoDto::dateTime,
				Collectors.toMap(
					GlobeInfoDto::country,
					info -> new GlobeDataDto(
						String.valueOf(info.temperature()),
						String.valueOf(info.humidity())
					),
					(existing, replacement) -> replacement
				)
			));
	}

	// key : 국가, value : 해당 국가의 시간별 기후 데이터
	private Map<String, Map<String, GlobeDataDto>> groupByCountry(List<GlobeInfoDto> infoList) {
		return infoList.stream()
			.collect(Collectors.groupingBy(
				GlobeInfoDto::country,
				Collectors.toMap(
					GlobeInfoDto::dateTime,
					info -> new GlobeDataDto(
						String.valueOf(info.temperature()),
						String.valueOf(info.humidity())
					),
					(existing, replacement) -> replacement
				)
			));
	}

	@Transactional(readOnly = true)
	public GlobeResponse getGlobeInfoByRDB(GlobeInfoRequest globeInfoRequest) {

		List<GlobeInfoDto> infoList = climateQueryRepository.findClimateAverageByTime(globeInfoRequest);

		// 날짜별 그룹핑 처리
		Map<String, Map<String, GlobeDataDto>> groupedByDateTime = groupByDateTime(infoList);

		// 국가별 그룹핑 처리
		Map<String, Map<String, GlobeDataDto>> groupedByCountry = groupByCountry(infoList);

		return new GlobeResponse(
			new GroupByDateTimeDto(groupedByDateTime),
			new GroupByCountryDto(groupedByCountry)
		);
	}
}
