import Survey from '../models/Survey.js';

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

    if (survey.formType !== 'entidades_privadas') {
      return res.status(400).json({
        success: false,
        message: 'La generación de presentación solo está disponible para el formulario de Entidades Privadas'
      });
    }

    const pptxgenModule = await import('pptxgenjs');
    const PptxGenJS = pptxgenModule.default;
    const pptx = new PptxGenJS();
    
    // Importar módulos de arquitectura modular
    const { DiagnosticCalculator } = await import('../services/pptx/calculators/diagnosticCalculator.js');
    const staticSlides = await import('../services/pptx/generators/staticSlides.js');
    const dynamicSlides = await import('../services/pptx/generators/dynamicSlides.js');
    const helpers = await import('../services/pptx/generators/helpers.js');
    
    const data = survey.surveyData;
    const calculator = new DiagnosticCalculator(data);
    const entityName = data.nombre_entidad || 'Entidad';
    const date = helpers.formatDateSpanish(survey.createdAt);
    
    // === SLIDES INFORMATIVOS (FIJOS) ===
    staticSlides.createPortada(pptx, entityName, date);
    staticSlides.createTituloSlide(pptx);
    staticSlides.createContextualizacion(pptx);
    staticSlides.createObjetivos(pptx);
    staticSlides.createMetodologia(pptx);
    staticSlides.createQueSeEvaluo(pptx);
    staticSlides.createParaTenerEnCuenta(pptx);
    staticSlides.createSeparator(pptx, 'INFORME DIAGNÓSTICO DOCUMENTAL');
    
    // === SLIDES DINÁMICOS (BASADOS EN DATOS) ===
    
    // Calcular resultados
    const globalResult = calculator.calculateGlobal();
    
    // Resultado global
    dynamicSlides.createResultadoGlobal(pptx, globalResult);
    
    // Estado porcentual general
    dynamicSlides.createEstadoPorcentual(pptx, globalResult);
    
    // Aspectos administrativos - con hallazgos
    const adminFindings = calculator.generateFindingsBySection('1_', 'Aspectos Administrativos');
    adminFindings.push(...calculator.generateFindingsBySection('2_', 'Aspectos Organizacionales'));
    adminFindings.push(...calculator.generateFindingsBySection('3_', 'Aspectos de Financiación'));
    adminFindings.push(...calculator.generateFindingsBySection('4_', 'Aspectos de Formación'));
    
    if (adminFindings.length > 0) {
      dynamicSlides.createInformeSeccion(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS ADMINISTRATIVOS',
        adminFindings,
        globalResult.bySection.admin.porcentaje
      );
    } else {
      dynamicSlides.createInformeConGrafico(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS ADMINISTRATIVOS',
        ['La entidad cumple satisfactoriamente con los aspectos administrativos evaluados.'],
        globalResult.bySection.admin.porcentaje
      );
    }
    
    // Función archivística - con hallazgos
    const funcFindings = calculator.generateFindingsBySection('5_', 'Instrumentos Archivísticos');
    funcFindings.push(...calculator.generateFindingsBySection('6_', 'Organización y Descripción'));
    funcFindings.push(...calculator.generateFindingsBySection('7_', 'Comunicaciones Oficiales'));
    
    if (funcFindings.length > 0) {
      dynamicSlides.createInformeSeccion(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE FUNCIÓN ARCHIVÍSTICA',
        funcFindings,
        globalResult.bySection.func.porcentaje
      );
    } else {
      dynamicSlides.createInformeConGrafico(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE FUNCIÓN ARCHIVÍSTICA',
        ['La entidad cumple satisfactoriamente con los aspectos de función archivística evaluados.'],
        globalResult.bySection.func.porcentaje
      );
    }
    
    // Preservación - con hallazgos
    const presFindings = calculator.generateFindingsBySection('8_', 'Aspectos de Preservación');
    
    if (presFindings.length > 0) {
      dynamicSlides.createInformeSeccion(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE PRESERVACIÓN',
        presFindings,
        globalResult.bySection.pres.porcentaje
      );
    } else {
      dynamicSlides.createInformeConGrafico(
        pptx,
        'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE PRESERVACIÓN',
        ['La entidad cumple satisfactoriamente con los aspectos de preservación evaluados.'],
        globalResult.bySection.pres.porcentaje
      );
    }
    
    // Plan de acción
    const recommendations = helpers.generateRecommendations(globalResult);
    dynamicSlides.createPlanAccion(pptx, recommendations);
    
    // Cierre
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

