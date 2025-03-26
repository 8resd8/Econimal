package com.ssafy.econimal.global.util;

public class Prompt {

	public static String environmentPrompt(String content) {
		return """
			다음은 초등학교 저학년 및 유치원생이 작성한 환경 관련 체크리스트 내용입니다.
			# 내용
			[%s]
			
			# 평가 기준:
			- 항목이 환경 보호 및 환경과의 관련성이 높은 실천인지 0점(전혀 관련없음)부터 10점(매우 관련있음)까지 점수로 평가합니다.
			- 반드시 어린이의 수준에서 작성된 내용임을 감안하여 평가합니다.
			- 간단한 이유도 함께 설명해주고 ~요체 사용.
			
			# 평가 결과:
			- point: (0점~10점 숫자만, 6점이상: 환경내용, 6점미만: 환경관련과 거리가 멂)
			- reason: (짧고 간단한 이유 설명)
			# 응답 형식:
			앞 뒤 불필요 내용 제거 후 JSON으로만 구성
			{
			    "point": 5,
			    "reason": "간단한 이유 2줄 설명"
			}
			""".formatted(content);
	}
}
