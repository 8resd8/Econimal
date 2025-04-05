# Airflow 설치

### [참고문서](https://airflow.apache.org/docs/apache-airflow/stable/howto/docker-compose/index.html#fetching-docker-compose-yaml)

### 설치 상세
1. `docker-compose.yml` 다운로드
```
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.5/docker-compose.yaml'

mkdir -p ./dags ./logs ./plugins ./config
echo -e "AIRFLOW_UID=$(id -u)" > .env
```

2. HDFS 인식 테스트를 위한 custom Docker 이미지 생성
`./custom_image/airflow/Dockerfile`


```
docker compose up airflow-init

docker compose up
```