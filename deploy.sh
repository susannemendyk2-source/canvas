#!/bin/bash
# Polaris Studio Deployment Script
# Target: 47.107.147.186 (Alibaba Cloud 2C2G 40GB)
# Usage: Copy artifacts + this script to server, then: bash deploy.sh

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
command -v nginx >/dev/null 2>&1 || { echo "Nginx required (apt install nginx)"; exit 1; }

# --- Create directories ---
mkdir -p "$LOG_DIR" "$BACKEND_DIR" "$FRONTEND_DIR"

# --- 0. Nginx ---
echo "[0/4] Configuring Nginx..."
if [ -f nginx-polaris.conf ]; then
    cp nginx-polaris.conf /etc/nginx/sites-available/polaris
    ln -sf /etc/nginx/sites-available/polaris /etc/nginx/sites-enabled/
    # Remove default site if it conflicts
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "  Nginx configured on port 80"
else
    echo "  WARNING: nginx-polaris.conf not found, skipping"
fi

# --- 1. Docker infrastructure ---
echo "[1/4] Starting Docker infrastructure..."
if [ -f docker-compose.yml ]; then
    docker-compose -f docker-compose.yml up -d
    echo "  Docker services started (MySQL, Redis, MinIO, RabbitMQ)"
else
    echo "  WARNING: docker-compose.yml not found, skipping"
fi

# --- 2. Backend ---
echo "[2/4] Deploying backend..."
if [ -f "$JAR_NAME" ]; then
    cp "$JAR_NAME" "$BACKEND_DIR/"
else
    echo "  ERROR: $JAR_NAME not found"; exit 1
fi

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
echo "  Backend started (port 8080, Nginx proxy /api/ -> 8080)"

# --- 3. Frontend ---
echo "[3/4] Deploying frontend..."
if [ -d .output ]; then
    cp -r .output/* "$FRONTEND_DIR/"
else
    echo "  ERROR: .output directory not found"; exit 1
fi

cat > /etc/systemd/system/polaris-frontend.service << 'SERVICE'
[Unit]
Description=Polaris Studio Frontend
After=network.target polaris-backend.service
Wants=polaris-backend.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/polaris/frontend
ExecStart=/usr/bin/node server/index.mjs
Restart=always
RestartSec=10
StandardOutput=append:/opt/polaris/logs/frontend.log
StandardError=append:/opt/polaris/logs/frontend.err

[Install]
WantedBy=multi-user.target
SERVICE

systemctl daemon-reload
systemctl enable polaris-frontend
systemctl restart polaris-frontend
echo "  Frontend started (port 3000, Nginx proxy / -> 3000)"

echo ""
echo "=== Deployment Complete ==="
echo "Frontend: http://$SERVER_IP"
echo "Backend:  http://$SERVER_IP/api/"
echo ""
echo "=== Service Management ==="
echo "systemctl status polaris-backend"
echo "systemctl status polaris-frontend"
echo "journalctl -u polaris-backend -f"
echo ""
echo "=== Security Checklist ==="
echo "1. Alibaba Cloud Security Group: allow ONLY 22, 80 (not 3000, 8080, 3306, etc.)"
echo "2. Docker services listen ONLY on 127.0.0.1 (already configured)"
echo "3. Change default passwords in docker-compose.yml before production use"
echo "4. Add domain + HTTPS via certbot --nginx"
echo "5. JWT secret is set in application-prod.yml (baked into JAR)"
echo "6. Nginx blocks /actuator, /h2-console; rate-limits /api/auth /api/ai"
