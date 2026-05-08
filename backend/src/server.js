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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/surveys', surveyRoutes);
app.use('/api/survey-definitions', surveyDefinitionRoutes);
app.use("/api/pinar", pinarRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});

export default app;
