# Script para diagnosticar y corregir errores del despliegue
# Ejecutar en el servidor Windows como Administrador

$ErrorActionPreference = "Continue"
$APP_DIR = "C:\inetpub\inventario-ferreteria-bastidas"

Write-Host "=== DIAGNÓSTICO Y CORRECCIÓN DE ERRORES ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar estructura de directorios
Write-Host "1. Verificando estructura de directorios..." -ForegroundColor Yellow
if (-not (Test-Path $APP_DIR)) {
    Write-Host "   ❌ Directorio principal no existe" -ForegroundColor Red
    Write-Host "   Creando directorio y clonando repositorio..." -ForegroundColor Gray
    New-Item -Path $APP_DIR -ItemType Directory -Force | Out-Null
    Set-Location $APP_DIR
    git clone https://github.com/Carlos231299/Invetario.git .
} else {
    Write-Host "   ✅ Directorio existe" -ForegroundColor Green
}

# 2. Verificar backend
Write-Host "2. Verificando backend..." -ForegroundColor Yellow
$backendPath = "$APP_DIR\backend"
if (-not (Test-Path "$backendPath\server.js")) {
    Write-Host "   ❌ Backend no encontrado, clonando repositorio..." -ForegroundColor Red
    Set-Location $APP_DIR
    git pull origin main
} else {
    Write-Host "   ✅ Backend existe" -ForegroundColor Green
}

# 3. Verificar e instalar dependencias backend
Write-Host "3. Verificando dependencias del backend..." -ForegroundColor Yellow
if (-not (Test-Path "$backendPath\node_modules")) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Gray
    Set-Location $backendPath
    npm install --production
} else {
    Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
}

# 4. Verificar .env
Write-Host "4. Verificando configuración .env..." -ForegroundColor Yellow
if (-not (Test-Path "$backendPath\.env")) {
    Write-Host "   Creando .env..." -ForegroundColor Gray
    Copy-Item "$backendPath\.env.example" "$backendPath\.env" -ErrorAction SilentlyContinue
    $content = Get-Content "$backendPath\.env" -Raw
    $content = $content -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com'
    Set-Content "$backendPath\.env" $content
    Write-Host "   ✅ .env creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ .env existe" -ForegroundColor Green
}

# 5. Verificar frontend
Write-Host "5. Verificando frontend..." -ForegroundColor Yellow
$frontendPath = "$APP_DIR\frontend"
if (-not (Test-Path "$frontendPath\package.json")) {
    Write-Host "   ❌ Frontend no encontrado" -ForegroundColor Red
    Set-Location $APP_DIR
    git pull origin main
} else {
    Write-Host "   ✅ Frontend existe" -ForegroundColor Green
}

# 6. Verificar dependencias frontend
Write-Host "6. Verificando dependencias del frontend..." -ForegroundColor Yellow
if (-not (Test-Path "$frontendPath\node_modules")) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Gray
    Set-Location $frontendPath
    npm install
} else {
    Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
}

