##!/bin/bash
#set -e
#set -a; source .env; set +a
#
#echo "Starting MySQL and Redis (if not already running)..."
#sudo docker start mysql redis
#echo "MySQL and Redis are up."
#echo "-----------------------------------"
#
#echo "Pulling latest Docker images..."
#sudo docker compose pull
#echo "Docker images pulled."
#echo "-----------------------------------"
#
#EXIST_BLUE=$(docker compose ps | grep "backend-blue" | grep Up)
#
#if [ -z "$EXIST_BLUE" ]; then
#    echo "Blue backend is not running, deploying blue..."
#
##    docker compose up -d backend-blue --build
#    docker compose up -d backend-blue --wait
#    BEFORE_COLOR="green"
#    AFTER_COLOR="blue"
#    BEFORE_PORT=${GREEN_PORT}
#    AFTER_PORT=${BLUE_PORT}
#else
#    echo "Blue backend is running, deploying green..."
#
##    docker compose up -d backend-green --build
#    docker compose up -d backend-green --wait
#    BEFORE_COLOR="blue"
#    AFTER_COLOR="green"
#    BEFORE_PORT=${BLUE_PORT}
#    AFTER_PORT=${GREEN_PORT}
#fi
#sleep 30
#echo "===== ${AFTER_COLOR} server up(port:${AFTER_PORT}) ====="
#docker compose stop backend-${BEFORE_COLOR}
#docker rmi backend-${BEFORE_COLOR}:0.0.1
#echo "===== ${BEFORE_COLOR} server down(port:${BEFORE_PORT}) ====="
#
#docker compose stop frontend
#docker compose up -d frontend --build

#!/bin/bash
set -e # 스크립트 실행 중 오류 발생 시 즉시 중단
set -a; source .env; set +a

echo "Starting/Ensuring MySQL and Redis are running..."
# docker start 대신 docker compose up -d --wait 사용 권장
# 컨테이너가 없으면 만들고, 있으면 시작하며, 준비될 때까지 기다립니다.
sudo docker compose up -d mysql redis --wait
echo "MySQL and Redis are up."
echo "-----------------------------------"

echo "Pulling latest Docker images..."
sudo docker compose pull
echo "Docker images pulled."
echo "-----------------------------------"

# --- 기존 백엔드 컨테이너 모두 중지 및 삭제 ---
echo "Stopping and removing existing backend containers (blue and green)..."
sudo docker compose stop backend-blue backend-green || true
sudo docker compose rm -f backend-blue backend-green || true
echo "Existing backend containers stopped and removed."
echo "-----------------------------------"

# --- 새로운 백엔드 인스턴스 시작 (여기서는 항상 backend-blue 서비스 이름 사용) ---
echo "Starting new backend instance (backend-blue)..."
sudo docker compose up -d --force-recreate backend-blue --wait
echo "===== backend-blue server up (port:${BLUE_PORT}) ====="
echo "-----------------------------------"

# --- 프론트엔드 업데이트/재시작 ---
#echo "Updating/Restarting frontend..."
## 기존 프론트엔드 컨테이너 중지 (실행 중이라면)
#sudo docker compose stop frontend || true
#sudo docker compose up -d --force-recreate frontend --wait
#echo "Frontend is up."
#echo "-----------------------------------"
#docker images -f "dangling=true" -q
#docker image prune
