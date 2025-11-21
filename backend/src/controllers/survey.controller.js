import Survey from '../models/Survey.js';

/**
 * Crear nueva respuesta de formulario
 */
export const createSurvey = async (req, res, next) => {
  try {
    const { surveyData, status, metadata } = req.body;

    const survey = new Survey({
      surveyData,
      status: status || 'draft',
      metadata: {
        ...metadata,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress
      }
    });

    if (status === 'completed') {
      survey.completedAt = new Date();
    }

    await survey.save();

    res.status(201).json({
      success: true,
      message: 'Survey creado exitosamente',
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las respuestas
 */
export const getAllSurveys = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const surveys = await Survey.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Survey.countDocuments(query);

    res.status(200).json({
      success: true,
      data: surveys,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener respuesta por ID
 */
export const getSurveyById = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar respuesta
 */
export const updateSurvey = async (req, res, next) => {
  try {
    const { surveyData, status } = req.body;

    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey no encontrado'
      });
    }

    if (surveyData) {
      survey.surveyData = surveyData;
    }

    if (status) {
      survey.status = status;
      if (status === 'completed' && !survey.completedAt) {
        survey.completedAt = new Date();
      }
    }

    await survey.save();

    res.status(200).json({
      success: true,
      message: 'Survey actualizado exitosamente',
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar respuesta
 */
export const deleteSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Survey eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas
 */
export const getSurveyStats = async (req, res, next) => {
  try {
    const total = await Survey.countDocuments();
    const completed = await Survey.countDocuments({ status: 'completed' });
    const draft = await Survey.countDocuments({ status: 'draft' });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        draft,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
