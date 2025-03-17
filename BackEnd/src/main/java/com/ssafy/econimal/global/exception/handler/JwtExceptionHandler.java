package com.ssafy.econimal.global.exception.handler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.econimal.domain.auth.exception.JwtException;
import com.ssafy.econimal.global.common.response.ErrorResponse;

import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class JwtExceptionHandler {

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleJwtException(JwtException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleJwtException(SignatureException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.FORBIDDEN, ex.getMessage(), request.getRequestURI());
	}

}
