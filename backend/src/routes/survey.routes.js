import express from 'express';
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyStats
} from '../controllers/survey.controller.js';
import { validateSurvey } from '../middleware/validators.js';

const router = express.Router();

/**
 * @route   POST /api/surveys
 * @desc    Crear nueva respuesta de formulario
 * @access  Public
 */
router.post('/', validateSurvey, createSurvey);

/**
 * @route   GET /api/surveys
 * @desc    Obtener todas las respuestas
 * @access  Public
 */
router.get('/', getAllSurveys);

/**
 * @route   GET /api/surveys/stats
 * @desc    Obtener estadísticas
 * @access  Public
 */
router.get('/stats', getSurveyStats);

/**
 * @route   GET /api/surveys/:id
 * @desc    Obtener respuesta por ID
 * @access  Public
 */
router.get('/:id', getSurveyById);

/**
 * @route   PUT /api/surveys/:id
 * @desc    Actualizar respuesta
 * @access  Public
 */
router.put('/:id', validateSurvey, updateSurvey);

/**
 * @route   DELETE /api/surveys/:id
 * @desc    Eliminar respuesta
 * @access  Public
 */
router.delete('/:id', deleteSurvey);

export default router;
