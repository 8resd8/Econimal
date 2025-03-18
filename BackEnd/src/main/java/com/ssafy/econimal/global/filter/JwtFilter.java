package com.ssafy.econimal.global.filter;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.ssafy.econimal.global.config.JwtProperties;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter implements Filter {

	private final JwtUtil jwtUtil;
	private final JwtProperties jwtProperties;

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws
		IOException,
		ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest)request;
		HttpServletResponse httpResponse = (HttpServletResponse)response;

		String token = jwtUtil.getResolveAccessToken(httpRequest);

		String requestURI = httpRequest.getRequestURI();

		if (passUrl(requestURI)) {
			filterChain.doFilter(request, response);
			return;
		}

		if (token == null || !jwtUtil.isTokenValid(token)) {
			log.debug("요청경로: {}, 유효하지 않은 토큰: {}, 시간: {}", requestURI , token, LocalDateTime.now());
			httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰이 없거나 유효하지 않은 토큰");
			return;
		}

		Long userId = jwtUtil.getUserIdFromToken(token);
		String role = jwtUtil.getUserRoleFromToken(token);

		httpRequest.setAttribute("userId", userId);
		httpRequest.setAttribute("role", role);

		filterChain.doFilter(request, response);
	}

	private boolean passUrl(String requestURI) {
		return jwtProperties.getPassURL().stream()
			.anyMatch(requestURI::startsWith);
	}
}
