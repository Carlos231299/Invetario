#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
APP_DIR="/var/www/inventario-ferreteria-bastidas"
GIT_REPO="https://github.com/Carlos231299/Invetario.git"
SERVER_URL="http://ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $PEM_FILE"
    exit 1
fi

ssh_exec() {
    SSH_CONFIG_BACKUP=""
    if [ -f ~/.ssh/config ]; then
        SSH_CONFIG_BACKUP=~/.ssh/config.backup.$$
        cp ~/.ssh/config "$SSH_CONFIG_BACKUP" 2>/dev/null || true
        rm -f ~/.ssh/config 2>/dev/null || true
    fi
    
    ssh -i "$PEM_FILE" \
        -F /dev/null \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=30 \
        -o ServerAliveInterval=60 \
        -o ServerAliveCountMax=3 \
        "$SERVER" "$1"
    
    if [ -n "$SSH_CONFIG_BACKUP" ] && [ -f "$SSH_CONFIG_BACKUP" ]; then
        mv "$SSH_CONFIG_BACKUP" ~/.ssh/config 2>/dev/null || true
    fi
}

echo "🚀 Despliegue rápido iniciado..."

# Verificar git
echo "📥 Verificando Git..."
ssh_exec "command -v git >/dev/null 2>&1 || { echo 'Instalando Git...'; sudo apt-get update && sudo apt-get install -y git; }"

# Clonar desde GitHub
echo "📥 Clonando repositorio..."
ssh_exec "sudo rm -rf $APP_DIR && sudo mkdir -p $APP_DIR && sudo chown ubuntu:ubuntu $APP_DIR && cd $APP_DIR && git clone $GIT_REPO ."

# Configurar backend y frontend
echo "🔧 Configurando aplicación..."

# Base de datos primero
echo "  - Configurando base de datos..."
ssh_exec "sudo mysql -e 'CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;' 2>/dev/null || true"

# Backend
echo "  - Instalando dependencias del backend..."
ssh_exec "cd $APP_DIR/backend && npm install --production"
ssh_exec "cd $APP_DIR/backend && cp .env.example .env 2>/dev/null || true"
ssh_exec "cd $APP_DIR/backend && sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=$SERVER_URL|' .env"

# Frontend
echo "  - Instalando dependencias del frontend..."
ssh_exec "cd $APP_DIR/frontend && npm install"

# Ejecutar schema
echo "  - Ejecutando schema SQL..."
ssh_exec "cd $APP_DIR/backend && sudo mysql inventario_ferreteria_bastidas < src/database/schema.sql 2>/dev/null || true"

# PM2
echo "  - Configurando PM2..."
ssh_exec "cd $APP_DIR/backend && pm2 delete inventario-backend 2>/dev/null || true"
ssh_exec "cd $APP_DIR/backend && pm2 start server.js --name inventario-backend"
ssh_exec "pm2 save"
ssh_exec "pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null | sudo bash || true"

# Build frontend con variable de entorno
echo "  - Construyendo frontend..."
ssh_exec "cd $APP_DIR/frontend && VITE_API_URL=$SERVER_URL/api npm run build"

# Desplegar frontend
ssh_exec "sudo rm -rf /var/www/html/inventario && sudo mkdir -p /var/www/html/inventario && sudo cp -r $APP_DIR/frontend/dist/* /var/www/html/inventario/ && sudo chown -R www-data:www-data /var/www/html/inventario"

# Configurar Nginx
ssh_exec "sudo tee /etc/nginx/sites-available/inventario > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/inventario;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
    location /api { 
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF"

ssh_exec "sudo ln -sf /etc/nginx/sites-available/inventario /etc/nginx/sites-enabled/ && sudo rm -f /etc/nginx/sites-enabled/default && sudo nginx -t && sudo systemctl reload nginx"

echo "✅ Despliegue completado exitosamente!"
echo "🌍 La aplicación está disponible en: $SERVER_URL"
echo "📧 Credenciales por defecto:"
echo "   Email: admin@ferreteria.com"
echo "   Password: admin123"

