package com.ssafy.econimal.domain.auth.util;

public class HtmlContent {

	public static String emailAuthContent(String authCode) {
		return """
			<!DOCTYPE html>
			<html lang="ko">
			<head>
			    <meta charset="UTF-8">
			    <meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">
			    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px;">
			        <h2 style="color: #2c3e50;">Econimal Team</h2>
			        <p style="font-size: 24px color: #34495e; line-height: 1.6;">인증 코드</p>
			        <p style="font-size: 24px; font-weight: bold; color: #013ADF;"><strong>%s</strong></p>
			        <br>
			        <p style="color: #34495e; line-height: 1.6;"><strong>5분</strong> 이내에 입력해주세요.</p>
			        <p style="color: #34495e; line-height: 1.6;">만약 본인이 요청하지 않은 이메일이라면, 이 이메일을 무시하셔도 됩니다.</p>
			        <br>
			        <p style="color: #34495e; line-height: 1.6;">문의사항이 있으면 아래로 연락주세요:</p>
			        <p style="color: #34495e; line-height: 1.6;">SSAFY 12기 김현우</p>
			        <p style="color: #34495e; line-height: 1.6;">위치: SSAFY 서울캠퍼스</p>
			        <p style="color: #34495e; line-height: 1.6;">주소: 서울특별시 강남구 테헤란로 212 멀티캠퍼스</p>
			        <br><br>
			        <p style="font-size: 12px; color: #7f8c8d;">이 이메일은 자동으로 발송된 이메일입니다.</p>
			    </div>
			</body>
			</html>
			""".formatted(authCode);

	}
}
