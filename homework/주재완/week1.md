# 1주차 회고

## 1주차 계획

[x] SSAFY Hadoop 학습
[x] Hadoop 세팅 - with 윤윤호
[x] Web Scraping / Crawling
[ ] 데이터 시각화 / Pandas - In Progress
[x] 기능명세서
[x] 플로우차트
[ ] API 명세서 - In Progress
[ ] ERD - In Progress

## 주말 / 2주차 계획

- 데이터 시각화 / Pandas
- API 명세서
- ERD

## 개인적으로 학습해야 될 내용

- Hadoop 서적 학습
- Kafka, Spark - 블로그 정리
- Docker, 인프라 구축 관련
- CI/CD
- 환경 관련 데이터 연관관계 분석 필요

## Hadoop

```jsx
sudo apt install maven python2-dev
sudo apt-get install build-essential openjdk-8-jdk

wget https://bootstrap.pypa.io/pip/2.7/get-pip.py
sudo python2.7 get-pip.py
pip2 install psutil

wget https://archive.apache.org/dist/bigtop/bigtop-3.2.1/bigtop-3.2.1-project.tar.gz
tar -zxvf bigtop-3.2.1-project.tar.gz

cd bigtop-3.2.1

./gradlew task --all
./gradlew task ambari-pkg
./gradlew task bigtop-ambari-mpack-pkg
./gradlew task bigtop-utils-pkg
```

# Apache Ambari 설치

https://cwiki.apache.org/confluence/display/AMBARI/Installation+Guide+for+Ambari+2.7.9

https://junhyunny.github.io/information/hadoop/hadoop-ambari/

https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable

```jsx
sudo apt install maven

sudo apt-get install build-essential openjdk-8-jdk

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn

sudo apt install python2-dev python3-pip
pip install psutil

wget https://www-eu.apache.org/dist/ambari/ambari-2.7.9/apache-ambari-2.7.9-src.tar.gz
tar xfvz apache-ambari-2.7.9-src.tar.gz
cd apache-ambari-2.7.9-src
mvn versions:set -DnewVersion=2.7.9.0.0
 
pushd ambari-metrics
mvn versions:set -DnewVersion=2.7.9.0.0
popd

mvn -B clean install jdeb:jdeb -DnewVersion=2.7.9.0.0 -DbuildNumber=da8f1b9b5a799bfa8e2d8aa9ab31d6d5a1cc31a0 -DskipTests -Dpython.ver="python >= 2.6" -Drat.skip=true
```

`Too many files with unapproved license`

- 오픈 소스를 사용할 때 라이센스가 붙어 있지 않은 파일들이 있는 경우 에러가 발생
- `-Drat.skip=true` 옵션을 통해 해결 가능