# -*- coding: utf-8 -*-
# This file must be run on cloud not local
# Python 2.7
from pyspark.sql import SparkSession
from pyspark.sql.functions import year, month, dayofmonth, hour, col


spark = SparkSession.builder \
            .appName("InsertTempHumDataBulk") \
            .master("spark://spark-master:7077") \
            .config("spark.hadoop.fs.defaultFS", "hdfs://namenode:9000") \
            .getOrCreate()

sc = spark.sparkContext
if sc is not None:
    print("[Success] connect Spark")
else:
    print("[Fail] connect Spark")

spark.sparkContext.setLogLevel("WARN")

file_path = "/climate/climates_202503260931.csv"

hadoop_conf = spark._jsc.hadoopConfiguration()
fs = spark._jvm.org.apache.hadoop.fs.FileSystem.get(hadoop_conf)
path = spark._jvm.org.apache.hadoop.fs.Path(file_path)

if fs.exists(path):
    print("[파일 있음] {}".format(file_path))
    df = spark.read.csv("hdfs://namenode:9000{}".format(file_path), header=True, inferSchema=True)

    output_path = "/climate/temphum/collect/parquet"
    df.repartition(500, "year", "month") \
        .write \
        .partitionBy("year", "month") \
        .mode("overwrite") \
        .parquet(output_path)


    spark.stop()
else:
    print("[파일 없음] HDFS에 '{}' 파일이 존재하지 않습니다.".format(file_path))
