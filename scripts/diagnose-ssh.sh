#!/bin/bash

# Script de diagnóstico SSH

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PEM_FILE="$PROJECT_ROOT/plataforma2.0.pem"
SERVER="ubuntu@ec2-54-193-218-76.us-west-1.compute.amazonaws.com"
HOST="ec2-54-193-218-76.us-west-1.compute.amazonaws.com"

echo "🔍 Diagnóstico de conexión SSH..."
echo ""

# Verificar archivo PEM
if [ ! -f "$PEM_FILE" ]; then
    echo "❌ Error: No se encuentra el archivo PEM en: $PEM_FILE"
    exit 1
fi

echo "✅ Archivo PEM encontrado: $PEM_FILE"
chmod 400 "$PEM_FILE" 2>/dev/null || echo "⚠️  No se pudo cambiar permisos del PEM"

echo ""
echo "1. Verificando conectividad de red..."
timeout 5 nc -zv $HOST 22 2>&1 || echo "⚠️  Puerto 22 no accesible"

echo ""
echo "2. Intentando conexión SSH con diferentes opciones..."
echo ""

# Opción 1: Conexión básica
echo "   Intento 1: Conexión básica..."
timeout 10 ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no -o ConnectTimeout=10 -o BatchMode=yes "$SERVER" "echo 'Conexión exitosa'" 2>&1 | head -5

echo ""
echo "   Intento 2: Con verbose para ver detalles..."
timeout 10 ssh -v -i "$PEM_FILE" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$SERVER" "echo 'test'" 2>&1 | grep -E "(Connecting|Connection|timeout|refused|denied)" | head -10

echo ""
echo "3. Verificando si el host responde..."
nslookup $HOST 2>&1 | head -5

echo ""
echo "4. Verificando IP pública de tu máquina..."
curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "No se pudo obtener IP pública"

echo ""
echo "5. Sugerencias:"
echo "   - Verifica que el Security Group permita SSH (puerto 22) desde tu IP"
echo "   - Verifica que la instancia esté en estado 'running'"
echo "   - Espera 1-2 minutos después de iniciar la instancia"
echo "   - Verifica que la clave PEM sea la correcta para esta instancia"
echo "   - Intenta conectarte desde AWS Systems Manager Session Manager como alternativa"

