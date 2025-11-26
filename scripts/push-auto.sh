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
CURRENT_BRANCH=$(git branch --show-current)
git push origin $CURRENT_BRANCH || {
    echo "⚠️  Intentando con HTTPS..."
    git remote set-url origin https://github.com/Carlos231299/Invetario.git
    git push origin $CURRENT_BRANCH
}

echo "✅ Push completado exitosamente"

