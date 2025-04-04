# -*- coding: utf-8 -*-
# This file must be run on cloud not local
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

from datetime import datetime, timedelta
import time
import json
import io
import redis

first_time = time.time()

spark = SparkSession.builder \
            .appName("CalculateTempHumPipeline") \
            .master("spark://spark-master:7077") \
            .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:9000") \
            .getOrCreate()

sc = spark.sparkContext
if sc is not None:
    print("[Success] connect Spark")
else:
    print("[Fail] connect Spark")

spark.sparkContext.setLogLevel("WARN")
spark.conf.set("spark.sql.parquet.mergeSchema", "false")

# parquet 로드
print("[Start] Load Parquet")
df = spark.read.parquet("/climate/temphum/collect/parquet")
print("[Finish] Load Parquet")

# timestamp로 변경 및 월 단위로
df = df.withColumn("reference_date", F.col("reference_date").cast("timestamp"))
df = df.withColumn("reference_date", F.date_trunc("month", F.col("reference_date")))

# 필요한 파티션 수로 조정
print("[Before] 파티션 수:", df.rdd.getNumPartitions())
df = df.coalesce(10)  
print("[After] 파티션 수:", df.rdd.getNumPartitions())

# 전체 기간 월 평균
print("[Agg] 온습도 평균 계산 시작")
start_time = time.time()
monthly_avg_all = df.groupBy("country_code", "reference_date") \
                    .agg(
                        F.avg("temperature").alias("avg_temperature"),
                        F.avg("humidity").alias("avg_humidity")
                    )
print("[Agg] 온습도 평균 계산 시간: {:.2f}초".format(time.time() - start_time))

print("[Kafka] Kafka 저장용 데이터 준비 시작")
start_time = time.time()
kafka_df = monthly_avg_all.select(
    F.col("country_code"),
    F.date_format("reference_date", "yyyy-MM-dd HH:mm:ss").alias("date"),
    F.col("avg_temperature").alias("avg_temperature"),
    F.col("avg_humidity").alias("avg_humidity")
)

kafka_df = kafka_df.select(
    F.to_json(F.struct(
        F.col("country_code"),
        F.col("date"),
        F.col("avg_temperature"),
        F.col("avg_humidity")
    )).alias("value")
)

print("[Kafka] Kafka 저장용 데이터 준비 시간: {:.2f}초".format(time.time() - start_time))

print("[Kafka] Kafka 저장 시작")
kafka_df.write \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka-broker:9092") \
    .option("topic", "climate_topic") \
    .option("batch.size", "1000") \
    .save()
print("[Kafka] Kafka 저장 시간: {:.2f}초".format(time.time() - start_time))
print("[Total] 전체 소요 시간: {:.2f}초".format(time.time() - first_time))
