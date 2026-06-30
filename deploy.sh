#!/bin/bash
# Polaris Studio deployment helper
# Target: 47.107.147.186
# Run this on the server from a directory containing:
#   polaris-app-1.0.0.jar
#   public/              Nuxt static output copied from polaris-web/.output/public
#   docker-compose.yml
#   init.sql
#   nginx-polaris.conf

set -euo pipefail

SERVER_IP="47.107.147.186"
APP_DIR="/opt/polaris"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
INFRA_DIR="$APP_DIR/infra"
LOG_DIR="$APP_DIR/logs"
JAR_NAME="polaris-app-1.0.0.jar"

echo "=== Polaris Studio Deployment: $SERVER_IP ==="

command -v java >/dev/null 2>&1 || { echo "JDK 17 runtime is required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required"; exit 1; }
command -v nginx >/dev/null 2>&1 || { echo "Nginx is required"; exit 1; }

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "Docker Compose is required"
  exit 1
fi

mkdir -p "$BACKEND_DIR" "$FRONTEND_DIR" "$INFRA_DIR" "$LOG_DIR"

echo "[1/5] Copying infrastructure files..."
cp docker-compose.yml "$INFRA_DIR/docker-compose.yml"
cp init.sql "$INFRA_DIR/init.sql"

echo "[2/5] Starting MySQL, Redis and MinIO..."
cd "$INFRA_DIR"
$COMPOSE up -d

echo "[3/5] Deploying backend..."
cd -
cp "$JAR_NAME" "$BACKEND_DIR/$JAR_NAME"

cat > /etc/systemd/system/polaris-backend.service <<SERVICE
[Unit]
Description=Polaris Studio Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=$BACKEND_DIR
ExecStart=/usr/bin/java -Xms256m -Xmx700m -jar $BACKEND_DIR/$JAR_NAME --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=append:$LOG_DIR/backend.log
StandardError=append:$LOG_DIR/backend.err

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable polaris-backend
systemctl restart polaris-backend

echo "[4/5] Deploying frontend static files..."
if [ -d public ]; then
  rm -rf "$FRONTEND_DIR"/*
  cp -r public/. "$FRONTEND_DIR/"
else
  echo "Missing public/ directory. Copy polaris-web/.output/public here first."
  exit 1
fi

echo "[5/5] Configuring Nginx..."
cp nginx-polaris.conf /etc/nginx/sites-available/polaris
ln -sf /etc/nginx/sites-available/polaris /etc/nginx/sites-enabled/polaris
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo ""
echo "Deployment complete:"
echo "  Web: http://$SERVER_IP"
echo "  Backend: http://127.0.0.1:8080"
echo ""
echo "Useful commands:"
echo "  systemctl status polaris-backend"
echo "  tail -f $LOG_DIR/backend.log"
echo "  docker ps"
