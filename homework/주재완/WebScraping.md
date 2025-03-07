# Web Scraping with Python

## Web Scraper란?
웹 스크래퍼(Web Scraper)는 웹사이트에서 데이터를 추출하는 도구입니다.
예를 들어, Facebook에 URL을 붙여넣으면 미리보기가 생성되는 것과 같은 원리입니다.

### Web Scraper의 활용 예시
- 리뷰, 가격 비교
- 뉴스 및 게시글 크롤링
- 다양한 웹사이트에서 정보를 효율적으로 수집

## Web Scraper 제작 가이드라인

### 1. 필요한 모듈 가져오기
```python
import requests
from bs4 import BeautifulSoup
```
- `requests`: 웹 페이지의 HTML 데이터를 가져옴
- `BeautifulSoup`: HTML에서 원하는 정보를 추출

### 2. HTML 가져오기
```python
URL = "https://www.example.com"
response = requests.get(URL)
soup = BeautifulSoup(response.text, "html.parser")
```

### 3. 데이터 추출하기
```python
title = soup.find("h1").get_text()
links = soup.find_all("a")
```

### 4. CSV 파일로 저장하기
```python
import csv

def save_to_file(jobs):
    file = open("jobs.csv", mode="w", newline='')
    writer = csv.writer(file)
    writer.writerow(["Title", "Company", "Location", "Link"])
    for job in jobs:
        writer.writerow(list(job.values()))
    file.close()
```

---

## Web Scraper 예제: Indeed & StackOverflow

### 1. Indeed 스크래퍼
```python
LIMIT = 50
URL = f"https://www.indeed.com/jobs?q=python&limit={LIMIT}"

def get_last_page():
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html.parser")
    pagination = soup.find("div", {"class": "pagination"})
    links = pagination.find_all('a')
    pages = [int(link.string) for link in links[:-1]]
    return pages[-1]
```

### 2. StackOverflow 스크래퍼
```python
URL = "https://stackoverflow.com/jobs?q=python"

def get_last_page():
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html.parser")
    pages = soup.find("div", {"class": "s-pagination"}).find_all("a")
    last_page = int(pages[-2].get_text(strip=True))
    return last_page
```

### 3. 데이터 저장 및 실행
```python
from indeed import get_jobs as get_indeed_jobs
from so import get_jobs as get_so_jobs
from save import save_to_file

indeed_jobs = get_indeed_jobs()
so_jobs = get_so_jobs()
jobs = indeed_jobs + so_jobs
save_to_file(jobs)
```
