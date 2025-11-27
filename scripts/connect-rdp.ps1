# Script para conectarse por Remote Desktop a Windows Server

$SERVER = "ec2-54-193-89-101.us-west-1.compute.amazonaws.com"
$USERNAME = "Administrator"
$PASSWORD = "jz@G%L-hgGD@BdO@!4sz&ahDryYALgpH"

Write-Host "Conectando a Windows Server por RDP..." -ForegroundColor Cyan
Write-Host "Servidor: $SERVER" -ForegroundColor White
Write-Host "Usuario: $USERNAME" -ForegroundColor White
Write-Host ""

# Crear archivo RDP temporal
$rdpFile = "$env:TEMP\aws-server.rdp"
@"
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
winposstr:s:0,1,0,0,1920,1080
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:0
allow desktop composition:i:0
disable full window drag:i:1
disable menu anims:i:1
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
full address:s:$SERVER
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:
username:s:$USERNAME
"@ | Out-File -FilePath $rdpFile -Encoding ASCII

Write-Host "Archivo RDP creado en: $rdpFile" -ForegroundColor Green
Write-Host "Abriendo conexión RDP..." -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTA: Cuando se abra la ventana de RDP, ingresa la contraseña:" -ForegroundColor Yellow
Write-Host "$PASSWORD" -ForegroundColor White
Write-Host ""

Start-Process mstsc.exe -ArgumentList $rdpFile

