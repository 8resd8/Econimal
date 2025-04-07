package com.ssafy.econimal.domain.globe.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.ssafy.econimal.domain.globe.dto.GlobeData;
import com.ssafy.econimal.domain.globe.dto.climate.v1.ClimateDataDto;
import com.ssafy.econimal.domain.globe.dto.climate.v1.ClimateInfoDto;
import com.ssafy.econimal.domain.globe.dto.climate.v1.GroupByCountryDto;
import com.ssafy.econimal.domain.globe.dto.climate.v1.GroupByDateTimeDto;
import com.ssafy.econimal.domain.globe.dto.climate.v2.ClimateInfoV2Dto;
import com.ssafy.econimal.domain.globe.dto.co2.CarbonCO2Dto;
import com.ssafy.econimal.domain.globe.dto.request.GlobeInfoRequest;
import com.ssafy.econimal.domain.globe.dto.response.ClimateResponse;
import com.ssafy.econimal.domain.globe.dto.response.GlobeV2Response;
import com.ssafy.econimal.domain.globe.repository.CarbonCO2QueryRepository;
import com.ssafy.econimal.domain.globe.repository.ClimateQueryRepository;
import com.ssafy.econimal.global.config.WebClientConfig;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class GlobeService {

	@Value("${climate.api-url}")
	private String climateApiUrl;

	private final ClimateQueryRepository climateQueryRepository;
	private final CarbonCO2QueryRepository carbonCO2QueryRepository;

	// key : 낧짜, value : 해당 날짜의 국가별 기후 데이터
	private Map<String, Map<String, ClimateDataDto>> groupByDateTime(List<ClimateInfoDto> infoList) {
		return infoList.stream()
			.collect(Collectors.groupingBy(
				ClimateInfoDto::dateTime,
				Collectors.toMap(
					ClimateInfoDto::country,
					info -> new ClimateDataDto(
						String.valueOf(info.temperature()),
						String.valueOf(info.humidity())
					),
					(existing, replacement) -> replacement
				)
			));
	}

	// key : 국가, value : 해당 국가의 시간별 기후 데이터
	private Map<String, Map<String, ClimateDataDto>> groupByCountry(List<ClimateInfoDto> infoList) {
		return infoList.stream()
			.collect(Collectors.groupingBy(
				ClimateInfoDto::country,
				Collectors.toMap(
					ClimateInfoDto::dateTime,
					info -> new ClimateDataDto(
						String.valueOf(info.temperature()),
						String.valueOf(info.humidity())
					),
					(existing, replacement) -> replacement
				)
			));
	}

	@Transactional(readOnly = true)
	public ClimateResponse getGlobeInfoByRDB(GlobeInfoRequest globeInfoRequest) {

		List<ClimateInfoDto> infoList = climateQueryRepository.findClimateAverageByTime(globeInfoRequest);

		// 날짜별 그룹핑 처리
		Map<String, Map<String, ClimateDataDto>> groupedByDateTime = groupByDateTime(infoList);

		// 국가별 그룹핑 처리
		Map<String, Map<String, ClimateDataDto>> groupedByCountry = groupByCountry(infoList);

		return new ClimateResponse(
			new GroupByDateTimeDto(groupedByDateTime),
			new GroupByCountryDto(groupedByCountry)
		);
	}

	// 1년 단위: 1시간 갱신
	@Cacheable(value = "climateYearCache", key = "'climate:year'")
	@Scheduled(cron = "0 0 * * * *")
	public GlobeV2Response getClimateInfoYear() {
		List<ClimateInfoV2Dto> climates = climateQueryRepository.findClimateAverageByYearV2();

		return getGlobeV2Response(climates);
	}

	// 3달단위: 1시간 갱신
	@Cacheable(value = "climateThreeMonthCache", key = "'climate:three-month'")
	@Scheduled(cron = "0 0 * * * *")
	public GlobeV2Response getClimateInfoMonth() {
		List<ClimateInfoV2Dto> climates = climateQueryRepository.findClimateAverageByMonthV2();

		return getGlobeV2Response(climates);
	}

	// 3일단위: 1시간 갱신
	@Cacheable(value = "climateThreeDayCache", key = "'climate:three-day'")
	@Scheduled(cron = "0 0 * * * *")
	public GlobeV2Response getClimateInfoDay() {
		List<ClimateInfoV2Dto> climates = climateQueryRepository.findClimateAverageByDayV2();

		return getGlobeV2Response(climates);
	}

	// 전체 기간 이산화탄소 연도별 평균
	@Cacheable(value = "carbonAllYearCache", key = "'carbon:all-year'")
	public GlobeV2Response getCarbonCO2InfoAll() {
		List<CarbonCO2Dto> carbonCo2s = carbonCO2QueryRepository.findCO2AverageAll();

		return getGlobeV2Response(carbonCo2s);
	}

	// 외부 서버로부터 전체 기간 온습도 연도별 평균 가져오기
	public GlobeV2Response getClimateInfoAll() {
		// Response Type 동일하므로 변환하여 사용
		WebClient webClient = WebClientConfig.createWebClient(climateApiUrl);
		return WebClientConfig.get(webClient, "/globe/all/climate", GlobeV2Response.class)
			.block();
	}

	// 동일한 출력결과 사용
	private <T extends GlobeData> GlobeV2Response getGlobeV2Response(List<T> dataList) {
		Map<String, Map<String, Map<String, String>>> groupedByCountry = dataList.stream()
			.collect(Collectors.groupingBy(
				GlobeData::country,
				Collectors.toMap(
					GlobeData::formattedDateHour,
					GlobeData::toValueMap,
					(existing, replacement) -> replacement // key 중복 방지
				)
			));

		Map<String, Map<String, Map<String, String>>> groupedByDateTime = dataList.stream()
			.collect(Collectors.groupingBy(
				GlobeData::formattedDateHour,
				Collectors.toMap(
					GlobeData::country,
					GlobeData::toValueMap,
					(existing, replacement) -> replacement // key 중복 방지
				)
			));

		return new GlobeV2Response(groupedByCountry, groupedByDateTime);
	}
}
