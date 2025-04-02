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
            .appName("CalculateTempHum") \
            .master("spark://spark-master:7077") \
            .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:9000") \
            .config("spark.redis.host", "YOUR_REDIS_HOST") \
            .config("spark.redis.port", "6379") \
            .config("spark.redis.pipeline.enabled", "true") \
            .config("spark.redis.write.batch.size", "1000")  \
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

print("[Json] Json 생성 시작")
start_time = time.time()
df_groupByDateTime = monthly_avg_all.groupBy("reference_date").agg(
    F.map_from_entries(
        F.collect_list(
            F.struct(
                F.col("country_code").alias("key"),
                F.struct(
                    F.col("avg_temperature").cast("string").alias("temperature"),
                    F.col("avg_humidity").cast("string").alias("humidity")
                ).alias("value")
            )
        )
    ).alias("country_map")
)

df_groupByDateTime = df_groupByDateTime.select(
    F.date_format("reference_date", "yyyy-MM-dd HH:mm:ss").alias("date"),
    F.col("country_map")
)

df_groupByDateTime_map = df_groupByDateTime.select(
    F.struct(
        F.col("date").alias("key"),
        F.col("country_map").alias("value")
    ).alias("entry")
).agg(
    F.map_from_entries(F.collect_list("entry")).alias("groupByDateTime")
)

df_groupByCountry = monthly_avg_all.groupBy("country_code").agg(
    F.map_from_entries(
        F.collect_list(
            F.struct(
                F.date_format("reference_date", "yyyy-MM-dd HH:mm:ss").alias("key"),
                F.struct(
                    F.col("avg_temperature").cast("string").alias("temperature"),
                    F.col("avg_humidity").cast("string").alias("humidity")
                ).alias("value")
            )
        )
    ).alias("date_map")
)

df_groupByCountry_map = df_groupByCountry.select(
    F.struct(
        F.col("country_code").alias("key"),
        F.col("date_map").alias("value")
    ).alias("entry")
).agg(
    F.map_from_entries(F.collect_list("entry")).alias("groupByCountry")
)

final_df = df_groupByDateTime_map.crossJoin(df_groupByCountry_map).select(
    F.struct(
        F.col("groupByDateTime"),
        F.col("groupByCountry")
    ).alias("result")
)
print("[Json] 온습도 JSON 생성 시간: {:.2f}초".format(time.time() - start_time))
print("[Total] 현재 소요 시간: {:.2f}초".format(time.time() - first_time))

print("[Redis] Redis 저장용 데이터 준비 시작")
start_time = time.time()
flat_df = monthly_avg_all.select(
    F.col("country_code"),
    F.date_format("reference_date", "yyyy-MM-dd HH:mm:ss").alias("date"),
    F.col("avg_temperature").cast("string"),
    F.col("avg_humidity").cast("string")
)
kv_df = flat_df.select(
    F.concat_ws(":", F.lit("climate"), "country_code", "date").alias("key"),
    F.col("avg_temperature"),
    F.col("avg_humidity")
)
kv_df = kv_df.repartition(50)
kv_list = kv_df.collect()
print("[All] Redis 저장용 데이터 준비 시간: {:.2f}초".format(time.time() - start_time))

print("[Redis] Redis 저장 시작")
start_time = time.time()
redis_client = redis.StrictRedis(host='YOUR_REDIS_HOST', port=6379, db=0, decode_responses=True)
pipe = redis_client.pipeline()

for row in kv_list:
    key = row["key"]
    value = json.dumps({
        "temperature": row["avg_temperature"],
        "humidity": row["avg_humidity"]
    })
    pipe.set(key, value)

pipe.execute()
print("[Redis] Redis 저장 시간: {:.2f}초".format(time.time() - start_time))
print("[Total] 전체 소요 시간: {:.2f}초".format(time.time() - first_time))
