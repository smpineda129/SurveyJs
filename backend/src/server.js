import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import surveyRoutes from './routes/survey.routes.js';
import surveyDefinitionRoutes from './routes/surveyDefinition.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';
import User from './models/User.js';
import pinarRoutes from "./routes/pinar.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB y sembrar usuario admin si no existe
// redeploy
connectDB().then(async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create({
        email: 'admin@gdi.co',
        password: 'Admin123!',
        name: 'Administrador GDI',
        role: 'admin',
      });
      console.log('👤 Usuario admin creado: admin@gdi.co / Admin123!');
    }
  } catch (err) {
    console.error('Error al sembrar usuario admin:', err.message);
  }
});

// Middleware
app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(morgan('dev'));

// Límite subido de 100kb (default) a 4mb para soportar el registro fotográfico
// (fotos comprimidas en base64 dentro del surveyData). Ver también el límite
// duro de 4.5mb de Vercel Functions, que no se puede aumentar desde aquí.
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GDI Instrumentos API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/pinar", pinarRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/survey-definitions', surveyDefinitionRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

export default app;