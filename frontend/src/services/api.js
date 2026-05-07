import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach stored token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gdi_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gdi_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Survey API
export const surveyAPI = {
  // Crear nueva respuesta de formulario
  create: async (surveyData, status = 'completed', formType) => {
    const response = await api.post('/surveys', {
      formType,
      surveyData,
      status,
      metadata: {
        sessionId: generateSessionId(),
      },
    });
    return response.data;
  },

  // Obtener todas las respuestas
  getAll: async (params = {}) => {
    const response = await api.get('/surveys', { params });
    return response.data;
  },

  // Obtener respuesta por ID
  getById: async (id) => {
    const response = await api.get(`/surveys/${id}`);
    return response.data;
  },

  // Actualizar respuesta
  update: async (id, surveyData, status) => {
    const response = await api.put(`/surveys/${id}`, {
      surveyData,
      status,
    });
    return response.data;
  },

  // Eliminar respuesta
  delete: async (id) => {
    const response = await api.delete(`/surveys/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async () => {
    const response = await api.get('/surveys/stats');
    return response.data;
  },

  // Generar presentación PPTX individual
  generateIndividualPresentation: async (id) => {
    const response = await api.get(`/surveys/${id}/presentation`, {
      responseType: 'blob'
    });
    return response.data;
  },
  // Generar documento PINAR DOCX
  generatePinarDocx: async (surveyData) => {

    const response = await api.post(
      '/pinar/generate-docx',
      surveyData,
      {
        responseType: 'blob'
      }
    );

    return response.data;
  },
};

// Survey Definition API
export const surveyDefinitionAPI = {
  // Obtener definición activa
  getActive: async () => {
    const response = await api.get('/survey-definitions/active');
    return response.data;
  },

  // Crear o actualizar definición
  createOrUpdate: async (definition) => {
    const response = await api.post('/survey-definitions', definition);
    return response.data;
  },

  // Obtener todas las definiciones
  getAll: async () => {
    const response = await api.get('/survey-definitions');
    return response.data;
  },

  // Obtener definición por ID
  getById: async (id) => {
    const response = await api.get(`/survey-definitions/${id}`);
    return response.data;
  },

  // Eliminar definición
  delete: async (id) => {
    const response = await api.delete(`/survey-definitions/${id}`);
    return response.data;
  },
};

// Utilidad para generar ID de sesión
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default api;
