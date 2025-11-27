#!/bin/bash

# Script para verificar conectividad y estado del servidor

PEM_FILE="plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"

if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo $PEM_FILE"
    exit 1
fi

echo "🔍 Verificando conectividad con el servidor..."
echo ""

# Verificar conectividad básica
echo "1. Verificando ping..."
ping -c 3 ec2-54-177-248-234.us-west-1.compute.amazonaws.com 2>/dev/null && echo "✅ Ping exitoso" || echo "⚠️  Ping falló (puede ser normal si ICMP está bloqueado)"

echo ""
echo "2. Verificando conexión SSH..."
ssh -i "$PEM_FILE" -F /dev/null -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=10 "$SERVER" "echo '✅ Conexión SSH exitosa'" 2>&1

echo ""
echo "3. Verificando servicios en el servidor..."
ssh -i "$PEM_FILE" -F /dev/null -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER" "
    echo 'Node.js:' \$(node --version 2>/dev/null || echo 'No instalado')
    echo 'MySQL:' \$(mysql --version 2>/dev/null || echo 'No instalado')
    echo 'PM2:' \$(pm2 --version 2>/dev/null || echo 'No instalado')
    echo 'Nginx:' \$(nginx -v 2>&1 | head -1 || echo 'No instalado')
    echo 'PM2 procesos:' \$(pm2 list 2>/dev/null | grep -c 'inventario' || echo '0')
" 2>&1

echo ""
echo "4. Verificando aplicación desplegada..."
ssh -i "$PEM_FILE" -F /dev/null -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "$SERVER" "
    if [ -d '/var/www/inventario-ferreteria-bastidas' ]; then
        echo '✅ Directorio de aplicación existe'
        ls -la /var/www/inventario-ferreteria-bastidas/backend/server.js 2>/dev/null && echo '✅ Backend existe' || echo '❌ Backend no encontrado'
        ls -la /var/www/html/inventario/index.html 2>/dev/null && echo '✅ Frontend desplegado' || echo '❌ Frontend no desplegado'
    else
        echo '❌ Directorio de aplicación no existe'
    fi
" 2>&1

