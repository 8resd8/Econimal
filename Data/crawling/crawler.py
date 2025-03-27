import os
import csv
import time
import glob
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# 키워드 리스트 정의
keywords = sorted(set([
    "기후 변화", "지구 온난화", "탄소중립", "탄소 배출", "온실가스", "기후 위기", "기후 행동",
    "기후 변화 대응", "지속가능한 미래", "기후 정책",
    "미세먼지", "초미세먼지", "공기 오염", "대기오염", "청정 공기", "스모그", "공기 정화",
    "실내 공기질", "산성비", "오존층 파괴",
    "수질 오염", "깨끗한 물", "하천 정화", "물 부족", "수돗물 정화", "강 오염", "하수처리",
    "상수원 보호", "물 재활용", "수질 개선",
    "에너지 절약", "전기 절약", "전력 소비", "에너지 효율", "태양광 발전", "재생 에너지",
    "풍력 발전", "스마트 그리드", "에너지 전환", "에너지 보존",
    "플라스틱 줄이기", "재활용", "분리수거", "제로 웨이스트", "리사이클링", "일회용품 줄이기",
    "재사용", "업사이클링", "환경 캠페인", "쓰레기 문제",
    "생물 다양성", "멸종 위기", "생태계 보전", "야생 동물 보호", "숲 보호", "해양 생물 보호",
    "해양 플라스틱", "자연 보호", "자연 생태계", "환경 보호",
    "탄소포인트제", "친환경 제품", "친환경 자동차", "전기차", "탄소세", "환경세",
    "환경 교육", "환경 뉴스", "ESG 경영", "녹색 생활"
]))

# 수집 함수
def youtube_scroll_crawl(query, max_videos=50, scroll_pause=2):
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(f"https://www.youtube.com/results?search_query={query}")

    video_data = {}
    last_height = driver.execute_script("return document.documentElement.scrollHeight")

    while len(video_data) < max_videos:
        driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
        time.sleep(scroll_pause)

        videos = driver.find_elements(By.ID, 'video-title')
        for v in videos:
            title = v.get_attribute('title')
            url = v.get_attribute('href')
            if url and title and 'watch' in url:
                video_id = url.split("v=")[-1]
                if video_id not in video_data:
                    video_data[video_id] = {
                        "title": title,
                        "url": url,
                        "video_id": video_id,
                        "keyword": query
                    }
            if len(video_data) >= max_videos:
                break

        new_height = driver.execute_script("return document.documentElement.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    driver.quit()
    return list(video_data.values())

# 디렉토리 설정
output_dir = "youtube_keywords"
os.makedirs(output_dir, exist_ok=True)

# 수집 및 저장
for keyword in keywords:
    print(f"[{keyword}] 수집 중...")
    results = youtube_scroll_crawl(keyword, max_videos=50)
    file_path = os.path.join(output_dir, f"{keyword.replace(' ', '_')}.csv")
    with open(file_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["title", "url", "video_id", "keyword"])
        writer.writeheader()
        writer.writerows(results)
    print(f"→ {len(results)}개 저장 완료")

# 모든 수집된 CSV 통합 및 중복 제거
csv_files = glob.glob(f"{output_dir}/*.csv")
all_dfs = []
for file in csv_files:
    df = pd.read_csv(file)
    all_dfs.append(df)

combined_df = pd.concat(all_dfs, ignore_index=True)
deduplicated_df = combined_df.drop_duplicates(subset=["video_id"])
deduplicated_df.to_csv("merged_youtube_videos.csv", index=False)

print(f"\n✅ 통합 완료: 총 {len(deduplicated_df)}개 영상 저장됨 → merged_youtube_videos.csv")
