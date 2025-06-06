# 1주차 평가

## 주제 선정: 빅데이터 분산 기반 에듀테크 환경 서비스

## 학습 내용
1. 1학기 때 아쉬웠던 내용인 로그를 보는 문제를 해결하기 위해 로그 모니터링 공부
2. 부족했던 토큰 인증관리에 대해 공부

### 로깅 방법

1. 프로메테우스
    - 아키텍처가 유연하고 확장 가능하다.
    - 강력한 쿼리 언어를 사용한다.
    - 다양한 모니터링 시나리오에 적합하다.
    - 오픈소스 소프트웨어로 제공된다.
    - 다양한 플러그인과 통합을 지원한다.
    - 높은 신뢰성을 보장한다.

2. 데이터톡
    - 모니터링 데이터를 업체에서 관리하는 경우를 서비스형이라고 하고, 데이터를 사용자가 직접 관리하는 경우를 설치형이라고 하는데, 데이터독은 서비스형 소프트웨어(SaaS) 형태로 제공
      웹사이트에서 모니터링 대상을 관리할 수 있고 쿠버네티스를 비롯해 여러 클라우드 서비스나 애플리케이션과 연결이 쉬우므로 관리 부담이 적음
    - 모니터링 대상마다 요금을 부과하기 때문에 모니터링 대상이 늘면 비용이 커지는 단점이 존재

3. 뉴 렐릭
    - 데이터독과 같은 Saas, 다만 데이터독과 비교했을 때 애플리케이션 성능 모니터링(APM, Application Performance Monitoring) 더 특화
    - 데이터독과 마찬가지로 모니터링 대상이 많을수록 비용 증가

### 정리

가격, 형태, 참고자료, 확장성에 따라 프로메테우스를 선택

### 시각화 방법

1. 그라파나(Grafana)

- 그라파나 랩스(Grafana Labs)에서 개발했으며, 특정 소프트웨어에 종속되지 않은 독립적인 시각화 도구
- 30가지 이상의 다양한 수집 도구 및 DB들과 연계를 지원
- 주로 시계열 데이터 시각화에 많이 쓰임, 관계형 데이터베이스 데이터를 표 형태로 시각화해 사용할 수도 있음
- 기능을 확장하는 플러그인과 개별 사용자들이 만들어 둔 대시보드의 공유가 매우 활발
- 오픈 소스라서 사용자의 요구 사항에 맞게 수정 가능, 필요에 따라 설치형과 서비스형 모두 선택 가능

2. 키바나(Kibana)

- 엘라스틱서치(ElasticSearch)를 개발한 엘라스틱에서 만든 시각화 도구
- 엘리스틱서치에 적재된 데이터를 시각화하거나 검색하는 데 사용, 이러한 데이터를 분석할 때도 사용
- 엘라스틱서치의 데이터만을 시각화할 수 있기 때문에 프로메테우스의 시계열 데이터를 메트릭비트(Metricbeat)라는 도구로 엘라스틱서치에 전달해야 하는 불편함 존재

### 정리
기능이 부족하지 않고 확장성이 높은 프로메테우스 + 그라파나 조합으로 모니터링을 구성하는 조합을 많이 선호

### 아쉬운 점
- 공통프로젝트 때 받은 EC2에 적용했으면 좋았으나 회수기간이 3.6이라 짧아 실제 적용을 해보지 못한 것에 대한 아쉬움
- 프로메테우스 설정에 시간이 많이 걸렸고 그라파나 연결은 시도하지 못함.

### 이후
이번 프로젝트인 특화땐 적용해 쉽게 로그모니터링 목표


## JWT
### 액세스 토큰 저장
액세스 토큰은 stateless(서버에 저장하지 않음)이므로 클라이언트가 직접 관리

### 액세스 토큰 갱신
액세스 토큰은 짧은 유효기간을 가지며, 만료 시 클라이언트는 리프레쉬 토큰을 사용하여 새 액세스 토큰을 요청

### 액세스 토큰 삭제
로그아웃 시 클라이언트에서 쿠키 또는 메모리에 저장된 액세스 토큰 삭제


### 리프레쉬 토큰 관리
- 역할: 리프레쉬 토큰은 액세스 토큰이 만료되었을 때 새로운 액세스 토큰을 발급받기 위해 사용
- 긴 유효기간을 가진다

### 리프레쉬 토큰 생성
- 서버에서 사용자 인증이 성공하면 리프레쉬 토큰을 발급

## 응답
로그인 시 바디에 토큰정보, 시간, 리프레쉬토큰을 담아 응답하는 것이 표준
### 참조: 
- [스택오버플로우](https://stackoverflow.com/questions/15159004/oauth-is-it-ok-to-return-access-token-as-json)
- [카카오 개발자 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token)
```json
{
   "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
   "expiresIn": 3600,
   "refreshToken": "d1f2v3b4n..."
}
```
로그인 시 토큰정보, 이후 유저정보를 담는 API 따로 호출하여 클라이언트에서 관리하는 방식을 많이 사용

JWT: Json Web Token 이므로 쉽게 추출이 가능하다.
하지만 구글검색으로는 여전히 토큰은 Header에 담아야한다 vs Body에 담는게 맞다 논쟁이 많다.
