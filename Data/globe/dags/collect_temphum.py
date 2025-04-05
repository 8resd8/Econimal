import pandas as pd
import requests
import os
import pendulum
from airflow.models import Variable

API_KEY = Variable.get("WEATHER_API_KEY")

def collect_weather_data():
    df = pd.read_csv("/opt/airflow/dags/station_country.csv")
    result_rows = []
    now = pendulum.now("Asia/Seoul")

    for row in df.itertuples():
        lat = row.LATITUDE
        lon = row.LONGITUDE

        url = f"https://api.openweathermap.org/data/2.5/weather?units=metric&lat={lat}&lon={lon}&appid={API_KEY}"
        response = requests.get(url)

        if response.status_code != 200:
            print(f"API 호출 실패: {lat}, {lon}")
            continue

        data = response.json()

        result_rows.append({
            "country_code": row.COUNTRY_CODE,
            "latitude": lat,
            "longitude": lon,
            "temperature": data.get("main", {}).get("temp"),
            "humidity": data.get("main", {}).get("humidity"),
            "reference_date": now.strftime('%Y-%m-%d %H:%M:%S'),
            "year": now.year,
            "month": now.month,
            "day": now.day,
            "hour": now.hour
        })

    return pd.DataFrame(result_rows) if result_rows else None

def save_to_local_csv(df, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    df.to_csv(local_path, index=False)
    print(f"CSV 저장 완료: {local_path}")

def upload_csv_to_hdfs(local_path, container_path="/tmp/data.csv"):
    now = pendulum.now("Asia/Seoul")
    hdfs_path = f"/climate/temphum/collect/csv/year={now.year}/month={now.month:02d}/day={now.day:02d}/hour={now.hour:02d}"

    os.system(f'docker cp {local_path} namenode:{container_path}')
    os.system(f'docker exec namenode hdfs dfs -mkdir -p {hdfs_path}')
    os.system(f'docker exec namenode hdfs dfs -put -f {container_path} {hdfs_path}/data.csv')

    print(f"HDFS 적재 완료: {hdfs_path}/data.csv")

def main():
  try:
      df = collect_weather_data()

      if df.empty:
          print("수집된 데이터가 없음")
          return

      now = pendulum.now("Asia/Seoul")
      local_path = f"./temp_csv/data.csv"
      save_to_local_csv(df, local_path)

      hdfs_path = f"/climate/temphum/collect/csv/year={now.year}/month={now.month:02d}/day={now.day:02d}/hour={now.hour:02d}"
      upload_csv_to_hdfs(local_path, hdfs_path)

  except Exception as e:
    print(f"오류 발생: {e}")


if __name__ == "__main__":
    main()