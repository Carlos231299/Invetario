# Script PowerShell para ejecutar push y deploy
# Ejecuta push-auto.sh y luego deploy-aws.sh

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando sincronización completa..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Git Bash está disponible
$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
if (-not (Test-Path $gitBashPath)) {
    $gitBashPath = "C:\Program Files (x86)\Git\bin\bash.exe"
    if (-not (Test-Path $gitBashPath)) {
        Write-Host "❌ Error: Git Bash no encontrado" -ForegroundColor Red
        Write-Host "Por favor instala Git for Windows" -ForegroundColor Yellow
        exit 1
    }
}

# Obtener el directorio del script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Cambiar al directorio del proyecto
Set-Location $projectRoot

Write-Host "📤 Paso 1: Subiendo cambios a GitHub..." -ForegroundColor Yellow
Write-Host ""

try {
    $pushScript = Join-Path $scriptDir "push-auto.sh"
    & $gitBashPath $pushScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error en push-auto.sh"
    }
    
    Write-Host "✅ Push a GitHub completado" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al hacer push a GitHub: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Paso 2: Desplegando en AWS..." -ForegroundColor Yellow
Write-Host ""

try {
    $deployScript = Join-Path $scriptDir "deploy-aws.sh"
    & $gitBashPath $deployScript
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error en deploy-aws.sh"
    }
    
    Write-Host "✅ Despliegue en AWS completado" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al desplegar en AWS: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Sincronización completa exitosa!" -ForegroundColor Green
Write-Host ""
Write-Host "La aplicación está disponible en:" -ForegroundColor Cyan
Write-Host "http://ec2-54-177-248-234.us-west-1.compute.amazonaws.com" -ForegroundColor White

