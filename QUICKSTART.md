# 🚀 Inicio Rápido

Guía rápida para poner en marcha el aplicativo en menos de 5 minutos.

## ⚡ Opción 1: Docker (Más Rápido)

### Prerequisitos
- Docker Desktop instalado y corriendo

### Pasos

```bash
# 1. Navegar al proyecto
cd /Users/mac/CascadeProjects/Surveyjs

# 2. Levantar todos los servicios
docker-compose up --build

# 3. Esperar a que los servicios estén listos (30-60 segundos)
# Verás mensajes como:
# ✅ MongoDB Connected
# 🚀 Server running on port 3000
# VITE ready in X ms

# 4. Abrir en el navegador
# Frontend: http://localhost:5173
# Backend: http://localhost:3000/health
```

**¡Listo!** La aplicación está corriendo.

### Detener los servicios

```bash
# Ctrl+C en la terminal, luego:
docker-compose down
```

## 💻 Opción 2: Instalación Local

### Prerequisitos
- Node.js >= 18.x
- MongoDB >= 6.x corriendo

### Backend

```bash
# Terminal 1
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
# Terminal 2
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Verificar

- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health

## 🎯 Primeros Pasos

### 1. Explorar la Aplicación

1. **Página de Inicio** (http://localhost:5173)
   - Ver características del aplicativo
   - Información del stack tecnológico

2. **Completar Formulario** (http://localhost:5173/survey)
   - Formulario de 4 pasos
   - Validación en tiempo real
   - Envío a base de datos

3. **Ver Resultados** (http://localhost:5173/results)
   - Tabla con todas las respuestas
   - Estadísticas en tiempo real
   - Acciones de ver y eliminar

### 2. Probar la API

```bash
# Health check
curl http://localhost:3000/health

# Crear una respuesta de formulario
curl -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "surveyData": {
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com"
    },
    "status": "completed"
  }'

# Obtener todas las respuestas
curl http://localhost:3000/api/surveys

# Obtener estadísticas
curl http://localhost:3000/api/surveys/stats
```

### 3. Personalizar el Formulario

Editar `frontend/src/config/surveyConfig.js`:

```javascript
export const surveyJson = {
  title: "Mi Formulario Personalizado",
  pages: [
    {
      name: "page1",
      title: "Paso 1",
      elements: [
        {
          type: "text",
          name: "miCampo",
          title: "Mi Campo Personalizado",
          isRequired: true
        }
      ]
    }
  ]
};
```

Guardar y ver los cambios automáticamente en el navegador.

## 📱 Estructura de Navegación

```
Inicio (/)
├── Información general
├── Características
└── Stack tecnológico

Formulario (/survey)
├── Paso 1: Información Personal
├── Paso 2: Información de Contacto
├── Paso 3: Preferencias
└── Paso 4: Comentarios

Resultados (/results)
├── Estadísticas
├── Tabla de respuestas
└── Acciones (ver/eliminar)
```

## 🔧 Comandos Útiles

### Docker

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart frontend

# Reconstruir después de cambios
docker-compose up --build

# Limpiar todo
docker-compose down -v
```

### Desarrollo Local

```bash
# Backend
cd backend
npm run dev        # Modo desarrollo con hot-reload
npm start          # Modo producción

# Frontend
cd frontend
npm run dev        # Modo desarrollo
npm run build      # Construir para producción
npm run preview    # Preview de build de producción
```

## 🐛 Solución Rápida de Problemas

### Puerto ya en uso

```bash
# Encontrar y matar proceso
lsof -i :3000  # o :5173
kill -9 <PID>
```

### MongoDB no conecta

```bash
# Verificar que está corriendo
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Reiniciar
brew services restart mongodb-community@7.0
```

### Cambios no se reflejan

```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install

# En Docker, reconstruir
docker-compose up --build
```

### Error de CORS

Verificar que `VITE_API_URL` en `frontend/.env` apunta a `http://localhost:3000/api`

## 📊 Datos de Prueba

### Crear Respuestas de Prueba

```bash
# Script para crear 5 respuestas de prueba
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/surveys \
    -H "Content-Type: application/json" \
    -d "{
      \"surveyData\": {
        \"firstName\": \"Usuario$i\",
        \"lastName\": \"Prueba\",
        \"email\": \"usuario$i@test.com\",
        \"age\": $((20 + i)),
        \"gender\": \"male\",
        \"phone\": \"555-000$i\",
        \"city\": \"Madrid\",
        \"country\": \"España\"
      },
      \"status\": \"completed\"
    }"
done
```

## 🎓 Próximos Pasos

1. **Leer la documentación completa**
   - [README.md](./README.md) - Visión general
   - [SETUP.md](./SETUP.md) - Instalación detallada
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema

2. **Personalizar el formulario**
   - Agregar nuevos campos
   - Modificar validaciones
   - Cambiar estilos

3. **Integrar en tu proyecto**
   - [MODULARIZATION.md](./MODULARIZATION.md) - Guía de integración

4. **Desplegar en producción**
   - Configurar variables de entorno
   - Usar Docker en servidor
   - Configurar dominio y SSL

## 💡 Tips

- **Hot Reload**: Tanto frontend como backend tienen hot-reload activado
- **Logs**: Revisa los logs en la terminal para debugging
- **MongoDB Compass**: Usa MongoDB Compass para visualizar la base de datos
- **React DevTools**: Instala React DevTools para debugging del frontend
- **Postman**: Usa Postman para probar la API

## 📞 Ayuda

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica que todos los servicios están corriendo: `docker-compose ps`
3. Consulta [SETUP.md](./SETUP.md) para solución de problemas detallada
4. Revisa la consola del navegador (F12)

---

**¡Feliz desarrollo! 🎉**
