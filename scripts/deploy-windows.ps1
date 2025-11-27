# Script de despliegue para Windows Server
# Usa WinRM para conectarse y ejecutar comandos

$ErrorActionPreference = "Stop"

$SERVER = "ec2-54-193-89-101.us-west-1.compute.amazonaws.com"
$USERNAME = "Administrator"
$PASSWORD = "jz@G%L-hgGD@BdO@!4sz&ahDryYALgpH"
$APP_DIR = "C:\inetpub\inventario-ferreteria-bastidas"
$GIT_REPO = "https://github.com/Carlos231299/Invetario.git"
$SERVER_URL = "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com"

Write-Host "🚀 Despliegue en Windows Server iniciado..." -ForegroundColor Cyan
Write-Host ""

# Función para ejecutar comandos remotos vía WinRM
function Invoke-RemoteCommand {
    param([string]$Command)
    
    $securePassword = ConvertTo-SecureString $PASSWORD -AsPlainText -Force
    $credential = New-Object System.Management.Automation.PSCredential($USERNAME, $securePassword)
    
    try {
        $session = New-PSSession -ComputerName $SERVER -Credential $credential -ErrorAction Stop
        $result = Invoke-Command -Session $session -ScriptBlock { Invoke-Expression $using:Command }
        Remove-PSSession $session
        return $result
    } catch {
        Write-Host "❌ Error ejecutando comando: $_" -ForegroundColor Red
        throw
    }
}

Write-Host "📥 Verificando Git..." -ForegroundColor Yellow
$gitCheck = Invoke-RemoteCommand "if (Get-Command git -ErrorAction SilentlyContinue) { Write-Host 'Git instalado' } else { Write-Host 'Instalando Git...'; choco install git -y }"

Write-Host "📥 Clonando repositorio..." -ForegroundColor Yellow
Invoke-RemoteCommand @"
Remove-Item -Path '$APP_DIR' -Recurse -Force -ErrorAction SilentlyContinue
New-Item -Path '$APP_DIR' -ItemType Directory -Force | Out-Null
Set-Location '$APP_DIR'
git clone $GIT_REPO .
"@

Write-Host "🔧 Configurando backend..." -ForegroundColor Yellow

# Verificar Node.js
Write-Host "  - Verificando Node.js..." -ForegroundColor Gray
Invoke-RemoteCommand @"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host 'Instalando Node.js...'
    choco install nodejs -y
}
"@

# Instalar dependencias backend
Write-Host "  - Instalando dependencias del backend..." -ForegroundColor Gray
Invoke-RemoteCommand @"
Set-Location '$APP_DIR\backend'
npm install --production
Copy-Item .env.example .env -ErrorAction SilentlyContinue
`$content = Get-Content .env -Raw
`$content = `$content -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=$SERVER_URL'
Set-Content .env `$content
"@

# Configurar MySQL
Write-Host "  - Configurando base de datos..." -ForegroundColor Gray
Invoke-RemoteCommand @"
if (-not (Get-Service -Name MySQL* -ErrorAction SilentlyContinue)) {
    Write-Host 'Instalando MySQL...'
    choco install mysql -y
    Start-Sleep -Seconds 30
}
`$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
mysql -u root -e 'CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;'
Set-Location '$APP_DIR\backend'
mysql -u root inventario_ferreteria_bastidas < src\database\schema.sql
"@

# Configurar PM2
Write-Host "  - Configurando PM2..." -ForegroundColor Gray
Invoke-RemoteCommand @"
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    npm install -g pm2
    npm install -g pm2-windows-startup
    pm2-startup install
}
Set-Location '$APP_DIR\backend'
pm2 delete inventario-backend -ErrorAction SilentlyContinue
pm2 start server.js --name inventario-backend
pm2 save
"@

Write-Host "🏗️  Construyendo frontend..." -ForegroundColor Yellow

# Instalar dependencias frontend
Write-Host "  - Instalando dependencias del frontend..." -ForegroundColor Gray
Invoke-RemoteCommand @"
Set-Location '$APP_DIR\frontend'
npm install
"@

# Build frontend
Write-Host "  - Construyendo frontend..." -ForegroundColor Gray
Invoke-RemoteCommand @"
Set-Location '$APP_DIR\frontend'
`$env:VITE_API_URL = '$SERVER_URL/api'
npm run build
"@

# Configurar IIS
Write-Host "🌐 Configurando IIS..." -ForegroundColor Yellow

Invoke-RemoteCommand @"
# Instalar IIS si no está instalado
if (-not (Get-WindowsFeature -Name Web-Server).Installed) {
    Install-WindowsFeature -Name Web-Server -IncludeManagementTools
    Install-WindowsFeature -Name Web-Application-Proxy
}

# Crear sitio web
Import-Module WebAdministration
Remove-Website -Name 'Inventario' -ErrorAction SilentlyContinue
Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue

New-WebAppPool -Name 'Inventario'
Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''

New-Website -Name 'Inventario' `
    -Port 80 `
    -PhysicalPath '$APP_DIR\frontend\dist' `
    -ApplicationPool 'Inventario'

# Configurar proxy para API
New-WebApplication -Site 'Inventario' `
    -Name 'api' `
    -PhysicalPath '$APP_DIR\frontend\dist' `
    -ApplicationPool 'Inventario'

# Instalar URL Rewrite y ARR si no están instalados
# Nota: Requiere descarga manual o instalación previa
"@

Write-Host "✅ Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host "🌍 La aplicación está disponible en: $SERVER_URL" -ForegroundColor Cyan
Write-Host "📧 Credenciales por defecto:" -ForegroundColor Yellow
Write-Host "   Email: admin@ferreteria.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White

