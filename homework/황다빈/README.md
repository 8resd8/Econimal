# 1주차 평가
## 프로젝트 주제  
### [빅데이터 분산 기술 기반 참여형 환경 에듀테크 서비스, 에코니멀]

---

## 1. 프로젝트 개요

### 1-1. 기획 배경
환경 문제가 심각해지고 있는 현시점에서, 미래 세대에게 환경 보호의 중요성을 교육하는 것이 필수적이다. 특히, 유아 및 초등학생을 대상으로 한 교육은 직관적이고 재미있어야 한다. 이에 따라 빅데이터 기술을 활용하여 실시간 환경 데이터를 반영하고, 학습과 게임 요소를 결합한 **참여형 환경 에듀테크 서비스 "에코니멀"** 을 기획하였다.

### 1-2. 프로젝트 목표
- 환경 보호에 대한 경각심을 어린이들에게 자연스럽게 심어줌
- 교육적 요소를 결합한 게임형 웹앱 제공
- 빅데이터 분석 및 시각화를 통해 환경 변화를 직관적으로 전달

## 2. 주요 기능 및 유저 플로우

### 2-1. 캐릭터 시스템
- **초기 캐릭터 제공:** 3종 (예: 펭귄)
- **캐릭터 성장 방식:**
  - 단계별 진화 시스템 적용
  - 환경 보호 관련 체크리스트 수행 시 성장
  - 퀘스트 및 퀴즈 수행을 통한 발전
  - 캐릭터 강화 기능 추가
  - 특정 환경 보호 이벤트(예: "펭귄 살리기") 참여
- **음성 출력 기능:**
  - 어린이 연령층을 고려하여 **실제 음성 더빙 추가**
  - 보조 기능으로 텍스트 말풍선 유지

### 2-2. 상점 시스템
- 게임 내 재화를 활용한 **캐릭터 및 아이템 구매 기능** 제공

### 2-3. 보고서 시스템 (빅데이터 활용)
- **환경 데이터 분석 및 반영:**
  - NASA 데이터 및 크롤링한 기후 데이터를 기반으로 **회귀 분석 수행 후 MySQL에 저장**
  - 데이터 업데이트 주기:
    - 캐릭터 레벨업 시
    - 일일 단위 (기후 변화 반영)
- **환경 변화 시뮬레이션:**
  - 사용자의 환경 보호 활동이 실제 환경에 미치는 영향을 **시각적으로 제공**
  - 서식지 변화 요소 반영:
    - **빙하 감소:** 해수면 상승 시뮬레이션
    - **숲 변화:** 탄소 배출과 흡수량 변화 반영
    - **해양 생태계 영향:** 바다 환경 변화 시뮬레이션
- **세계 지도를 이용한 세계 환경정보 시각화**
    -  이산화탄소, 해수면, 온도 등의 정보를 각 색으로 표현하여, 각 정보 탭 선택시 지구본 변화

### 2-4. 시각화
- **목표:** 어린이 사용자가 환경 문제의 심각성을 직관적으로 이해하도록 함
- **주요 환경 데이터 시각화 항목:**
  - 온도 변화 추이
  - 탄소 배출량 변화
  - 빙하 면적 감소 → 해수면 상승
- **참고 자료:**
  - [Climatereanalyzer.org](https://climatereanalyzer.org/clim/seaice_daily/)
  - [빙하 데이터 분석 블로그](https://yobbicorgi.tistory.com/6)
  - [NASA 기후 데이터 API](https://science.nasa.gov/climate-change/)
  - [Open-Meteo Climate API](https://open-meteo.com/en/docs/climate-api)
  - [OpenWeather API](https://docs.openweather.co.uk/our-initiatives/student-initiative)
  - [Carbon Interface API](https://publicapis.dev/category/environment)
  - [Individual Carbon Footprint Calculation](https://www.kaggle.com/datasets/dumanmesut/individual-carbon-footprint-calculation/data)
  - [KIOS-Research Water-Usage-Dataset](https://github.com/KIOS-Research/Water-Usage-Dataset)
  - [지하수 데이터 분석시스템](https://www.gims.go.kr/bdp/portal/data-search.do?menuCode=2000&searchType=API&searchTab=API&orderParam=POST_SORT_REGIST_DE_DESC&category=&investigation=&pageNum=1&listNum=9&_csrf=aeeb1098-f617-483e-ac8d-5d2208ffe869&searchTerm=)
  - **nc 파일 분석 기법 적용:** 빙하 위치 데이터 활용 가능

### 2-5. 관리자용 화면
- 학생들의 학습 활동을 **실시간 모니터링 및 평가**

### 2-6. 마을 가꾸기 시스템
- 사용자의 환경 보호 활동에 따라 **가상의 마을 발전**
- 자신의 위치를 기반하여 환경 정보를 받아온 후, 이를 가상의 마을에 적용
- 환경 보호 활동이 반영되는 마을 내 변화 요소:
  - 공장의 매연
  - 하수처리장 및 마을의 수질
  - 집의 전력
  - 분리수거장의 폐기물 변화
  - 교통관련 차량수의 변화
  - 전체적인 환경 오염 감소 및 증가가

## 3. 기대 효과
- 어린이들에게 환경 보호의 중요성을 재미있게 학습할 수 있도록 제공
- 실시간 환경 데이터를 반영하여 **현실과 연계된 교육 효과 극대화**
- 게임 요소를 활용하여 **자발적 참여 유도**
- 시각화 및 시뮬레이션을 통해 **환경 문제의 심각성을 직관적으로 전달**