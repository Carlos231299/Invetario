import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { testConnection } from './src/database/connection.js';

// Importar rutas
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import categoryRoutes from './src/routes/categories.js';
import supplierRoutes from './src/routes/suppliers.js';
import entryRoutes from './src/routes/entries.js';
import exitRoutes from './src/routes/exits.js';
import userRoutes from './src/routes/users.js';
import dashboardRoutes from './src/routes/dashboard.js';
import movementRoutes from './src/routes/movements.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// Configuración de CORS más permisiva
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir cualquier origen en producción (incluyendo IP y dominio)
    if (process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      // En desarrollo, permitir localhost y el FRONTEND_URL
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.FRONTEND_URL
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permitir todos en desarrollo
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/exits', exitRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/movements', movementRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Manejo de errores
app.use(errorHandler);

// Probar conexión a la base de datos antes de iniciar
testConnection().then(success => {
  if (!success) {
    console.error('⚠️  Advertencia: No se pudo conectar a la base de datos. El servidor se iniciará pero algunas funciones pueden no funcionar.');
  }
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_NAME || 'inventario_ferreteria_bastidas'}`);
  });
}).catch(error => {
  console.error('❌ Error al iniciar servidor:', error);
  process.exit(1);
});

