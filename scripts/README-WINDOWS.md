# Despliegue en Windows Server

## Información del Servidor

- **Servidor:** ec2-54-193-89-101.us-west-1.compute.amazonaws.com
- **Usuario:** Administrator
- **Contraseña:** jz@G%L-hgGD@BdO@!4sz&ahDryYALgpH
- **Sistema Operativo:** Windows Server 2025

## Opción 1: Conexión RDP (Recomendado)

### Paso 1: Conectarse por Remote Desktop

Ejecuta el script para abrir la conexión RDP:

```powershell
.\scripts\connect-rdp.ps1
```

O manualmente:
1. Abre "Conexión a Escritorio remoto" (mstsc.exe)
2. Servidor: `ec2-54-193-89-101.us-west-1.compute.amazonaws.com`
3. Usuario: `Administrator`
4. Contraseña: `jz@G%L-hgGD@BdO@!4sz&ahDryYALgpH`

### Paso 2: Desplegar la aplicación

Una vez conectado, abre PowerShell como Administrador y ejecuta los comandos del archivo:

```powershell
.\scripts\deploy-windows-simple.ps1
```

Este script mostrará todos los comandos que debes ejecutar en el servidor.

## Opción 2: Despliegue Automático (Requiere WinRM)

Si WinRM está configurado en el servidor:

```powershell
.\scripts\deploy-windows.ps1
```

**Nota:** WinRM puede requerir configuración adicional en el Security Group (puerto 5985/5986).

## Comandos Manuales (Copiar y Pegar)

Si prefieres ejecutar manualmente, aquí están los comandos:

```powershell
# 1. Instalar Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Instalar dependencias
choco install nodejs git mysql -y

# 3. Instalar PM2
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install

# 4. Clonar repositorio
cd C:\inetpub
git clone https://github.com/Carlos231299/Invetario.git inventario-ferreteria-bastidas
cd inventario-ferreteria-bastidas

# 5. Configurar backend
cd backend
npm install --production
Copy-Item .env.example .env
$content = Get-Content .env -Raw
$content = $content -replace 'FRONTEND_URL=.*', 'FRONTEND_URL=http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com'
Set-Content .env $content

# 6. Configurar base de datos
$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
mysql -u root -e 'CREATE DATABASE IF NOT EXISTS inventario_ferreteria_bastidas;'
mysql -u root inventario_ferreteria_bastidas < src\database\schema.sql

# 7. Iniciar backend
pm2 delete inventario-backend -ErrorAction SilentlyContinue
pm2 start server.js --name inventario-backend
pm2 save

# 8. Configurar frontend
cd ..\frontend
npm install
$env:VITE_API_URL = 'http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com/api'
npm run build

# 9. Configurar IIS
Import-Module WebAdministration
Remove-Website -Name 'Inventario' -ErrorAction SilentlyContinue
Remove-WebAppPool -Name 'Inventario' -ErrorAction SilentlyContinue

New-WebAppPool -Name 'Inventario'
Set-ItemProperty IIS:\AppPools\Inventario -Name managedRuntimeVersion -Value ''

New-Website -Name 'Inventario' `
    -Port 80 `
    -PhysicalPath 'C:\inetpub\inventario-ferreteria-bastidas\frontend\dist' `
    -ApplicationPool 'Inventario'
```

## Configurar Proxy para API

Para que las peticiones `/api` funcionen, necesitas:

1. **Instalar URL Rewrite Module:**
   - Descargar desde: https://www.iis.net/downloads/microsoft/url-rewrite
   - Instalar en el servidor

2. **Instalar Application Request Routing (ARR):**
   - Descargar desde: https://www.iis.net/downloads/microsoft/application-request-routing
   - Instalar en el servidor

3. **Crear regla de rewrite:**
   - Abre IIS Manager
   - Selecciona el sitio "Inventario"
   - Abre "URL Rewrite"
   - Agrega regla: `/api/*` → `http://localhost:5000/api/{R:1}`

## Verificar Despliegue

Una vez completado, la aplicación estará disponible en:
- **URL:** http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com
- **Credenciales por defecto:**
  - Email: admin@ferreteria.com
  - Password: admin123

## Troubleshooting

### PM2 no inicia al reiniciar
```powershell
pm2-startup install
pm2 save
```

### MySQL no se encuentra
```powershell
$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
```

### IIS no muestra el sitio
- Verifica que el puerto 80 esté abierto en el Security Group
- Verifica que IIS esté ejecutándose: `Get-Service W3SVC`

