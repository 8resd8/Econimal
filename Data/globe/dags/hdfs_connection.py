import pendulum
from airflow.decorators import dag,task
from airflow.providers.apache.hdfs.sensors.web_hdfs import WebHdfsSensor
from airflow.providers.apache.hdfs.hooks.webhdfs import WebHDFSHook
from airflow.operators.python import PythonOperator

@dag(
    dag_id='hdfs_connect',
    start_date=pendulum.datetime(2024, 8, 25, tz="Asia/Seoul"),
    schedule="@once",
    catchup=False
)

def hdfs():

    @task
    def check_hdfs_path():
        check_hdfs_path = WebHdfsSensor(
            task_id='check_hdfs_folder',
            filepath='/climate',
            webhdfs_conn_id ='hdfs_connection',
            timeout=60,
            poke_interval=20
        )

    @task
    def check_hdfs_path2():
        hook = WebHDFSHook('hdfs_connection')
        path = '/climate'
        status = hook.check_for_path(path)
        return bool(status)

    check_hdfs_path() >> check_hdfs_path2()

hdfs()
