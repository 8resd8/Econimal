import pendulum
from airflow.decorators import dag, task
import subprocess

@dag(
    dag_id='calculate_temphum_dag',
    schedule=None,
    # schedule='@hourly',
    start_date=pendulum.datetime(2025, 4, 3, tz="Asia/Seoul"),
    catchup=False,
    tags=['climate', 'spark', 'redis'],
)
def calculate_temphum_dag():

    @task()
    def run_spark_in_docker():
        """
        spark-master 컨테이너 내부에서 spark-submit 실행
        """
        try:
            result = subprocess.run([
                "docker", "exec", "-i", "spark-master",
                "bash", "-c",
                "/spark/bin/spark-submit --packages com.redislabs:spark-redis_2.12:3.1.0 calculate_temphum_pipeline.py"
            ], check=True, text=True, capture_output=True)

            print("[STDOUT]", result.stdout)
            print("[STDERR]", result.stderr)

        except subprocess.CalledProcessError as e:
            print("[ERROR] Spark job failed")
            print("[STDOUT]", e.stdout)
            print("[STDERR]", e.stderr)
            raise

    run_spark_in_docker()

calculate_temphum_dag()
