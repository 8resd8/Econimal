package com.ssafy.econimal.global.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ssafy.econimal.domain.auth.exception.SendEmailFailException;
import com.ssafy.econimal.global.common.response.ErrorResponse;
import com.ssafy.econimal.global.exception.InitialSettingException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class AuthExceptionHandler {

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleInitialSettingException(InitialSettingException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
			request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleMissingCookieException(MissingRequestCookieException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage(),
			request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleSendEmailFailException(SendEmailFailException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
			request.getRequestURI());
	}
}
