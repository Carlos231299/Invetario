# Pasos Después del Despliegue

## ✅ Una vez que termine `deploy-on-windows-server.ps1`

### 1. Verificar el Despliegue

Ejecuta en el servidor Windows:

```powershell
.\verify-deployment.ps1
```

O manualmente verifica:

```powershell
# Verificar PM2
pm2 list

# Verificar IIS
Get-Website -Name "Inventario"

# Verificar archivos
Test-Path "C:\inetpub\inventario-ferreteria-bastidas\frontend\dist\index.html"
```

### 2. Configurar Proxy de API en IIS (IMPORTANTE)

**Sin esto, las peticiones `/api` NO funcionarán.**

#### Opción A: Instalar módulos y usar script automático

1. **Instalar URL Rewrite Module:**
   - Descargar: https://www.iis.net/downloads/microsoft/url-rewrite
   - Instalar en el servidor

2. **Instalar Application Request Routing (ARR):**
   - Descargar: https://www.iis.net/downloads/microsoft/application-request-routing
   - Instalar en el servidor

3. **Ejecutar script de configuración:**
   ```powershell
   .\configure-iis-proxy.ps1
   ```

#### Opción B: Configuración manual en IIS Manager

1. Abre **IIS Manager**
2. Selecciona el sitio **"Inventario"**
3. Abre **"URL Rewrite"**
4. Haz clic en **"Add Rule"** → **"Reverse Proxy"**
5. Configura:
   - **Inbound rule:** `^api/(.*)`
   - **Rewrite URL:** `http://localhost:5000/api/{R:1}`
6. Guarda y reinicia IIS

### 3. Verificar Security Group en AWS

Asegúrate de que el Security Group permita:

- **Puerto 80 (HTTP)** - Entrada desde `0.0.0.0/0` o tu IP
- **Puerto 443 (HTTPS)** - Opcional, si usas SSL
- **Puerto 5000** - Solo localhost (no necesita estar abierto externamente)

### 4. Probar la Aplicación

Abre en tu navegador:

```
http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com
```

**Credenciales por defecto:**
- Email: `admin@ferreteria.com`
- Password: `admin123`

### 5. Verificar que Todo Funcione

#### Backend funcionando:
```powershell
pm2 logs inventario-backend
```

#### Frontend accesible:
- Debe mostrar la página de login

#### API funcionando:
- Abre: `http://ec2-54-193-89-101.us-west-1.compute.amazonaws.com/api/health`
- Debe responder: `{"status":"OK","message":"Servidor funcionando correctamente"}`

### 6. Troubleshooting

#### Si el backend no inicia:
```powershell
cd C:\inetpub\inventario-ferreteria-bastidas\backend
pm2 delete inventario-backend
pm2 start server.js --name inventario-backend
pm2 logs inventario-backend
```

#### Si IIS no muestra el sitio:
```powershell
# Verificar que IIS esté corriendo
Get-Service W3SVC

# Reiniciar IIS
iisreset

# Verificar sitio
Get-Website -Name "Inventario"
```

#### Si /api no funciona:
- Verifica que URL Rewrite y ARR estén instalados
- Verifica la regla de rewrite en IIS Manager
- Verifica que el backend esté corriendo en puerto 5000

#### Si MySQL no funciona:
```powershell
# Verificar servicio
Get-Service MySQL*

# Agregar MySQL al PATH
$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
```

### 7. Comandos Útiles

```powershell
# Ver logs del backend
pm2 logs inventario-backend

# Reiniciar backend
pm2 restart inventario-backend

# Ver estado de PM2
pm2 status

# Ver sitios IIS
Get-Website

# Reiniciar IIS
iisreset

# Ver puertos en uso
netstat -ano | findstr :5000
netstat -ano | findstr :80
```

## ✅ Checklist Final

- [ ] Backend corriendo con PM2
- [ ] Frontend construido y en IIS
- [ ] Base de datos creada y con datos
- [ ] Proxy de API configurado en IIS
- [ ] Security Group permite puerto 80
- [ ] Aplicación accesible desde navegador
- [ ] Login funciona correctamente
- [ ] API responde en `/api/health`

