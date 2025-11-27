# Script para mostrar información de diagnóstico
# Ejecutar en el servidor Windows

Write-Host "=== INFORMACIÓN DE DIAGNÓSTICO ===" -ForegroundColor Cyan
Write-Host ""

# Estado de PM2
Write-Host "1. Estado de PM2:" -ForegroundColor Yellow
pm2 list 2>$null
Write-Host ""

# Logs de PM2 (últimas 20 líneas)
Write-Host "2. Últimos logs del backend:" -ForegroundColor Yellow
pm2 logs inventario-backend --lines 20 --nostream 2>$null
Write-Host ""

# Estado de IIS
Write-Host "3. Estado de IIS:" -ForegroundColor Yellow
Get-Website -Name "Inventario" | Format-List
Write-Host ""

# Archivos en dist
Write-Host "4. Archivos en frontend/dist:" -ForegroundColor Yellow
$distPath = "C:\inetpub\inventario-ferreteria-bastidas\frontend\dist"
if (Test-Path $distPath) {
    Get-ChildItem $distPath | Select-Object Name, Length | Format-Table
} else {
    Write-Host "   ❌ Directorio dist no existe" -ForegroundColor Red
}
Write-Host ""

# Puerto 5000
Write-Host "5. Verificando puerto 5000 (backend):" -ForegroundColor Yellow
$port5000 = netstat -ano | findstr :5000
if ($port5000) {
    Write-Host "   ✅ Puerto 5000 en uso:" -ForegroundColor Green
    Write-Host $port5000
} else {
    Write-Host "   ❌ Puerto 5000 NO está en uso (backend no está corriendo)" -ForegroundColor Red
}
Write-Host ""

# Puerto 80
Write-Host "6. Verificando puerto 80 (IIS):" -ForegroundColor Yellow
$port80 = netstat -ano | findstr :80
if ($port80) {
    Write-Host "   ✅ Puerto 80 en uso:" -ForegroundColor Green
    Write-Host $port80
} else {
    Write-Host "   ❌ Puerto 80 NO está en uso" -ForegroundColor Red
}
Write-Host ""

# Servicios
Write-Host "7. Servicios relacionados:" -ForegroundColor Yellow
Get-Service W3SVC, MySQL* | Format-Table Name, Status, DisplayName
Write-Host ""

Write-Host "=== FIN DEL DIAGNÓSTICO ===" -ForegroundColor Cyan

