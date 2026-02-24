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
    
    // Aspectos administrativos - gráfico + listado completo
    const adminItems = [
      ...calculator.generateAllItemsBySection('1_'),
      ...calculator.generateAllItemsBySection('2_'),
      ...calculator.generateAllItemsBySection('3_'),
      ...calculator.generateAllItemsBySection('4_')
    ];
    
    dynamicSlides.createSeccionBarChart(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS ADMINISTRATIVOS',
      globalResult.bySection.admin,
      globalResult.bySection.admin.porcentaje
    );
    dynamicSlides.createInformeSeccion(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS ADMINISTRATIVOS',
      adminItems,
      globalResult.bySection.admin.porcentaje
    );
    
    // Función archivística - gráfico + listado completo
    const funcItems = [
      ...calculator.generateAllItemsBySection('5_'),
      ...calculator.generateAllItemsBySection('6_'),
      ...calculator.generateAllItemsBySection('7_')
    ];
    
    dynamicSlides.createSeccionBarChart(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE FUNCIÓN ARCHIVÍSTICA',
      globalResult.bySection.func,
      globalResult.bySection.func.porcentaje
    );
    dynamicSlides.createInformeSeccion(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE FUNCIÓN ARCHIVÍSTICA',
      funcItems,
      globalResult.bySection.func.porcentaje
    );
    
    // Preservación - gráfico + listado completo
    const presItems = calculator.generateAllItemsBySection('8_');
    
    dynamicSlides.createSeccionBarChart(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE PRESERVACIÓN',
      globalResult.bySection.pres,
      globalResult.bySection.pres.porcentaje
    );
    dynamicSlides.createInformeSeccion(
      pptx,
      'INFORME DIAGNÓSTICO DOCUMENTAL – ASPECTOS DE PRESERVACIÓN',
      presItems,
      globalResult.bySection.pres.porcentaje
    );
    
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

