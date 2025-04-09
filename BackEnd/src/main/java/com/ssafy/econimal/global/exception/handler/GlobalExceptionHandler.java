package com.ssafy.econimal.global.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.ssafy.econimal.domain.auth.exception.AuthenticationException;
import com.ssafy.econimal.global.common.response.ErrorResponse;
import com.ssafy.econimal.global.exception.InvalidArgumentException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다. 계속해서 문제가 발생하면 관리자에게 문의해주세요.",
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
	public ResponseEntity<ErrorResponse> handleMethodArgumentException(MethodArgumentNotValidException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.BAD_REQUEST, "요청 데이터가 올바르지 않습니다.", request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleNoResourceException(NoResourceFoundException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.NOT_FOUND, "요청하신 리소스를 찾을 수 없습니다.", request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.METHOD_NOT_ALLOWED, "해당 요청 방식은 지원하지 않습니다.", request.getRequestURI());
	}

	@ExceptionHandler
	public ResponseEntity<ErrorResponse> handleMessageNotReadableException(HttpMessageNotReadableException ex,
		HttpServletRequest request) {
		return ErrorResponse.toResponseEntity(HttpStatus.BAD_REQUEST, "정확한 타입으로 보내야 합니다.", request.getRequestURI());
	}

}
