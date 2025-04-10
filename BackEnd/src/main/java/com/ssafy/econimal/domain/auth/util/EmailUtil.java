package com.ssafy.econimal.domain.auth.util;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.ssafy.econimal.domain.auth.exception.SendEmailFailException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailUtil {

	private final JavaMailSender javaMailSender;

	public void sendAdminEmail(String email) {
		MimeMessage mimeMessage = javaMailSender.createMimeMessage();

		try {
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
			helper.setTo(email); // 이메일 받을 사람
			helper.setSubject("[긴급] 기후조회 데이터 오류 확인 필수");
			helper.setText("/api/globe, getClimateInfoAll() 메서드 확인 바람", true);

			javaMailSender.send(mimeMessage);

		} catch (MessagingException e) {
			throw new SendEmailFailException("알 수 없는 이유로 이메일 전송 실패", e);
		}
	}
}
