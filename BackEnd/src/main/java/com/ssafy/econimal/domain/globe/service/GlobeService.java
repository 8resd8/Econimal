package com.ssafy.econimal.domain.globe.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.globe.dto.GlobeDataDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoDto;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.GlobeInfoV2Dto;
import com.ssafy.econimal.domain.globe.dto.GlobeResponse;
import com.ssafy.econimal.domain.globe.dto.GlobeV2Response;
import com.ssafy.econimal.domain.globe.dto.GroupByCountryDto;
import com.ssafy.econimal.domain.globe.dto.GroupByDateTimeDto;
import com.ssafy.econimal.domain.globe.repository.ClimateQueryRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
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

	// 1년 단위
	@Transactional(readOnly = true)
	public GlobeV2Response getGlobeInfoYear() {
		List<GlobeInfoV2Dto> climates = climateQueryRepository.findClimateAverageByYearV2();

		return getGlobeV2Response(climates);
	}

	// 3달단위
	@Transactional(readOnly = true)
	public GlobeV2Response getGlobeInfoMonth() {
		List<GlobeInfoV2Dto> climates = climateQueryRepository.findClimateAverageByMonthV2();

		return getGlobeV2Response(climates);
	}

	// 3일단위
	@Transactional(readOnly = true)
	public GlobeV2Response getGlobeInfoDay() {
		List<GlobeInfoV2Dto> climates = climateQueryRepository.findClimateAverageByDayV2();

		return getGlobeV2Response(climates);
	}

	// 동일한 출력결과 사용
	private GlobeV2Response getGlobeV2Response(List<GlobeInfoV2Dto> climates) {
		Map<String, Map<String, Map<String, Double>>> groupedData = climates.stream()
			.collect(Collectors.groupingBy(
				GlobeInfoV2Dto::formattedDateHour, // 최상위 키: 날짜
				Collectors.toMap(
					GlobeInfoV2Dto::country,       // 내부 키: 국가 코드
					dto -> Map.of(                 // 내부 값: 온도와 습도 정보를 담은 Map
						"temperature", dto.temperature(),
						"humidity", dto.humidity()
					)
				)
			));

		return new GlobeV2Response(groupedData);
	}
}
