# Script para limpiar completamente el servidor
# Uso: .\scripts\cleanup-server.ps1

Write-Host "Iniciando limpieza del servidor..." -ForegroundColor Yellow

# Configuracion
$PEM_KEY = "C:\Users\CARLO\Escritorio\plataforma.prueba\plataforma2.0.pem"
$EC2_HOST = "ubuntu@ec2-54-241-187-151.us-west-1.compute.amazonaws.com"
$REMOTE_DIR = "/var/www/inventarioctc"

Write-Host "Deteniendo servicios..." -ForegroundColor Cyan
$cleanupCommands = @"
# Detener PM2
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Deshabilitar PM2 del startup
pm2 unstartup systemd 2>/dev/null || true

# Detener y deshabilitar nginx
sudo systemctl stop nginx 2>/dev/null || true
sudo systemctl disable nginx 2>/dev/null || true

# Eliminar configuracion de nginx
sudo rm -f /etc/nginx/sites-enabled/inventarioctc
sudo rm -f /etc/nginx/sites-available/inventarioctc

# Eliminar directorio de la aplicacion
sudo rm -rf $REMOTE_DIR

# Eliminar node_modules globales si es necesario (opcional)
# sudo npm uninstall -g pm2

echo "Limpieza completada"
"@

ssh -i $PEM_KEY $EC2_HOST $cleanupCommands

Write-Host "`nLimpieza del servidor completada!" -ForegroundColor Green

