# 1주차 평가

## 학습 내용
1. Hadoop 에코시스템 구축

## Hadoop 에코시스템
### 사용 이유
- 빅데이터 플랫폼 구축 시 Hadoop을 비롯한 여러 SW를 통합 관리
- 에코시스템 SW 간 패키지 의존성 충돌 등 이슈를 방지할 수 있음
- 노드 간 리소스 모니터링을 통해 현황을 그래픽으로 알 수 있음

### 예제
1. Cloudera Manager
- [빅데이터 스터디](https://automatic-ulna-bcf.notion.site/SSAFY-1a7b7415febb806ba69bc83e4d93699f)에서 사용한 SW
- 오픈소스였으나 상용 SW(유료)으로 전환됨 
  * 스터디에서는 유료화 이전 버전의 CentOS 기반의 이미지 파일을 활용
- 개발 목적에 맞게 오픈소스를 사용하는 새로운 설치 방법을 찾기로 함

2. Apache Ambari
- Ubuntu를 지원하며, 무료 오픈소스 프로그램
- [설치 관련 매뉴얼/트러블 슈팅](https://automatic-ulna-bcf.notion.site/Apache-Ambari-1afb7415febb8092a284e4970f493446?pvs=73)
  - 소스파일을 통해 직접 설치를 시도했으나 JDK 버전 이슈 발생
  - Apache Bigtop을 통해 설치함으로써 문제를 해결
  - 멀티 노드 환경을 전제로 시도
