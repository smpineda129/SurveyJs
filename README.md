# SurveyJS Multi-Step Form Application

Aplicativo profesional modular con formulario multi-step utilizando SurveyJS, diseñado para escalabilidad e integración como módulo en otros sistemas.

## 🏗️ Arquitectura

```
surveyjs-app/
├── frontend/          # React + Vite + SurveyJS + Material UI + Tailwind
├── backend/           # Node.js + Express + MongoDB
├── docker-compose.yml # Orquestación de servicios
└── README.md
```

## 🚀 Tecnologías

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool
- **SurveyJS** - Motor de formularios multi-step
- **Material UI (MUI)** - Componentes UI
- **Tailwind CSS** - Utilidades CSS
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **CORS** - Manejo de políticas de origen cruzado

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación multi-contenedor

## 📦 Instalación

### 🆕 Nuevo PC / Primera Instalación

Si estás configurando el proyecto por primera vez en un nuevo equipo:

**📘 [Ver Guía Completa de Docker Setup](./DOCKER_SETUP.md)**

Esta guía incluye:
- Instalación de Docker Desktop desde cero
- Configuración paso a paso sin base de datos existente
- Verificación completa del sistema
- Solución de problemas comunes

### Opción 1: Con Docker (Recomendado)

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# MongoDB: localhost:27017
```

### Opción 2: Instalación Local

#### Prerequisitos
- Node.js >= 18.x
- MongoDB >= 6.x
- npm o yarn

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Características

### Formulario Multi-Step Base
- ✅ Navegación entre pasos (siguiente/anterior)
- ✅ Validación de campos
- ✅ Persistencia de datos en MongoDB
- ✅ Diseño responsive
- ✅ Temas personalizables
- ✅ Arquitectura modular

### Estructura del Formulario (Base Inicial)
1. **Paso 1**: Información Personal
2. **Paso 2**: Información de Contacto
3. **Paso 3**: Preferencias
4. **Paso 4**: Revisión y Confirmación

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/surveyjs_db
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📡 API Endpoints

### Surveys
- `POST /api/surveys` - Crear nueva respuesta de formulario
- `GET /api/surveys` - Obtener todas las respuestas
- `GET /api/surveys/:id` - Obtener respuesta específica
- `PUT /api/surveys/:id` - Actualizar respuesta
- `DELETE /api/surveys/:id` - Eliminar respuesta

### Survey Definitions
- `GET /api/survey-definitions` - Obtener definición del formulario
- `POST /api/survey-definitions` - Crear/actualizar definición

## 🧩 Modularización

El aplicativo está diseñado para ser integrado como módulo:

### Como Módulo Frontend
```javascript
import { SurveyComponent } from './modules/survey';

function App() {
  return <SurveyComponent onComplete={handleComplete} />;
}
```

### Como Módulo Backend
```javascript
const surveyRoutes = require('./modules/survey/routes');
app.use('/api/surveys', surveyRoutes);
```

## 🎨 Personalización

### Modificar Pasos del Formulario
Editar: `frontend/src/config/surveyConfig.js`

### Modificar Esquema de Datos
Editar: `backend/src/models/Survey.js`

### Personalizar Estilos
- Material UI Theme: `frontend/src/theme/theme.js`
- Tailwind Config: `frontend/tailwind.config.js`

## 📊 Modelo de Datos

```javascript
{
  surveyData: Object,      // Datos del formulario
  completedAt: Date,       // Fecha de completado
  status: String,          // 'draft' | 'completed'
  metadata: {
    userAgent: String,
    ipAddress: String
  }
}
```

## 🔐 Seguridad

- Validación de datos en frontend y backend
- Sanitización de inputs
- CORS configurado
- Variables de entorno para datos sensibles

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Escalabilidad

### Próximas Mejoras Sugeridas
- [ ] Autenticación y autorización
- [ ] Formularios dinámicos desde base de datos
- [ ] Exportación de datos (CSV, PDF)
- [ ] Analytics y reportes
- [ ] Versionado de formularios
- [ ] Multi-idioma (i18n)
- [ ] Validaciones personalizadas avanzadas
- [ ] Integración con servicios externos
- [ ] Cache con Redis
- [ ] Tests unitarios y e2e

## 🤝 Contribución

Este proyecto está diseñado para ser extendido. Para agregar nuevos campos o pasos:

1. Actualizar `surveyConfig.js` con nuevos elementos
2. Actualizar modelo de datos en backend si es necesario
3. Ejecutar migraciones si aplica

## 📝 Licencia

MIT

## 📚 Documentación

- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido en 5 minutos
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Configuración completa de Docker desde cero
- **[SETUP.md](./SETUP.md)** - Instalación detallada y configuración
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema
- **[MODULARIZATION.md](./MODULARIZATION.md)** - Guía de integración como módulo
- **[SURVEYJS_INPUTS_REFERENCE.md](./SURVEYJS_INPUTS_REFERENCE.md)** - Referencia de tipos de inputs

## 👥 Soporte

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 2025  
**Estado**: Base inicial para desarrollo
