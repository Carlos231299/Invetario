# Script simplificado de despliegue para Windows Server
# Usa RDP/Remote Desktop para ejecutar comandos manualmente

$SERVER = "ec2-54-193-89-101.us-west-1.compute.amazonaws.com"
$USERNAME = "Administrator"
$PASSWORD = "jz@G%L-hgGD@BdO@!4sz&ahDryYALgpH"
$APP_DIR = "C:\inetpub\inventario-ferreteria-bastidas"
$GIT_REPO = "https://github.com/Carlos231299/Invetario.git"
$SERVER_URL = "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com"

Write-Host "=== INSTRUCCIONES DE DESPLIEGUE EN WINDOWS SERVER ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Conéctate por Remote Desktop a:" -ForegroundColor Yellow
Write-Host "   $SERVER" -ForegroundColor White
Write-Host "   Usuario: $USERNAME" -ForegroundColor White
Write-Host "   Contraseña: $PASSWORD" -ForegroundColor White
Write-Host ""

Write-Host "2. Abre PowerShell como Administrador y ejecuta:" -ForegroundColor Yellow
Write-Host ""

$commands = @"
# Instalar Chocolatey (si no está instalado)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Node.js
choco install nodejs -y

# Instalar Git
choco install git -y

# Instalar MySQL
choco install mysql -y

# Instalar PM2 globalmente
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install

# Clonar repositorio
cd C:\inetpub
Remove-Item -Path inventario-ferreteria-bastidas -Recurse -Force -ErrorAction SilentlyContinue
git clone $GIT_REPO inventario-ferreteria-bastidas
cd inventario-ferreteria-bastidas

# Configurar backend
cd backend
npm install --production
Copy-Item .env.example .env
`$content = Get-Content .env -Raw
`$content = `$content -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=$SERVER_URL'
Set-Content .env `$content

# Configurar base de datos
`$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
mysql -u root -e 'CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;'
mysql -u root inventario_ferreteria_bastidas < src\database\schema.sql

# Iniciar backend con PM2
pm2 delete inventario-backend -ErrorAction SilentlyContinue
pm2 start server.js --name inventario-backend
pm2 save

# Configurar frontend
cd ..\frontend
npm install
`$env:VITE_API_URL = '$SERVER_URL/api'
npm run build

# Configurar IIS
Import-Module WebAdministration
Remove-Website -Name 'Inventario' -ErrorAction SilentlyContinue
Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue

New-WebAppPool -Name 'Inventario'
Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''

New-Website -Name 'Inventario' -Port 80 -PhysicalPath 'C:\inetpub\inventario-ferreteria-bastidas\frontend\dist' -ApplicationPool 'Inventario'

# Configurar proxy para API (requiere URL Rewrite y ARR)
# Descargar e instalar desde:
# https://www.iis.net/downloads/microsoft/url-rewrite
# https://www.iis.net/downloads/microsoft/application-request-routing
"@

Write-Host $commands -ForegroundColor Gray
Write-Host ""

Write-Host "3. Para configurar el proxy de API en IIS:" -ForegroundColor Yellow
Write-Host "   - Instala URL Rewrite Module" -ForegroundColor White
Write-Host "   - Instala Application Request Routing (ARR)" -ForegroundColor White
Write-Host "   - Crea regla de rewrite para /api -> http://localhost:5000/api" -ForegroundColor White
Write-Host ""

Write-Host "✅ Una vez completado, la aplicación estará en: $SERVER_URL" -ForegroundColor Green

