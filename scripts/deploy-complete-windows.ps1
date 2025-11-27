# Script completo de despliegue para Windows Server
# Ejecuta TODO desde cero: clonar, instalar, construir, configurar
# Ejecutar como Administrador

$ErrorActionPreference = "Continue"

$APP_DIR = "C:\inetpub\inventario-ferreteria-bastidas"
$GIT_REPO = "https://github.com/Carlos231299/Invetario.git"
$SERVER_URL = "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com"

Write-Host "=== DESPLIEGUE COMPLETO DESDE CERO ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar/Instalar Chocolatey
Write-Host "1. Verificando Chocolatey..." -ForegroundColor Yellow
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "   Instalando Chocolatey..." -ForegroundColor Gray
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "   ✅ Chocolatey instalado" -ForegroundColor Green
}

# 2. Instalar Node.js
Write-Host "2. Verificando Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "   Instalando Node.js..." -ForegroundColor Gray
    choco install nodejs -y
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    Start-Sleep -Seconds 5
} else {
    Write-Host "   ✅ Node.js instalado: $(node --version)" -ForegroundColor Green
}

# 3. Instalar Git
Write-Host "3. Verificando Git..." -ForegroundColor Yellow
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "   Instalando Git..." -ForegroundColor Gray
    choco install git -y
} else {
    Write-Host "   ✅ Git instalado: $(git --version)" -ForegroundColor Green
}

# 4. Clonar repositorio
Write-Host "4. Clonando repositorio..." -ForegroundColor Yellow
if (Test-Path $APP_DIR) {
    Write-Host "   Eliminando directorio existente..." -ForegroundColor Gray
    Remove-Item -Path $APP_DIR -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -Path $APP_DIR -ItemType Directory -Force | Out-Null
Set-Location $APP_DIR
git clone $GIT_REPO .
if (Test-Path "$APP_DIR\backend\server.js") {
    Write-Host "   ✅ Repositorio clonado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error al clonar repositorio" -ForegroundColor Red
    exit 1
}

# 5. Configurar backend
Write-Host "5. Configurando backend..." -ForegroundColor Yellow
Set-Location "$APP_DIR\backend"
Write-Host "   Instalando dependencias..." -ForegroundColor Gray
npm install --production
Write-Host "   Configurando .env..." -ForegroundColor Gray
Copy-Item .env.example .env -ErrorAction SilentlyContinue
$content = Get-Content .env -Raw
$content = $content -replace 'FRONTEND_URL=.*', "FRONTEND_URL=$SERVER_URL"
Set-Content .env $content
Write-Host "   ✅ Backend configurado" -ForegroundColor Green

# 6. Configurar base de datos
Write-Host "6. Configurando base de datos..." -ForegroundColor Yellow
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
if (Test-Path $mysqlPath) {
    $env:Path += ";$mysqlPath"
    Write-Host "   Creando base de datos..." -ForegroundColor Gray
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;" 2>$null
    Write-Host "   Ejecutando schema..." -ForegroundColor Gray
    mysql -u root inventario_ferreteria_bastidas < src\database\schema.sql 2>$null
    Write-Host "   ✅ Base de datos configurada" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  MySQL no encontrado, saltando configuración de BD" -ForegroundColor Yellow
}

# 7. Instalar PM2
Write-Host "7. Instalando PM2..." -ForegroundColor Yellow
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    npm install -g pm2
    npm install -g pm2-windows-startup
    pm2-startup install
} else {
    Write-Host "   ✅ PM2 instalado" -ForegroundColor Green
}

# 8. Iniciar backend
Write-Host "8. Iniciando backend..." -ForegroundColor Yellow
Set-Location "$APP_DIR\backend"
pm2 delete inventario-backend -ErrorAction SilentlyContinue
pm2 start server.js --name inventario-backend
pm2 save
Write-Host "   ✅ Backend iniciado" -ForegroundColor Green

# 9. Configurar frontend
Write-Host "9. Configurando frontend..." -ForegroundColor Yellow
Set-Location "$APP_DIR\frontend"
Write-Host "   Instalando dependencias..." -ForegroundColor Gray
npm install
Write-Host "   Construyendo frontend..." -ForegroundColor Gray
$env:VITE_API_URL = "$SERVER_URL/api"
npm run build

# Verificar que se construyó
if (Test-Path "$APP_DIR\frontend\dist\index.html") {
    Write-Host "   ✅ Frontend construido correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Error: Frontend NO se construyó" -ForegroundColor Red
    Write-Host "   Revisa los errores arriba" -ForegroundColor Yellow
    exit 1
}

# 10. Configurar IIS
Write-Host "10. Configurando IIS..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction SilentlyContinue

# Eliminar sitio por defecto
$defaultSite = Get-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
if ($defaultSite) {
    Stop-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
    Remove-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
    Write-Host "   Sitio por defecto eliminado" -ForegroundColor Gray
}

# Eliminar sitio Inventario si existe
$existingSite = Get-Website -Name "Inventario" -ErrorAction SilentlyContinue
if ($existingSite) {
    Stop-Website -Name "Inventario" -ErrorAction SilentlyContinue
    Remove-Website -Name "Inventario" -ErrorAction SilentlyContinue
}

# Eliminar Application Pool
Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue

# Crear Application Pool
New-WebAppPool -Name 'Inventario'
Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''

# Crear sitio web
$distPath = "$APP_DIR\frontend\dist"
New-Website -Name 'Inventario' `
    -Port 80 `
    -PhysicalPath $distPath `
    -ApplicationPool 'Inventario'

# Crear web.config para SPA
$webConfigPath = "$distPath\web.config"
$webConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <defaultDocument>
            <files>
                <clear />
                <add value="index.html" />
            </files>
        </defaultDocument>
        <rewrite>
            <rules>
                <rule name="React Router" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
            <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
        </staticContent>
    </system.webServer>
</configuration>
"@
Set-Content -Path $webConfigPath -Value $webConfig -Encoding UTF8

# Configurar permisos
$acl = Get-Acl $distPath
$permission = "IIS_IUSRS","ReadAndExecute","ContainerInherit,ObjectInherit","None","Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $distPath $acl

# Iniciar sitio
Start-Website -Name "Inventario"

# Reiniciar IIS
iisreset

Write-Host "   ✅ IIS configurado" -ForegroundColor Green

Write-Host ""
Write-Host "=== DESPLIEGUE COMPLETADO ===" -ForegroundColor Green
Write-Host ""
Write-Host "La aplicación está disponible en:" -ForegroundColor Cyan
Write-Host "$SERVER_URL" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales por defecto:" -ForegroundColor Yellow
Write-Host "  Email: admin@ferreteria.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Verifica el sitio:" -ForegroundColor Cyan
Write-Host "Get-Website -Name 'Inventario'" -ForegroundColor Gray