# 7. Construir frontend si no existe dist
Write-Host "7. Verificando build del frontend..." -ForegroundColor Yellow
if (-not (Test-Path "$frontendPath\dist\index.html")) {
    Write-Host "   Construyendo frontend..." -ForegroundColor Gray
    Set-Location $frontendPath
    $env:VITE_API_URL = "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com/api"
    npm run build
    if (Test-Path "$frontendPath\dist\index.html") {
        Write-Host "   ✅ Frontend construido" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al construir frontend" -ForegroundColor Red
        Write-Host "   Revisa los errores arriba" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Frontend ya está construido" -ForegroundColor Green
}

# 8. Verificar MySQL y base de datos
Write-Host "8. Verificando base de datos..." -ForegroundColor Yellow
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
if (Test-Path $mysqlPath) {
    $env:Path += ";$mysqlPath"
    $dbCheck = mysql -u root -e "SHOW DATABASES LIKE 'inventario_ferreteria_bastidas';" 2>$null
    if (-not ($dbCheck -match "inventario_ferreteria_bastidas")) {
        Write-Host "   Creando base de datos..." -ForegroundColor Gray
        mysql -u root -e "CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;" 2>$null
        Set-Location "$APP_DIR\backend"
        mysql -u root inventario_ferreteria_bastidas < src\database\schema.sql 2>$null
        Write-Host "   ✅ Base de datos creada" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Base de datos existe" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  MySQL no encontrado en ruta estándar" -ForegroundColor Yellow
}

# 9. Verificar y configurar PM2
Write-Host "9. Verificando PM2..." -ForegroundColor Yellow
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Set-Location "$APP_DIR\backend"
    $pm2Status = pm2 list 2>$null
    if (-not ($pm2Status -match "inventario-backend")) {
        Write-Host "   Iniciando backend..." -ForegroundColor Gray
        pm2 delete inventario-backend -ErrorAction SilentlyContinue
        pm2 start server.js --name inventario-backend
        pm2 save
        Write-Host "   ✅ Backend iniciado" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Backend ya está corriendo" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  PM2 no está instalado" -ForegroundColor Yellow
    Write-Host "   Instalando PM2..." -ForegroundColor Gray
    npm install -g pm2
    npm install -g pm2-windows-startup
    pm2-startup install
    Set-Location "$APP_DIR\backend"
    pm2 start server.js --name inventario-backend
    pm2 save
}

# 10. Verificar y configurar IIS
Write-Host "10. Verificando IIS..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction SilentlyContinue

$website = Get-Website -Name "Inventario" -ErrorAction SilentlyContinue
$distPath = "$APP_DIR\frontend\dist"

if (-not $website) {
    Write-Host "   Creando sitio web..." -ForegroundColor Gray
    
    # Crear Application Pool
    Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue
    New-WebAppPool -Name 'Inventario'
    Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''
    
    # Crear sitio
    New-Website -Name 'Inventario' `
        -Port 80 `
        -PhysicalPath $distPath `
        -ApplicationPool 'Inventario'
    
    Write-Host "   ✅ Sitio web creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ Sitio web existe" -ForegroundColor Green
    
    # Verificar que la ruta física sea correcta
    $currentPath = $website.physicalPath
    if ($currentPath -ne $distPath) {
        Write-Host "   Actualizando ruta física..." -ForegroundColor Gray
        Set-ItemProperty "IIS:\Sites\Inventario" -Name physicalPath -Value $distPath
        Write-Host "   ✅ Ruta actualizada" -ForegroundColor Green
    }
}

# 11. Verificar que los archivos estén en la ubicación correcta
Write-Host "11. Verificando archivos en IIS..." -ForegroundColor Yellow
if (Test-Path "$distPath\index.html") {
    Write-Host "   ✅ index.html existe en: $distPath" -ForegroundColor Green
} else {
    Write-Host "   ❌ index.html NO existe en: $distPath" -ForegroundColor Red
    Write-Host "   Verifica que el frontend se haya construido correctamente" -ForegroundColor Yellow
}

# 12. Reiniciar IIS
Write-Host "12. Reiniciando IIS..." -ForegroundColor Yellow
iisreset
Write-Host "   ✅ IIS reiniciado" -ForegroundColor Green

Write-Host ""
Write-Host "=== DIAGNÓSTICO COMPLETADO ===" -ForegroundColor Green
Write-Host ""
Write-Host "Prueba la aplicación en:" -ForegroundColor Cyan
Write-Host "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "Si aún ves error 404:" -ForegroundColor Yellow
Write-Host "1. Verifica que el Security Group permita puerto 80" -ForegroundColor White
Write-Host "2. Ejecuta: Get-Website -Name 'Inventario' | Format-List" -ForegroundColor White
Write-Host "3. Verifica los logs: pm2 logs inventario-backend" -ForegroundColor White

