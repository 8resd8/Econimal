#!/bin/bash
set -a; source .env; set +a

docker compose start mysql redis

EXIST_BLUE=$(docker compose ps | grep "backend-blue" | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    docker compose up -d backend-blue --build
    BEFORE_COLOR="green"
    AFTER_COLOR="blue"
    BEFORE_PORT=${GREEN_PORT}
    AFTER_PORT=${BLUE_PORT}
else
    docker compose up -d backend-green --build
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
