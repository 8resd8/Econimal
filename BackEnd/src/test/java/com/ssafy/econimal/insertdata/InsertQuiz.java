package com.ssafy.econimal.insertdata;

import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.town.entity.EcoAnswer;
import com.ssafy.econimal.domain.town.entity.EcoQuiz;
import com.ssafy.econimal.domain.town.repository.EcoAnswerRepository;
import com.ssafy.econimal.domain.town.repository.EcoQuizRepository;
import com.ssafy.econimal.domain.town.repository.FacilityRepository;

@SpringBootTest
public class InsertQuiz {

	@Autowired
	private EcoQuizRepository quizRepository;
	@Autowired
	private EcoAnswerRepository answerRepository;
	@Autowired
	private FacilityRepository facilityRepository;

	@Test
	@Disabled
	void 퀴즈질문등록() {
		String[] questions = {
			"다음 중 수질 오염을 줄이는 좋은 생활 습관은 무엇인가요?",
			"전기 절약에 가장 효과적인 방법은 무엇인가요?",
			"가스를 절약하기 위한 올바른 방법은 무엇인가요?",            // 3
			"다음 중 물을 절약하는 습관으로 알맞은 것은 무엇인가요?",
			"겨울철 난방 에너지를 절약하는 방법은 무엇인가요?",        // 5
			"플라스틱 사용을 줄이는 가장 좋은 방법은 무엇인가요?",
			"음식물 쓰레기를 줄이기 위한 가장 좋은 방법은 무엇인가요?", // 7
			"탄소 배출을 줄이는 가장 효과적인 방법은 무엇인가요?",
			"종이를 절약하는 습관으로 적절한 것은 무엇인가요?",       // 9
			"대중교통을 이용하면 얻을 수 있는 환경적 효과는 무엇인가요?"
		};

		long[] facilityIds = {2L, 3L, 1L, 2L, 3L, 3L, 3L, 1L, 3L, 1L};

		for (int i = 0; i < questions.length; i++) {
			EcoQuiz quiz = EcoQuiz.builder()
				.facility(facilityRepository.findById(facilityIds[i]).get())
				.description(questions[i])
				.build();
			quizRepository.save(quiz);
		}
	}

	@Test
	@Disabled
	void 퀴즈대답등록() {
		List<EcoQuiz> quizzes = quizRepository.findAllByIdSize(412L, 421L);

		String[][] answers = {
			{"여름에 에어컨을 26도로 설정하고 필요한 시간에만 켠다.",
				"집 안의 모든 조명을 형광등으로 유지한다.",
				"세탁물을 모아서 세탁기를 주 2~3회만 돌린다.",
				"전기밥솥 보온 기능을 하루 종일 켜둔다."},

			{"불필요한 조명을 꺼둔다.",
				"냉장고 문을 자주 연다.",
				"에어컨 온도를 항상 낮게 유지한다.",
				"컴퓨터를 항상 켜둔다."},

			{"요리 시 냄비 뚜껑을 덮는다.",
				"물을 끓일 때 항상 최대 불로 끓인다.",
				"가스를 켜둔 채 다른 일을 한다.",
				"매일 오랜 시간 난방을 한다."},

			{"양치질 시 물을 잠근다.",
				"목욕탕을 매일 채운다.",
				"물을 많이 사용한다.",
				"세차할 때 항상 물을 계속 틀어둔다."},

			{"난방을 적절히 낮추고 옷을 따뜻하게 입는다.",
				"창문을 항상 열어 둔다.",
				"집 전체를 하루 종일 난방한다.",
				"난방기를 항상 최고 온도로 설정한다."},

			{"다회용 물병을 사용한다.",
				"일회용 컵을 자주 사용한다.",
				"플라스틱 포장된 제품을 자주 구매한다.",
				"비닐봉지를 자주 사용한다."},

			{"필요한 양만 조리한다.",
				"항상 음식을 넉넉히 만든다.",
				"음식을 자주 버린다.",
				"남은 음식 보관을 하지 않는다."},

			{"자전거 또는 걷기를 이용한다.",
				"차를 자주 이용한다.",
				"가까운 거리도 자동차로 다닌다.",
				"대중교통 이용을 하지 않는다."},

			{"양면 인쇄를 한다.",
				"종이를 일회용으로만 사용한다.",
				"종이를 많이 사용한다.",
				"한쪽 면만 인쇄한다."},

			{"대기오염 감소와 에너지를 줄이는 효과가 있다.",
				"주차 공간 부족 문제를 심화시킨다.",
				"도로 확장을 유발하여 환경 파괴 원인이 될 수 있다.",
				"화석 연료 사용을 강제해 지구 온난화를 가속화한다."}
		};

		for (int i = 0; i < answers.length; i++) {
			for (int j = 0; j < answers[i].length; j++) {
				Random random = new Random();
				int plusExp = random.nextInt(81) + 20; // 20 ~ 100
				int minusExp = random.nextInt(31) - 30; // 0 ~ -30
				EcoAnswer answer = EcoAnswer.builder()
					.ecoQuiz(quizzes.get(i))
					.description(answers[i][j])
					.exp(j == 0 ? plusExp : minusExp)
					.build();
				answerRepository.save(answer);
			}
		}
	}

	@Test
	@Disabled
	void 법관련퀴즈등록() {
		String[] questions = {
			"온실가스 감축을 위해 배출량을 거래하는 제도는?",
			"건물이나 자동차 등 에너지 소비 효율 등급을 표시하는 제도는?",
			"지구 온난화의 주범으로 꼽히는 온실가스 종류가 아닌 것은?",
			"개인이나 기업이 탄소 배출량을 줄이기 위해 참여하는 자발적인 활동은?",
			"다음 중 탄소 배출량 감축을 위한 국제 협약이 아닌 것은?"
		};

		Long[] facilityIds = {4L, 4L, 4L, 4L, 4L};
		for (int i = 0; i < questions.length; i++) {
			EcoQuiz quiz = EcoQuiz.builder()
				.facility(facilityRepository.findById(facilityIds[i]).get())
				.description(questions[i])
				.build();
			quizRepository.save(quiz);
		}
	}

	@Test
	@Disabled
	void 법관련퀴즈대답등록() {
		String[][] answers = {
			{"탄소배출권 거래제", "에너지표시제", "대기환경법", "탄소생활 캠페인"},
			{"에너지표시제", "탄소배출권 거래제", "녹색건축인증제", "환경영향평가"},
			{"산소", "이산화탄소", "메탄", "아산화질소"},
			{"탄소생활 캠페인", "탄소배출권 거래제", "에너지 효율 관리 제도", "환경 규제"},
			{"람사르 협약", "파리 협정", "교토 의정서", "UN 기후변화협약"}
		};

		List<EcoQuiz> quizzes = quizRepository.findAllByIdSize(422L, 426L);

		for (int i = 0; i < quizzes.size(); i++) {
			for (int j = 0; j < answers[i].length; j++) {
				Random random = new Random();
				int plusExp = random.nextInt(81) + 20; // 20 ~ 100
				int minusExp = random.nextInt(31) - 30; // 0 ~ -30
				EcoAnswer answer = EcoAnswer.builder()
					.ecoQuiz(quizzes.get(i))
					.description(answers[i][j])
					.exp(j == 0 ? plusExp : minusExp)
					.build();
				answerRepository.save(answer);
			}
		}
	}
}
