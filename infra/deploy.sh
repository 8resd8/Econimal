#!/bin/bash
set -e
set -a; source .env; set +a

echo "Starting MySQL and Redis (if not already running)..."
sudo docker start mysql redis
echo "MySQL and Redis are up."
echo "-----------------------------------"

echo "Pulling latest Docker images..."
sudo docker compose pull
echo "Docker images pulled."
echo "-----------------------------------"

EXIST_BLUE=$(docker compose ps | grep "backend-blue" | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    echo "Blue backend is not running, deploying blue..."

#    docker compose up -d backend-blue --build
    docker compose up -d backend-blue --wait
    BEFORE_COLOR="green"
    AFTER_COLOR="blue"
    BEFORE_PORT=${GREEN_PORT}
    AFTER_PORT=${BLUE_PORT}
else
    echo "Blue backend is running, deploying green..."

#    docker compose up -d backend-green --build
    docker compose up -d backend-green --wait
    BEFORE_COLOR="blue"
    AFTER_COLOR="green"
    BEFORE_PORT=${BLUE_PORT}
    AFTER_PORT=${GREEN_PORT}
fi
sleep 30
echo "===== ${AFTER_COLOR} server up(port:${AFTER_PORT}) ====="
docker compose stop backend-${BEFORE_COLOR}
docker rmi backend-${BEFORE_COLOR}:0.0.1
echo "===== ${BEFORE_COLOR} server down(port:${BEFORE_PORT}) ====="

docker compose stop frontend
docker compose up -d frontend --build
