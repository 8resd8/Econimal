package com.ssafy.econimal.global.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.ssafy.econimal.global.resolver.LoginArgumentResolver;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final LoginArgumentResolver loginArgumentResolver;
	private final CorsProperties corsProperties;

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(loginArgumentResolver);
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins(corsProperties.allowedOrigins().toArray(new String[0]))
			.allowedMethods(corsProperties.allowedMethods().toArray(new String[0]))
			.allowedHeaders(corsProperties.allowedHeaders().toArray(new String[0]))
			.exposedHeaders(corsProperties.exposedHeaders().toArray(new String[0]))
			.allowCredentials(corsProperties.allowCredentials())
			.maxAge(corsProperties.maxAge());
	}
}
