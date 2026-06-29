#!/bin/bash
# Polaris Studio Deployment Script
# Target: 47.107.147.186 (production server)
# Usage: Copy this script to server, then: bash deploy.sh

set -e

SERVER_IP="47.107.147.186"
APP_DIR="/opt/polaris"
LOG_DIR="$APP_DIR/logs"
JAR_NAME="polaris-app-1.0.0.jar"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_DIR="$APP_DIR/backend"

echo "=== Polaris Studio Deployment ==="

# --- Prerequisites check ---
command -v java >/dev/null 2>&1 || { echo "JDK 17 required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose required"; exit 1; }

# --- Create directories ---
mkdir -p "$LOG_DIR" "$BACKEND_DIR" "$FRONTEND_DIR"

# --- Deploy backend ---
echo "[1/3] Deploying backend..."
cp polaris-app-1.0.0.jar "$BACKEND_DIR/"
cd "$BACKEND_DIR"

# Create backend service (systemd)
cat > /etc/systemd/system/polaris-backend.service << 'SERVICE'
[Unit]
Description=Polaris Studio Backend
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/polaris/backend
ExecStart=/usr/bin/java -jar polaris-app-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
StandardOutput=append:/opt/polaris/logs/backend.log
StandardError=append:/opt/polaris/logs/backend.err

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable polaris-backend
systemctl restart polaris-backend
echo "  Backend started on port 8080"

# --- Deploy frontend ---
echo "[2/3] Deploying frontend..."
mkdir -p "$FRONTEND_DIR"
cp -r .output/* "$FRONTEND_DIR/"

# Create frontend service (systemd)
cat > /etc/systemd/system/polaris-frontend.service << 'SERVICE'
[Unit]
Description=Polaris Studio Frontend
After=network.target polaris-backend.service
Wants=polaris-backend.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/polaris/frontend
Environment=NUXT_PUBLIC_API_BASE=http://SERVER_IP:8080
ExecStart=/usr/bin/node server/index.mjs
Restart=always
RestartSec=10
StandardOutput=append:/opt/polaris/logs/frontend.log
StandardError=append:/opt/polaris/logs/frontend.err

[Install]
WantedBy=multi-user.target
SERVICE

sed -i "s/SERVER_IP/$SERVER_IP/g" /etc/systemd/system/polaris-frontend.service
systemctl daemon-reload
systemctl enable polaris-frontend
systemctl restart polaris-frontend
echo "  Frontend started on port 3000"

# --- Deploy infrastructure ---
echo "[3/3] Starting Docker infrastructure..."
cd "$APP_DIR"
docker-compose -f docker-compose.yml up -d
echo "  Docker services started"

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://$SERVER_IP:3000"
echo "Backend:  http://$SERVER_IP:8080"
echo "Swagger:  http://$SERVER_IP:8080/swagger-ui.html"
echo "MinIO:    http://$SERVER_IP:9001"
echo "RabbitMQ: http://$SERVER_IP:15672"
echo ""
echo "=== Service Management ==="
echo "systemctl status polaris-backend"
echo "systemctl status polaris-frontend"
echo "journalctl -u polaris-backend -f  # tail logs"
echo ""
echo "=== Security Notes ==="
echo "1. Change default passwords (MySQL, RabbitMQ, MinIO) in production"
echo "2. Configure firewall: ufw allow 22,80,443"
echo "3. Set up Nginx reverse proxy with HTTPS (certbot)"
echo "4. Never expose port 8080 directly to internet"
