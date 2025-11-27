#!/bin/bash

# Script alternativo usando AWS Systems Manager Session Manager
# Requiere: AWS CLI configurado y Session Manager plugin instalado

set -e

INSTANCE_ID="i-0751510be895709cb"
APP_DIR="/var/www/inventario-ferreteria-bastidas"
GIT_REPO="https://github.com/Carlos231299/Invetario.git"
SERVER_URL="http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com"

echo "🚀 Despliegue usando AWS Session Manager..."
echo ""

# Verificar AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    echo "Instala AWS CLI desde: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar Session Manager plugin
if ! command -v session-manager-plugin &> /dev/null; then
    echo "⚠️  Session Manager plugin no encontrado"
    echo "Instala desde: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html"
    exit 1
fi

echo "📥 Clonando y configurando aplicación..."
echo ""

# Ejecutar comandos remotos vía Session Manager
aws ssm send-command \
    --instance-ids "$INSTANCE_ID" \
    --document-name "AWS-RunShellScript" \
    --parameters "commands=[
        'sudo rm -rf $APP_DIR',
        'sudo mkdir -p $APP_DIR',
        'sudo chown ubuntu:ubuntu $APP_DIR',
        'cd $APP_DIR && git clone $GIT_REPO .',
        'cd $APP_DIR/backend && npm install --production',
        'cd $APP_DIR/backend && cp .env.example .env',
        'cd $APP_DIR/backend && sed -i \"s|FRONTEND_URL=.*|FRONTEND_URL=$SERVER_URL|\" .env',
        'sudo mysql -e \"CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;\"',
        'cd $APP_DIR/backend && sudo mysql inventario_ferreteria_bastidas < src/database/schema.sql',
        'cd $APP_DIR/backend && pm2 delete inventario-backend || true',
        'cd $APP_DIR/backend && pm2 start server.js --name inventario-backend',
        'pm2 save',
        'cd $APP_DIR/frontend && npm install',
        'cd $APP_DIR/frontend && VITE_API_URL=$SERVER_URL/api npm run build',
        'sudo rm -rf /var/www/html/inventario',
        'sudo mkdir -p /var/www/html/inventario',
        'sudo cp -r $APP_DIR/frontend/dist/* /var/www/html/inventario/',
        'sudo chown -R www-data:www-data /var/www/html/inventario'
    ]" \
    --output text \
    --query "Command.CommandId"

echo ""
echo "✅ Comandos enviados. Verifica el estado en AWS Systems Manager Console"
echo "🌍 La aplicación estará disponible en: $SERVER_URL"

