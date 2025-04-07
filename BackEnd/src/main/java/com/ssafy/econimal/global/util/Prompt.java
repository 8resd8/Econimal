package com.ssafy.econimal.global.util;

import java.util.Map;

import com.ssafy.econimal.domain.globe.dto.LogInfoDto;
import com.ssafy.econimal.domain.globe.dto.UserLogDto;
import com.ssafy.econimal.global.common.enums.EcoType;

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

	public static String globeFeedbackPrompt(UserLogDto userLogDto, Double totalCarbon) {
		Map<EcoType, LogInfoDto> logs = userLogDto.logs();
		LogInfoDto electricityLogs = logs.get(EcoType.ELECTRICITY);
		LogInfoDto waterLogs = logs.get(EcoType.WATER);
		LogInfoDto gasLogs = logs.get(EcoType.GAS);
		LogInfoDto courtLogs = logs.get(EcoType.COURT);
		return """
			다음은 사용자가 환경 관련 퀴즈에 응답한 정답률 데이터입니다.
			
			- 전기: %d / %d
			- 수도: %d / %d
			- 가스: %d / %d
			- 법원: %d / %d
			- 탄소변화량 : %f
			
			# 평가 기준:
			- 각 영역(전기, 수도, 가스, 법원)의 정답률을 바탕으로 사용자의 이해 수준을 분석해 주세요.
			- 특히 정답률이 낮거나 높은 항목이 있다면 강조해서 설명해주세요.
			- 탄소 배출량과 온도 상승량 데이터를 종합하여 환경 인식 및 행동 변화 필요성에 대해 간단히 언급해주세요.
			- 탄소 배출량의 단위은 톤(ton)이에요.
			- 피드백은 약 500자 분량으로 간결하고 아이도 이해하기 쉽게 구어체로 작성해주세요.
			
			# 평가 결과:
			- feedback: (약 500자 내외의 피드백)
			- carbon: (숫자로만, 예상되는 내가 100만명 있을 때 평균에 비해 변화한 탄소량, 음수의 경우 탄소의 감소를 의미, 사용자 입력으로 적은 탄소변화량과 동일)
			- temperature: (숫자로만, 사용자 입력 탄소변화량 바탕으로 예상되는 변화하는 지구 평균 온도량, 음수의 경우 평균 온도의 감소를 의미)
			
			# 응답 형식:
			앞 뒤 불필요 내용 제거 후 JSON으로만 구성
			{
				"feedback": "500자 내외의 종합 평가 피드백",
				"carbon": "%f",
				"temperature": "-0.2"
			}
			""".formatted(
			electricityLogs.correct(),
			electricityLogs.total(),
			waterLogs.correct(),
			waterLogs.total(),
			gasLogs.correct(),
			gasLogs.total(),
			courtLogs.correct(),
			courtLogs.total(),
			totalCarbon,
			totalCarbon
		);
		/*
			또한, 다음은 사용자의 실시간 환경 데이터입니다:
			- 탄소 배출량: %d
			- 온도 상승량: %d
		 */
	}
}
