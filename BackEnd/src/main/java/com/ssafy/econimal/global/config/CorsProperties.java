package com.ssafy.econimal.global.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@ConfigurationProperties(prefix = "cors")
@Validated
public record CorsProperties(

	@NotEmpty
	List<String> allowedOrigins,

	@NotEmpty
	List<String> allowedMethods,

	@NotEmpty
	List<String> allowedHeaders,

	@NotEmpty
	List<String> exposedHeaders,

	@NotNull
	Boolean allowCredentials,

	@NotNull
	Long maxAge
) {
}
