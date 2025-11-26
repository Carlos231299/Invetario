#!/bin/bash

# Script para hacer push automático a GitHub
# Detecta cambios, crea commit con fecha/hora y hace push

set -e

echo "🔍 Verificando cambios en el repositorio..."

# Verificar si hay cambios
if git diff-index --quiet HEAD --; then
    echo "ℹ️  No hay cambios para commitear"
    exit 0
fi

# Agregar todos los cambios
echo "📦 Agregando cambios..."
git add .

# Crear commit con fecha y hora
COMMIT_MESSAGE="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
echo "💾 Creando commit: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

# Hacer push al remoto
echo "🚀 Haciendo push a GitHub..."
git push origin main || git push origin master

echo "✅ Push completado exitosamente"

