import Survey from '../models/Survey.js';
import { summarizeObservaciones } from '../services/gptSummarizer.js';

/**
 * Crear nueva respuesta de formulario
 */
export const createSurvey = async (req, res, next) => {
  try {
    const { surveyData, status, metadata, formType } = req.body;

    const survey = new Survey({
      formType,
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

/**
 * Generar presentación PPTX individual para un registro específico
 * Arquitectura modular con diseño institucional
 */
export const generateIndividualPresentation = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Encuesta no encontrada'
      });
    }

    if (!['entidades_privadas', 'entidades_publicas', 'mgda'].includes(survey.formType)) {
      return res.status(400).json({
        success: false,
        message: 'La generación de presentación solo está disponible para Entidades Privadas, Entidades Públicas y MGDA'
      });
    }

    const pptxgenModule = await import('pptxgenjs');
    const PptxGenJS = pptxgenModule.default;
    const pptx = new PptxGenJS();

    // Importar módulos de arquitectura modular
    const { DiagnosticCalculator } = await import('../services/pptx/calculators/diagnosticCalculator.js');
    const { PublicaDiagnosticCalculator } = await import('../services/pptx/calculators/publicaDiagnosticCalculator.js');
    const { MGDADiagnosticCalculator } = await import('../services/pptx/calculators/mgdaDiagnosticCalculator.js');
    const staticSlides = await import('../services/pptx/generators/staticSlides.js');
    const dynamicSlides = await import('../services/pptx/generators/dynamicSlides.js');
    const helpers = await import('../services/pptx/generators/helpers.js');

    const data = survey.surveyData;
    const calculator = survey.formType === 'entidades_publicas'
      ? new PublicaDiagnosticCalculator(data)
      : survey.formType === 'mgda'
      ? new MGDADiagnosticCalculator(data)
      : new DiagnosticCalculator(data);
    const entityName = data.nombre_entidad || data.NOMBRE_ENTIDAD || 'Entidad';
    const date = helpers.formatDateSpanish(survey.createdAt);
    
    // ── Slides informativos (fijos) ─────────────────────────
    staticSlides.createPortada(pptx, entityName, date);
    staticSlides.createContextualizacion(pptx);
    staticSlides.createObjetivos(pptx);
    staticSlides.createMetodologia(pptx);
    staticSlides.createQueSeEvaluo(pptx);

    // ── Resultado global ─────────────────────────────────────
    const globalResult = calculator.calculateGlobal();
    dynamicSlides.createResultadoGlobal(pptx, globalResult);

    // ── Vista general por aspecto ────────────────────────────
    const allSubAspectos = calculator.calculateAllSubAspectos();

    // MGDA returns { categories: [...] }; legacy returns { admin, func, pres }
    const categoriasSlides = allSubAspectos.categories ?? [
      { title: 'ASPECTOS ADMINISTRATIVOS',         global: allSubAspectos.admin.global, subAspectos: allSubAspectos.admin.subAspectos },
      { title: 'ASPECTOS DE FUNCIÓN ARCHIVÍSTICA', global: allSubAspectos.func.global, subAspectos: allSubAspectos.func.subAspectos },
      { title: 'ASPECTOS DE PRESERVACIÓN',         global: allSubAspectos.pres.global, subAspectos: allSubAspectos.pres.subAspectos }
    ];

    for (const cat of categoriasSlides) {
      dynamicSlides.createAspectoOverview(pptx, cat.title, cat.subAspectos, cat.global);
      const obsItems = cat.subAspectos.flatMap(sub =>
        (sub.items || []).filter(item => item.observation?.trim())
      );
      const bullets = await summarizeObservaciones(cat.title, obsItems);
      dynamicSlides.createObservacionesIA(pptx, cat.title, bullets);
    }

    // ── Plan de acción + Cierre ──────────────────────────────
    const recommendations = helpers.generateRecommendations(globalResult);
    dynamicSlides.createPlanAccion(pptx, recommendations);
    dynamicSlides.createCierre(pptx, entityName);
    
    // Generar archivo PPTX
    const buffer = await pptx.write({ outputType: 'nodebuffer' });
    const fileName = `Informe_Diagnostico_${helpers.sanitizeFileName(entityName)}_${Date.now()}.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(buffer);

  } catch (error) {
    console.error('Error generating individual presentation:', error);
    next(error);
  }
};

