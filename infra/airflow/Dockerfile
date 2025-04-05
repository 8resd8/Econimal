FROM apache/airflow:2.10.5
USER root
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
         vim \
  && apt-get autoremove -yqq --purge \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir "apache-airflow==${AIRFLOW_VERSION}" lxml apache-airflow-providers-apache-hdfs
USER airflow
