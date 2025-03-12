package com.ssafy.econimal.global.exception.handler;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.econimal.global.common.response.ErrorResponse;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import jakarta.servlet.http.HttpServletRequest;

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
	public ResponseEntity<ErrorResponse> handleNoSuchElementException(NoSuchElementException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
	}
}
