import pendulum
import pandas as pd
from airflow.decorators import dag, task
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from collect_temphum import collect_weather_data, save_to_local_csv, upload_csv_to_hdfs

@dag(
    dag_id='collect_temphum_dag',
    schedule='@hourly',
    start_date=pendulum.datetime(2025, 4, 3, tz="Asia/Seoul"),
    catchup=False,
    tags=['climate', 'request', 'hdfs'],
)
def collect_temphum_dag():

    @task()
    def collect_task():
        df = collect_weather_data()
        if df is None or df.empty:
            raise ValueError("수집된 데이터가 없습니다.")
        return df.to_json()

    @task()
    def save_task(df_json):
        df = pd.read_json(df_json)
        now = pendulum.now("Asia/Seoul")
        local_path = "/opt/airflow/dags/tmp/data.csv"
        save_to_local_csv(df, local_path)
        return local_path

    @task()
    def upload_task(local_path):
        upload_csv_to_hdfs(local_path)

    trigger_load = TriggerDagRunOperator(
        task_id="trigger_load_dag",
        trigger_dag_id="load_temphum_dag",
        wait_for_completion=False  # True로 바꾸면 calculate가 끝날 때까지 기다림
    )

    trigger_calculate = TriggerDagRunOperator(
        task_id="trigger_calculate_dag",
        trigger_dag_id="calculate_temphum_dag",
        wait_for_completion=False  # True로 바꾸면 calculate가 끝날 때까지 기다림
    )

    df_json = collect_task()
    path = save_task(df_json)
    upload = upload_task(path)

    upload >> trigger_load >> trigger_calculate
    
dag = collect_temphum_dag()
