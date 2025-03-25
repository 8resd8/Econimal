package com.ssafy.econimal.domain.auth.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.econimal.domain.auth.dto.request.EmailRequest;
import com.ssafy.econimal.domain.auth.util.HtmlContent;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthEmailSendService {

	private final JavaMailSender javaMailSender;
	private final AuthEmailService authEmailService;
	private final static String EMAIL_SUBJECT = "Econimal Team: 인증코드";

	public void handleSendEmail(EmailRequest request) {
		// 인증코드 생성
		String authCode = authEmailService.generateVerificationCode();

		// 인증코드 저장
		authEmailService.saveVerificationCode(request.email(), authCode);

		// 이메일 전송
		sendEmail(request.email(), authCode);
	}

	// 이메일 보내기
	private void sendEmail(String email, String authCode) {
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
			helper.setTo(email); // 이메일 받을 사람
			helper.setSubject(EMAIL_SUBJECT);
			helper.setText(HtmlContent.emailAuthContent(authCode), true);

			javaMailSender.send(mimeMessage);
			log.debug("이메일 전송 성공: email: {}, code: {}", email, authCode);
		} catch (MessagingException e) {
			throw new RuntimeException("알 수 없는 이유로 이메일 전송 실패");
		}
	}
}
