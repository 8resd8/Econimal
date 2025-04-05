import pymysql.cursors
import pandas as pd
import os
from airflow.models import Variable

DB_HOST = Variable.get("DB_HOST")
DB_USER = Variable.get("DB_USER")
DB_PASSWORD = Variable.get("DB_PASSWORD")
DB_DATABASE = Variable.get("DB_DATABASE")

class Connection:
    def __init__(self):
        self.con = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_DATABASE,
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor,
        )
        self.cur = self.con.cursor()

    def select_one(self, sql, args=None):
        self.cur.execute(sql, args)
        result = self.cur.fetchone()
        self.cur.close()
        self.con.close()
        return result

    def select_all(self, sql, args=None):
        self.cur.execute(sql, args)
        result = self.cur.fetchall()
        self.cur.close()
        self.con.close()
        return result

    def save_one(self, sql, args=None):
        result = self.cur.execute(sql, args)
        self.cur.close()
        self.con.close()
        return result

    def save_all(self, sql, args=None):
        result = self.cur.executemany(sql, args)
        self.con.commit()
        self.cur.close()
        self.con.close()
        return result

def insert_csv_to_db(csv_path):
    df = pd.read_csv(csv_path)
    df = df.dropna()

    records = df.to_records(index=False)
    values = [tuple(row) for row in records]

    # 이미 동일 country_code, year, month, day, hour가 있는 경우 무시
    sql = """
        INSERT IGNORE INTO climates (
            country_code, latitude, longitude, temperature, humidity,
            reference_date, year, month, day, hour
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    conn = Connection()
    result = conn.save_all(sql, values)

    print(f"{result} rows inserted.")


def main():
    csv_path = f"./temp_csv/data.csv"
    insert_csv_to_db(csv_path)

if __name__ == "__main__":
    main()
