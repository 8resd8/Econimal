#!/bin/bash
set -a; source .env; set +a

EXIST_BLUE=$(docker-compose ps | grep "backend-blue" | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    docker-compose up -d backend-blue
    BEFORE_COLOR="green"
    AFTER_COLOR="blue"
    BEFORE_PORT=${GREEN_PORT}
    AFTER_PORT=${BLUE_PORT}
else
    docker-compose up -d backend-green
    BEFORE_COLOR="blue"
    AFTER_COLOR="green"
    BEFORE_PORT=${BLUE_PORT}
    AFTER_PORT=${GREEN_PORT}
fi

echo "===== ${AFTER_COLOR} server up(port:${AFTER_PORT}) ====="
docker-compose stop backend-${BEFORE_COLOR}
echo "===== ${BEFORE_COLOR} server down(port:${BEFORE_PORT}) ====="

