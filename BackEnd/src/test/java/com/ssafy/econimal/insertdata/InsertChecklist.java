package com.ssafy.econimal.insertdata;

import static com.ssafy.econimal.global.common.enums.EcoType.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ssafy.econimal.domain.checklist.entity.Checklist;
import com.ssafy.econimal.domain.checklist.repository.ChecklistRepository;
import com.ssafy.econimal.global.common.enums.DifficultyType;
import com.ssafy.econimal.global.common.enums.EcoType;

@SpringBootTest
public class InsertChecklist {

	@Autowired
	private ChecklistRepository checklistRepository;

	@Test
	@Disabled
	void 전기등록() {
		insertChecklistsForEcoType(ELECTRICITY);
	}

	@Test
	@Disabled
	void 물등록() {
		insertChecklistsForEcoType(WATER);
	}

	@Test
	@Disabled
	void 가스등록() {
		insertChecklistsForEcoType(GAS);
	}

	@Test
	@Disabled
	void 법원등록() {
		insertChecklistsForEcoType(COURT);
	}

	private void insertChecklistsForEcoType(EcoType ecoType) {
		List<ChecklistItem> checklistItems = switch (ecoType) {
			case ELECTRICITY -> getElectricityChecklist();
			case WATER -> getWaterChecklist();
			case GAS -> getGasChecklist();
			case COURT -> getCourtChecklist();
		};

		if (checklistItems != null) {
			for (ChecklistItem item : checklistItems) {
				Checklist checklist = Checklist.builder()
					.description(item.getText())
					.difficulty(item.getDifficultyType())
					.ecoType(ecoType)
					.build();

				checklistRepository.save(checklist);
			}
		}
	}

	public static class ChecklistItem {
		private final String text;
		private final DifficultyType difficultyType;

		public ChecklistItem(String text, DifficultyType difficultyType) {
			this.text = text;
			this.difficultyType = difficultyType;
		}

		public String getText() {
			return text;
		}

		public DifficultyType getDifficultyType() {
			return difficultyType;
		}
	}

	// EcoType별 체크리스트 아이템 메서드
	public static List<ChecklistItem> getElectricityChecklist() {
		return Arrays.asList(
			new ChecklistItem("사용하지 않는 방의 전등 끄기", DifficultyType.LOW),
			new ChecklistItem("에너지 소비 효율 1등급 가전제품 사용하기", DifficultyType.MEDIUM),
			new ChecklistItem("대기 전력 차단 멀티탭 사용 습관 들이기", DifficultyType.LOW),
			new ChecklistItem("냉장고 적정 온도 유지 및 문 여닫는 횟수 줄이기", DifficultyType.MEDIUM),
			new ChecklistItem("태양광 발전 시설 설치 고려하기 (주택, 건물)", DifficultyType.HIGH)
		);
	}

	public static List<ChecklistItem> getWaterChecklist() {
		return Arrays.asList(
			new ChecklistItem("양치컵 사용 및 물 받아쓰기", DifficultyType.LOW),
			new ChecklistItem("샤워 시간 5분 줄이기", DifficultyType.MEDIUM),
			new ChecklistItem("변기 수조에 벽돌이나 물병 넣어 물 절약하기", DifficultyType.LOW),
			new ChecklistItem("세탁 시 빨랫감 모아서 한번에 돌리기", DifficultyType.MEDIUM),
			new ChecklistItem("빗물 재활용 시설 설치 및 텃밭에 활용하기", DifficultyType.HIGH)
		);
	}

	public static List<ChecklistItem> getGasChecklist() {
		return Arrays.asList(
			new ChecklistItem("겨울철 내복 입고 실내 온도 20℃ 유지하기", DifficultyType.LOW),
			new ChecklistItem("단열 에어캡(뽁뽁이) 창문에 부착하기", DifficultyType.LOW),
			new ChecklistItem("고효율 보일러로 교체 고려하기", DifficultyType.MEDIUM),
			new ChecklistItem("가스레인지 대신 인덕션이나 하이라이트 사용하기", DifficultyType.MEDIUM),
			new ChecklistItem("친환경 콘덴싱 보일러 설치 지원 사업 활용하기", DifficultyType.HIGH)
		);
	}

	public static List<ChecklistItem> getCourtChecklist() {
		return Arrays.asList(
			new ChecklistItem("전자 소송 적극 활용 및 종이 사용 줄이기", DifficultyType.MEDIUM),
			new ChecklistItem("대중교통 이용 또는 카풀 생활화하기", DifficultyType.LOW),
			new ChecklistItem("에너지 절약 캠페인 및 교육 참여하기", DifficultyType.MEDIUM),
			new ChecklistItem("친환경 사무용품 사용하기 (재생 용지, 친환경 잉크)", DifficultyType.LOW),
			new ChecklistItem("법원 내 에너지 절약 및 친환경 활동 적극 홍보 및 참여 독려", DifficultyType.HIGH)
		);
	}
}