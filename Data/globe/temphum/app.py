from flask import Flask, Response
import redis
import json
from collections import defaultdict, OrderedDict
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)
r = redis.Redis(host='YOUR_REDIS_HOST', port=6379, db=0, decode_responses=True)

BATCH_SIZE = 500
MAX_WORKERS = 8

def batched(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i + size]

def process_batch(batch):
    batch_result = []
    values = r.mget(batch)
    for key, value in zip(batch, values):
        if not value:
            continue
        try:
            _, country, datetime_str = key.split(":", 2)
            data = json.loads(value)
            batch_result.append((datetime_str, country, data))
        except Exception as e:
            print(f"Error parsing key {key}: {e}")
    return batch_result

@app.route('/globe/all/climate', methods=['GET'])
def get_structured_climate_data():
    raw_datetime = defaultdict(dict)
    raw_country = defaultdict(dict)

    keys = list(r.scan_iter("climate:*", count=100000))
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(process_batch, batch) for batch in batched(keys, BATCH_SIZE)]
        for future in as_completed(futures):
            for datetime_str, country, data in future.result():
                ordered_data = OrderedDict([
                    ("temperature", data["temperature"]),
                    ("humidity", data["humidity"])
                ])
                datetime_str = datetime_str + "-01-01 00:00:00"
                raw_datetime[datetime_str][country] = ordered_data
                raw_country[country][datetime_str] = ordered_data

    # 정렬
    group_by_datetime = OrderedDict()
    for datetime_str in sorted(raw_datetime.keys()):
        group_by_datetime[datetime_str] = OrderedDict(
            (country, raw_datetime[datetime_str][country])
            for country in sorted(raw_datetime[datetime_str].keys())
        )

    group_by_country = OrderedDict()
    for country in sorted(raw_country.keys()):
        group_by_country[country] = OrderedDict(
            (datetime_str, raw_country[country][datetime_str])
            for datetime_str in sorted(raw_country[country].keys())
        )

    result = OrderedDict([
        ("groupByDateTime", group_by_datetime),
        ("groupByCountry", group_by_country)
    ])
    return Response(json.dumps(result, ensure_ascii=False, sort_keys=False), mimetype='application/json')
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
