import express from 'express';
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyStats,
  generateIndividualPresentation
} from '../controllers/survey.controller.js';
import { validateSurvey } from '../middleware/validators.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// POST is public — form submissions don't require login
router.post('/', validateSurvey, createSurvey);

// All read/write/delete routes require authentication
router.get('/', authenticate, getAllSurveys);
router.get('/stats', authenticate, getSurveyStats);
router.get('/:id/presentation', authenticate, generateIndividualPresentation);
router.get('/:id', authenticate, getSurveyById);
router.put('/:id', authenticate, validateSurvey, updateSurvey);
router.delete('/:id', authenticate, deleteSurvey);

export default router;
