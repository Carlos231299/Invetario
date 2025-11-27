#!/bin/bash
# Script para configurar MySQL para permitir acceso sin contraseña

ssh_exec() {
    ssh -i "$PEM_FILE" \
        -F /dev/null \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ConnectTimeout=30 \
        "$SERVER" "$1"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

echo "🔧 Configurando MySQL..."

# Crear usuario MySQL para la aplicación o configurar root
ssh_exec "sudo mysql -e \"
CREATE USER IF NOT EXISTS 'inventario'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON inventario_ferreteria_bastidas.* TO 'inventario'@'localhost';
FLUSH PRIVILEGES;
\" 2>/dev/null || echo 'Usuario ya existe'"

echo "✅ MySQL configurado correctamente"

