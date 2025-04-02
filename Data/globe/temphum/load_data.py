import pymysql.cursors
import pandas as pd
import os
from tqdm import tqdm


class Connection:
    def __init__(self):
        self.con = pymysql.connect(
            host=os.environ.get("DB_HOST"),
            user=os.environ.get("DB_USER"),
            password=os.environ.get("DB_PASSWORD"),
            database=os.environ.get("DB_DATABASE"),
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


def find_location(station_code):
    curr_path = os.curdir
    csv_path = os.path.join(curr_path, "globe", "station_country.csv")
    df = pd.read_csv(csv_path)

    for row in df.itertuples():
        if str(row.STATION_CODE) == str(station_code):
            return (row.COUNTRY_CODE, row.LATITUDE, row.LONGITUDE)

    return (-1, -1, -1)


def parse_csv(csv_path):
    column_names = [
        "reference_date",
        "hour",
        "air_temperature",
        "dew_temperature",
        "humidity",
        "precipitation",
        "snow_depth",
        "wind_degree",
        "wind_speed",
        "wind_gust",
        "air_pressure",
        "sunshine",
        "weather_condition",
    ]

    df = pd.read_csv(csv_path, names=column_names)
    station_code = csv_path.split(".csv")[0].split("\\")[-1]
    print(station_code)
    country_code, latitude, longitude = find_location(station_code)

    df["reference_date"] = pd.to_datetime(
        df["reference_date"].astype(str)
        + " "
        + df["hour"].astype(str).str.zfill(2)
        + ":00",
        errors="coerce",
        format="%Y-%m-%d %H:%M",
    )
    df["year"] = df["reference_date"].dt.year
    df["month"] = df["reference_date"].dt.month
    df["day"] = df["reference_date"].dt.day

    df["country_code"] = country_code
    df["latitude"] = latitude
    df["longitude"] = longitude
    df["temperature"] = df["air_temperature"]

    result_df = df[
        [
            "country_code",
            "latitude",
            "longitude",
            "temperature",
            "humidity",
            "reference_date",
            "year",
            "month",
            "day",
            "hour",
        ]
    ]

    return result_df


def insert_csv_to_db(csv_path):
    df = parse_csv(csv_path)
    df = df.dropna()

    records = df.to_records(index=False)
    values = [tuple(row) for row in records]

    sql = """
        INSERT INTO climates (
            country_code, latitude, longitude, temperature, humidity,
            reference_date, year, month, day, hour
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    conn = Connection()
    result = conn.save_all(sql, values)

    print(f"{result} rows inserted.")


def main():
    curr_path = os.curdir
    bulk_path = os.path.join(curr_path, "globe", "bulkdata")

    for file in tqdm(os.listdir(bulk_path)):
        csv_path = os.path.join(bulk_path, file)
        insert_csv_to_db(csv_path)


if __name__ == "__main__":
    main()
