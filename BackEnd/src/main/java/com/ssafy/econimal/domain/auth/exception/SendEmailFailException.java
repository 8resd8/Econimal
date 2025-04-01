package com.ssafy.econimal.domain.auth.exception;

public class SendEmailFailException extends RuntimeException {
	public SendEmailFailException(String message) {
		super(message);
	}
	public SendEmailFailException(String message, Throwable cause) {
		super(message, cause);
	}
}
