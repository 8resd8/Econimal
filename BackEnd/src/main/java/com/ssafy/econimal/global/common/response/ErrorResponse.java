package com.ssafy.econimal.global.common.response;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {
	private LocalDateTime timestamp;
	private int status;
	private String error;
	private String message;
	private String path;

	public static ResponseEntity<ErrorResponse> toResponseEntity(HttpStatus httpStatus, String message, String path) {
		return ResponseEntity
			.status(httpStatus)
			.body(ErrorResponse.builder()
				.timestamp(LocalDateTime.now())
				.status(httpStatus.value())
				.error(httpStatus.name())
				.message(message)
				.path(path)
				.build());
	}
}
