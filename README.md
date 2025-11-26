# Inventario Ferretería Bastidas

Sistema completo de gestión de inventario para Ferretería Bastidas, desarrollado con Node.js, Express, MySQL, React, Vite y Tailwind CSS.

## 🚀 Características

- **Gestión de Productos**: CRUD completo con control de stock
- **Categorías y Proveedores**: Organización y gestión de proveedores
- **Entradas y Salidas**: Registro detallado de movimientos de inventario
- **Bitácora de Movimientos**: Historial completo de todas las operaciones
- **Dashboard**: Métricas y estadísticas en tiempo real
- **Autenticación JWT**: Sistema seguro de autenticación
- **Roles y Permisos**: Admin y Operador con diferentes niveles de acceso
- **Recuperación de Contraseña**: Sistema de recuperación por email
- **Interfaz Moderna**: Diseño responsive con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- Git
- Cuenta de AWS (para despliegue)

## 🛠️ Instalación Local

### 1. Clonar el repositorio

```bash
git clone git@github.com:Carlos231299/Invetario.git
cd Invetario
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_ferreteria_bastidas
JWT_SECRET=tu_secreto_jwt
EMAIL_USER=cbastidas52@gmail.com
EMAIL_PASS=ujqs qsdi bcma zzqj
```

### 3. Configurar Base de Datos

```bash
mysql -u root -p < src/database/schema.sql
```

### 4. Iniciar Backend

```bash
npm start
# o para desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### 5. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 6. Iniciar Frontend

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Configuraciones (JWT, Email)
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── database/        # Conexión y esquema SQL
│   │   ├── middlewares/     # Middlewares (auth, validación, errores)
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Definición de rutas API
│   │   ├── services/        # Servicios (email, password reset)
│   │   └── utils/           # Utilidades (logger)
│   ├── server.js           # Punto de entrada
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Servicios de API
│   │   └── App.jsx         # Componente principal
│   └── package.json
├── scripts/
│   ├── push-auto.sh        # Script para push automático a GitHub
│   ├── deploy-aws.sh      # Script para despliegue en AWS
│   └── sync-all.ps1       # Script para ejecutar push y deploy
└── README.md
```

## 🔐 Credenciales por Defecto

Después de ejecutar el schema SQL, se crea un usuario administrador:

- **Email**: admin@ferreteria.com
- **Contraseña**: admin123

**⚠️ IMPORTANTE**: Cambiar estas credenciales en producción.

## 🚀 Despliegue

### Despliegue Automático

Usar el script de sincronización completa:

```powershell
.\scripts\sync-all.ps1
```

Este script:
1. Detecta cambios y hace push a GitHub
2. Se conecta al servidor AWS
3. Instala dependencias necesarias
4. Configura la base de datos
5. Despliega backend con PM2
6. Construye y despliega frontend
7. Configura Nginx como reverse proxy

### Despliegue Manual

#### 1. Push a GitHub

```bash
bash scripts/push-auto.sh
```

#### 2. Desplegar en AWS

```bash
bash scripts/deploy-aws.sh
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/forgot-password` - Solicitar recuperación
- `POST /api/auth/reset-password` - Restablecer contraseña
- `GET /api/auth/profile` - Obtener perfil

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/low-stock` - Productos con stock bajo

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (Admin)
- `PUT /api/categories/:id` - Actualizar categoría (Admin)
- `DELETE /api/categories/:id` - Eliminar categoría (Admin)

### Proveedores
- `GET /api/suppliers` - Listar proveedores
- `POST /api/suppliers` - Crear proveedor (Admin)
- `PUT /api/suppliers/:id` - Actualizar proveedor (Admin)
- `DELETE /api/suppliers/:id` - Eliminar proveedor (Admin)

### Entradas
- `GET /api/entries` - Listar entradas
- `POST /api/entries` - Registrar entrada

### Salidas
- `GET /api/exits` - Listar salidas
- `POST /api/exits` - Registrar salida

### Usuarios (Solo Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Desactivar usuario

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard

### Movimientos
- `GET /api/movements` - Historial de movimientos

## 🔧 Variables de Entorno

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=inventario_ferreteria_bastidas

JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=cbastidas52@gmail.com
EMAIL_PASS=ujqs qsdi bcma zzqj
EMAIL_FROM=cbastidas52@gmail.com

FRONTEND_URL=http://localhost:5173
```

### Frontend

Crear `.env` en la carpeta frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Desarrollo

### Backend

```bash
cd backend
npm run dev  # Modo desarrollo con watch
```

### Frontend

```bash
cd frontend
npm run dev  # Servidor de desarrollo Vite
```

## 📝 Scripts Disponibles

### Backend
- `npm start` - Iniciar servidor
- `npm run dev` - Modo desarrollo con watch

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

### Despliegue
- `bash scripts/push-auto.sh` - Push automático a GitHub
- `bash scripts/deploy-aws.sh` - Despliegue en AWS
- `.\scripts\sync-all.ps1` - Sincronización completa (Windows)

## 🐛 Solución de Problemas

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Revisar credenciales en `.env`
- Verificar que la base de datos exista

### Error de autenticación
- Verificar que el token JWT sea válido
- Revisar configuración de JWT_SECRET

### Error al enviar emails
- Verificar credenciales de Gmail
- Asegurarse de usar "Clave de aplicación" no la contraseña normal
- Verificar que el acceso de aplicaciones menos seguras esté habilitado

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para Ferretería Bastidas.

## 👥 Soporte

Para soporte, contactar al administrador del sistema.

---

**Desarrollado con ❤️ para Ferretería Bastidas**

