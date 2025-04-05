import pendulum
from airflow.decorators import dag, task
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from load_temphum import insert_csv_to_db


@dag(
    dag_id='load_temphum_dag',
    schedule=None,
    # schedule='@hourly',
    start_date=pendulum.datetime(2025, 4, 3, tz="Asia/Seoul"),
    catchup=False,
    tags=['climate', 'mysql'],
)
def load_temphum_dag():

    @task()
    def load_data():
      csv_path = "/opt/airflow/dags/tmp/data.csv"
      insert_csv_to_db(csv_path)
    
    load_data()

load_temphum_dag()
