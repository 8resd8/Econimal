package com.ssafy.econimal.global.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.econimal.domain.auth.exception.JwtException;
import com.ssafy.econimal.global.common.response.ErrorResponse;
import com.ssafy.econimal.domain.auth.exception.AuthenticationException;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
			request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(InvalidArgumentException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleAuthException(AuthenticationException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleJwtException(JwtException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI());
	}

}
