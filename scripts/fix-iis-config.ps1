# Script para corregir la configuración de IIS
# Ejecutar en el servidor Windows como Administrador

$ErrorActionPreference = "Continue"
$APP_DIR = "C:\inetpub\inventario-ferreteria-bastidas"
$DIST_PATH = "$APP_DIR\frontend\dist"

Write-Host "=== CORRIGIENDO CONFIGURACIÓN DE IIS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que el frontend esté construido
Write-Host "1. Verificando frontend construido..." -ForegroundColor Yellow
if (-not (Test-Path "$DIST_PATH\index.html")) {
    Write-Host "   ❌ Frontend no está construido. Construyendo..." -ForegroundColor Red
    Set-Location "$APP_DIR\frontend"
    
    # Verificar dependencias
    if (-not (Test-Path "node_modules")) {
        Write-Host "   Instalando dependencias..." -ForegroundColor Gray
        npm install
    }
    
    # Construir
    $env:VITE_API_URL = "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com/api"
    npm run build
    
    if (Test-Path "$DIST_PATH\index.html") {
        Write-Host "   ✅ Frontend construido correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al construir frontend" -ForegroundColor Red
        Write-Host "   Revisa los errores arriba" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ✅ Frontend ya está construido" -ForegroundColor Green
}

# Importar módulo IIS
Write-Host "2. Configurando IIS..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction SilentlyContinue

# Eliminar sitio por defecto si existe
Write-Host "   Eliminando sitio por defecto..." -ForegroundColor Gray
$defaultSite = Get-Website -Name "Default Web Site" -ErrorAction SilentlyContinue
if ($defaultSite) {
    Stop-Website -Name "Default Web Site"
    Remove-Website -Name "Default Web Site"
    Write-Host "   ✅ Sitio por defecto eliminado" -ForegroundColor Green
}

# Eliminar sitio Inventario existente si hay problemas
Write-Host "   Configurando sitio Inventario..." -ForegroundColor Gray
$existingSite = Get-Website -Name "Inventario" -ErrorAction SilentlyContinue
if ($existingSite) {
    Stop-Website -Name "Inventario"
    Remove-Website -Name "Inventario"
}

# Eliminar Application Pool existente
Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue

# Crear nuevo Application Pool
Write-Host "   Creando Application Pool..." -ForegroundColor Gray
New-WebAppPool -Name 'Inventario'
Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''

# Crear sitio web apuntando al directorio correcto
Write-Host "   Creando sitio web..." -ForegroundColor Gray
New-Website -Name 'Inventario' `
    -Port 80 `
    -PhysicalPath $DIST_PATH `
    -ApplicationPool 'Inventario'

# Verificar que el sitio se creó correctamente
$newSite = Get-Website -Name "Inventario" -ErrorAction SilentlyContinue
if ($newSite) {
    Write-Host "   ✅ Sitio web creado correctamente" -ForegroundColor Green
    Write-Host "   Ruta física: $($newSite.physicalPath)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Error al crear sitio web" -ForegroundColor Red
    exit 1
}

# Verificar permisos
Write-Host "3. Verificando permisos..." -ForegroundColor Yellow
$acl = Get-Acl $DIST_PATH
$permission = "IIS_IUSRS","ReadAndExecute","ContainerInherit,ObjectInherit","None","Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $DIST_PATH $acl
Write-Host "   ✅ Permisos configurados" -ForegroundColor Green

# Crear web.config para SPA routing
Write-Host "4. Creando web.config para routing..." -ForegroundColor Yellow
$webConfigPath = "$DIST_PATH\web.config"
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
Write-Host "   ✅ web.config creado" -ForegroundColor Green

# Iniciar sitio
Write-Host "5. Iniciando sitio web..." -ForegroundColor Yellow
Start-Website -Name "Inventario"
Write-Host "   ✅ Sitio web iniciado" -ForegroundColor Green

# Reiniciar IIS
Write-Host "6. Reiniciando IIS..." -ForegroundColor Yellow
iisreset
Write-Host "   ✅ IIS reiniciado" -ForegroundColor Green

Write-Host ""
Write-Host "=== CONFIGURACIÓN COMPLETADA ===" -ForegroundColor Green
Write-Host ""
Write-Host "Verifica el sitio:" -ForegroundColor Cyan
Write-Host "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "Si aún ves la página de IIS:" -ForegroundColor Yellow
Write-Host "1. Espera 10-15 segundos y recarga la página" -ForegroundColor White
Write-Host "2. Verifica: Get-Website -Name 'Inventario'" -ForegroundColor White
Write-Host "3. Verifica que index.html exista en: $DIST_PATH" -ForegroundColor White

