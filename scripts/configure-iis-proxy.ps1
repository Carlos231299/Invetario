# Script para configurar el proxy de API en IIS
# REQUIERE: URL Rewrite Module y Application Request Routing instalados
# Ejecutar en el servidor Windows como Administrador

Write-Host "=== CONFIGURACIÓN DE PROXY PARA API ===" -ForegroundColor Cyan
Write-Host ""

# Verificar módulos instalados
Write-Host "Verificando módulos de IIS..." -ForegroundColor Yellow

$modules = Get-WebGlobalModule
$urlRewrite = $modules | Where-Object { $_.Name -eq "RewriteModule" }
$arr = $modules | Where-Object { $_.Name -eq "ApplicationRequestRouting" }

if (-not $urlRewrite) {
    Write-Host "❌ URL Rewrite Module NO está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Descarga e instala desde:" -ForegroundColor Yellow
    Write-Host "https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor White
    Write-Host ""
    Write-Host "Luego ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ URL Rewrite Module instalado" -ForegroundColor Green
}

if (-not $arr) {
    Write-Host "❌ Application Request Routing NO está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Descarga e instala desde:" -ForegroundColor Yellow
    Write-Host "https://www.iis.net/downloads/microsoft/application-request-routing" -ForegroundColor White
    Write-Host ""
    Write-Host "Luego ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Application Request Routing instalado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configurando proxy..." -ForegroundColor Yellow

# Habilitar proxy en ARR
Set-WebConfigurationProperty -PSPath 'MACHINE/WEBROOT/APPHOST' -Filter "system.webServer/proxy" -Name "enabled" -Value "True"

# Crear regla de rewrite para /api
$webConfigPath = "C:\inetpub\inventario-ferreteria-bastidas\frontend\dist\web.config"

$webConfig = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="API Proxy" stopProcessing="true">
                    <match url="^api/(.*)" />
                    <action type="Rewrite" url="http://localhost:5000/api/{R:1}" />
                </rule>
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
    </system.webServer>
</configuration>
"@

Set-Content -Path $webConfigPath -Value $webConfig -Encoding UTF8

Write-Host "✅ Proxy configurado" -ForegroundColor Green
Write-Host ""
Write-Host "Reiniciando IIS..." -ForegroundColor Yellow
iisreset

Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "La aplicación debería estar funcionando en:" -ForegroundColor Cyan
Write-Host "http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com" -ForegroundColor White

