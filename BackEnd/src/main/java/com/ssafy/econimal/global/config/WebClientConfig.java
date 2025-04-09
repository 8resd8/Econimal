package com.ssafy.econimal.global.config;

import org.springframework.core.codec.DecodingException;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

public class WebClientConfig {
	private static final int DEFAULT_MAX_MEMORY_SIZE = 10 * 1024 * 1024; // 10MB

	private static final ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
		.codecs(configurer -> configurer
			.defaultCodecs()
			.maxInMemorySize(DEFAULT_MAX_MEMORY_SIZE)
		).build();

	public static WebClient createWebClient(String baseUrl) {
		return WebClient.builder()
			.baseUrl(baseUrl)
			.exchangeStrategies(exchangeStrategies)
			.build();
	}

	public static <T> Mono<T> get(WebClient webClient, String uri, Class<T> responseType) {
		return webClient.get()
			.uri(uri)
			.retrieve()
			.onStatus(HttpStatusCode::isError, clientResponse ->
				clientResponse.bodyToMono(String.class)
					.map(body -> new RuntimeException("API 호출 오류: " + clientResponse.statusCode() + " - " + body))
			)
			.bodyToMono(responseType)
			.onErrorMap(e -> {
					if (e instanceof DecodingException) {
						return new RuntimeException("API 결과 파싱 실패: " + e.getMessage(), e);
					}
					return new RuntimeException("알 수 없는 오류: " + e.getMessage(), e);
				}
			);
	}
}
