# Script para verificar el despliegue en Windows Server
# Ejecutar DESPUÉS de deploy-on-windows-server.ps1

Write-Host "=== VERIFICACIÓN DEL DESPLIEGUE ===" -ForegroundColor Cyan
Write-Host ""

# Verificar PM2
Write-Host "1. Verificando Backend (PM2)..." -ForegroundColor Yellow
$pm2Status = pm2 list 2>$null
if ($pm2Status -match "inventario-backend") {
    Write-Host "   ✅ Backend está corriendo" -ForegroundColor Green
    pm2 show inventario-backend
} else {
    Write-Host "   ❌ Backend NO está corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd C:\inetpub\inventario-ferreteria-bastidas\backend && pm2 start server.js --name inventario-backend" -ForegroundColor Yellow
}

Write-Host ""

# Verificar IIS
Write-Host "2. Verificando IIS..." -ForegroundColor Yellow
$iisStatus = Get-Website -Name "Inventario" -ErrorAction SilentlyContinue
if ($iisStatus) {
    Write-Host "   ✅ Sitio 'Inventario' está configurado" -ForegroundColor Green
    Write-Host "   Estado: $($iisStatus.State)" -ForegroundColor Gray
    Write-Host "   Puerto: $($iisStatus.bindings.Collection[0].bindingInformation)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Sitio 'Inventario' NO está configurado" -ForegroundColor Red
}

Write-Host ""

# Verificar archivos
Write-Host "3. Verificando archivos..." -ForegroundColor Yellow
$frontendDist = "C:\inetpub\inventario-ferreteria-bastidas\frontend\dist"
if (Test-Path "$frontendDist\index.html") {
    Write-Host "   ✅ Frontend construido correctamente" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend NO está construido" -ForegroundColor Red
}

$backendServer = "C:\inetpub\inventario-ferreteria-bastidas\backend\server.js"
if (Test-Path $backendServer) {
    Write-Host "   ✅ Backend existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend NO existe" -ForegroundColor Red
}

Write-Host ""

# Verificar MySQL
Write-Host "4. Verificando MySQL..." -ForegroundColor Yellow
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
if (Test-Path $mysqlPath) {
    $env:Path += ";$mysqlPath"
    $dbExists = mysql -u root -e "SHOW DATABASES LIKE 'inventario_ferreteria_bastidas';" 2>$null
    if ($dbExists -match "inventario_ferreteria_bastidas") {
        Write-Host "   ✅ Base de datos existe" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Base de datos NO existe" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  MySQL no encontrado en la ruta esperada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== PRÓXIMOS PASOS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Configurar proxy de API en IIS (IMPORTANTE)" -ForegroundColor Yellow
Write-Host "   Ver: scripts\README-WINDOWS.md" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Verificar Security Group en AWS" -ForegroundColor Yellow
Write-Host "   - Puerto 80 (HTTP) debe estar abierto" -ForegroundColor Gray
Write-Host "   - Puerto 5000 (Backend) puede estar solo localhost" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Probar la aplicación:" -ForegroundColor Yellow
Write-Host "   http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "4. Credenciales por defecto:" -ForegroundColor Yellow
Write-Host "   Email: admin@ferreteria.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White

