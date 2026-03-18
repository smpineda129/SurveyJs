/**
 * Calculadora de diagnóstico para MGDA (Modelo de Gestión Documental y Administración de Archivos)
 * Usa escala de madurez: 0 (Inicial), 65 (Básico), 79 (Intermedio), 94 (Avanzado), 100 (Optimizado)
 * Porcentaje = promedio de valores seleccionados (máximo 100 por ítem)
 */

const VALUE_TEXT = {
  0: 'Inicial',
  65: 'Básico',
  79: 'Intermedio',
  94: 'Avanzado',
  100: 'Optimizado'
};

const MGDA_STRUCTURE = [
  {
    key: 'estrategico',
    title: 'ESTRATÉGICO',
    subAspectos: [
      {
        nombre: 'Planeación de la Función Archivística',
        products: [
          { key: 'DIAGNOSTICO_SEL', title: 'Diagnóstico de Archivos' },
          { key: 'POLITICA_GD_SEL', title: 'Política de Gestión Documental' },
          { key: 'PGD_SEL', title: 'Programa de Gestión Documental - PGD' },
          { key: 'PINAR_SEL', title: 'Plan Institucional de Archivos - PINAR' },
          { key: 'SIC_SEL', title: 'Sistema Integrado de Conservación - SIC' },
          { key: 'PLAN_ANALISIS_SEL', title: 'Plan de análisis de procesos y procedimientos' },
          { key: 'MATRIZ_RIESGOS_SEL', title: 'Matriz de Riesgos en Gestión Documental' }
        ]
      },
      {
        nombre: 'Planeación Estratégica',
        products: [
          { key: 'ARTICULACION_PE_SEL', title: 'Articulación con Plan Estratégico' },
          { key: 'ARTICULACION_MIPG_SEL', title: 'Articulación con MIPG' }
        ]
      },
      {
        nombre: 'Control, Evaluación y Seguimiento',
        products: [
          { key: 'INDICADORES_GESTION_SEL', title: 'Indicadores de Gestión' },
          { key: 'INFORMES_GESTION_SEL', title: 'Informes de Gestión' },
          { key: 'PROGRAMA_AUDITORIA_SEL', title: 'Programa de Auditoría' }
        ]
      }
    ]
  },
  {
    key: 'administracion',
    title: 'ADMINISTRACIÓN DE ARCHIVOS',
    subAspectos: [
      {
        nombre: 'Administración',
        products: [
          { key: 'PLANEACION_ADMIN_SEL', title: 'Planeación Administrativa' }
        ]
      },
      {
        nombre: 'Recursos Físicos',
        products: [
          { key: 'INFRAESTRUCTURA_LOCATIVA_SEL', title: 'Infraestructura Locativa' }
        ]
      },
      {
        nombre: 'Talento Humano',
        products: [
          { key: 'GESTION_HUMANA_SEL', title: 'Gestión Humana' },
          { key: 'CAPACITACION_GD_SEL', title: 'Capacitación en Gestión Documental' }
        ]
      },
      {
        nombre: 'Gestión en Seguridad y Salud Ocupacional',
        products: [
          { key: 'CONDICIONES_TRABAJO_SEL', title: 'Condiciones de Trabajo' }
        ]
      }
    ]
  },
  {
    key: 'procesos',
    title: 'PROCESOS DE LA GESTIÓN DOCUMENTAL',
    subAspectos: [
      {
        nombre: 'Planeación Técnica',
        products: [
          { key: 'DISENO_CREACION_DOC_SEL', title: 'Diseño y Creación de Documentos' },
          { key: 'DOC_ESPECIALES_SEL', title: 'Documentos Especiales' },
          { key: 'CUADRO_CLASIFICACION_SEL', title: 'Cuadro de Clasificación Documental' },
          { key: 'TABLAS_RETENCION_SEL', title: 'Tablas de Retención Documental' },
          { key: 'TABLAS_VALORACION_SEL', title: 'Tablas de Valoración Documental' }
        ]
      },
      {
        nombre: 'Producción',
        products: [
          { key: 'MEDIOS_TECNICAS_PRODUCCION_SEL', title: 'Medios y Técnicas de Producción' },
          { key: 'REPROGRAFIA_SEL', title: 'Reprografía' }
        ]
      },
      {
        nombre: 'Gestión y Trámite',
        products: [
          { key: 'REGISTRO_DISTRIBUCION_SEL', title: 'Registro y Distribución' }
        ]
      },
      {
        nombre: 'Organización',
        products: [
          { key: 'DESCRIPCION_DOCUMENTAL_SEL', title: 'Descripción Documental' }
        ]
      },
      {
        nombre: 'Transferencias',
        products: [
          { key: 'PLAN_TRANSFERENCIAS_SEL', title: 'Plan de Transferencias' }
        ]
      },
      {
        nombre: 'Disposición de Documentos',
        products: [
          { key: 'ELIMINACION_DOCUMENTOS_SEL', title: 'Eliminación de Documentos' }
        ]
      },
      {
        nombre: 'Planeación Técnica (Conservación)',
        products: [
          { key: 'PLAN_CONSERVACION_SEL', title: 'Plan de Conservación' },
          { key: 'PLAN_PRESERVACION_DIGITAL_SEL', title: 'Plan de Preservación Digital' }
        ]
      },
      {
        nombre: 'Valoración',
        products: [
          { key: 'VALORES_PRIMARIOS_SECUNDARIOS_SEL', title: 'Valores Primarios y Secundarios' }
        ]
      }
    ]
  },
  {
    key: 'tecnologico',
    title: 'TECNOLÓGICO',
    subAspectos: [
      {
        nombre: 'Articulación Gestión Docs Electrónicos',
        products: [
          { key: 'GESTION_DOC_PROC_SEL', title: 'Gestión Documental en Procesos' },
          { key: 'GESTION_DOC_CANAL_SEL', title: 'Gestión Documental en Canal' },
          { key: 'SISTEMA_INFO_CORP_SEL', title: 'Sistema de Información Corporativo' }
        ]
      },
      {
        nombre: 'Tecnologías para Gestión Docs Electrónicos',
        products: [
          { key: 'MODELO_REQ_SEL', title: 'Modelo de Requisitos' },
          { key: 'SISTEMA_GDEA_SEL', title: 'Sistema de Gestión de Docs Electrónicos' },
          { key: 'DIGITALIZACION_SEL', title: 'Digitalización' },
          { key: 'ESQUEMA_METADATOS_SEL', title: 'Esquema de Metadatos' },
          { key: 'SISTEMA_PRESERVACION_SEL', title: 'Sistema de Preservación' },
          { key: 'ALMACENAMIENTO_NUBE_SEL', title: 'Almacenamiento en la Nube' },
          { key: 'REPOSITORIOS_DIGITALES_SEL', title: 'Repositorios Digitales' }
        ]
      },
      {
        nombre: 'Seguridad y Privacidad',
        products: [
          { key: 'ARTICULACION_POLITICAS_SEG_INFO_SEL', title: 'Articulación con Políticas de Seguridad' },
          { key: 'COPIA_SEGURIDAD_ARCHIVO_DIG_SEL', title: 'Copia de Seguridad del Archivo Digital' }
        ]
      },
      {
        nombre: 'Interoperabilidad',
        products: [
          { key: 'INTEROPERABILIDAD_POLITICO_LEGAL_SEL', title: 'Interoperabilidad Político-Legal' },
          { key: 'INTEROPERABILIDAD_SEMANTICO_SEL', title: 'Interoperabilidad Semántico' },
          { key: 'INTEROPERABILIDAD_TECNICO_SEL', title: 'Interoperabilidad Técnico' }
        ]
      }
    ]
  },
  {
    key: 'cultural',
    title: 'CULTURAL',
    subAspectos: [
      {
        nombre: 'Gestión del Conocimiento',
        products: [
          { key: 'PROGRAMA_GESTION_CONOCIMIENTO_SEL', title: 'Programa de Gestión del Conocimiento' },
          { key: 'MEMORIA_INSTITUCIONAL_SEL', title: 'Memoria Institucional' },
          { key: 'ARCHIVOS_HISTORICOS_SEL', title: 'Archivos Históricos' }
        ]
      },
      {
        nombre: 'Redes Culturales',
        products: [
          { key: 'REDES_CULTURALES_SEL', title: 'Redes Culturales' },
          { key: 'RENDICION_CUENTAS_SEL', title: 'Rendición de Cuentas' },
          { key: 'MECANISMOS_DIFUSION_SEL', title: 'Mecanismos de Difusión' },
          { key: 'ACCESO_CONSULTA_INFO_SEL', title: 'Acceso y Consulta de Información' }
        ]
      },
      {
        nombre: 'Protección del Ambiente',
        products: [
          { key: 'PLAN_AMBIENTAL_SEL', title: 'Plan Ambiental' }
        ]
      }
    ]
  }
];

export class MGDADiagnosticCalculator {
  constructor(surveyData) {
    this.data = surveyData;
  }

  getValueText(numVal) {
    return VALUE_TEXT[numVal] ?? 'Sin respuesta';
  }

  /**
   * Calcular estadísticas para una lista de products
   */
  calculateByKeys(products) {
    let cumple = 0, parcial = 0, noCumple = 0, total = 0, sum = 0;

    products.forEach(({ key }) => {
      const val = this.data[key];
      if (typeof val !== 'number') return;
      sum += val;
      total++;
      if (val >= 80) cumple++;
      else if (val >= 60) parcial++;
      else noCumple++;
    });

    const porcentaje = total > 0 ? parseFloat((sum / total).toFixed(1)) : 0;
    return { cumple, parcial, noCumple, total, porcentaje };
  }

  /**
   * Combinar múltiples resultados (suma counts, recomputa porcentaje como promedio ponderado por total)
   */
  mergeResults(results) {
    let cumple = 0, parcial = 0, noCumple = 0, total = 0, weightedSum = 0;

    results.forEach(r => {
      cumple += r.cumple;
      parcial += r.parcial;
      noCumple += r.noCumple;
      weightedSum += r.porcentaje * r.total;
      total += r.total;
    });

    const porcentaje = total > 0 ? parseFloat((weightedSum / total).toFixed(1)) : 0;
    return { cumple, parcial, noCumple, total, porcentaje };
  }

  /**
   * Calcular cumplimiento global
   * Retorna sections array (5 entries) para createResultadoGlobal y bySection aliases para generateRecommendations
   */
  calculateGlobal() {
    const categoryResults = MGDA_STRUCTURE.map(cat => {
      const allProducts = cat.subAspectos.flatMap(s => s.products);
      return { ...this.calculateByKeys(allProducts), label: cat.title };
    });

    const global = this.mergeResults(categoryResults);

    // bySection aliases (admin/func/pres) for helpers.generateRecommendations compatibility
    const bySection = {
      admin: categoryResults[0],
      func: categoryResults[1],
      pres: categoryResults[2]
    };

    // sections array for createResultadoGlobal bar chart
    const sections = categoryResults.map(r => ({ label: r.label, porcentaje: r.porcentaje }));

    return {
      ...global,
      sections,
      bySection
    };
  }

  /**
   * Extraer observaciones para una lista de products
   */
  getObservationsByKeys(products) {
    return products
      .map(({ key }) => {
        const obsKey = key.replace('_SEL', '_OBS');
        return this.data[obsKey]?.trim();
      })
      .filter(Boolean);
  }

  /**
   * Generar items con key, title, value text, observation
   */
  generateItemsByKeys(products) {
    return products.map(({ key, title }) => {
      const numVal = this.data[key];
      const obsKey = key.replace('_SEL', '_OBS');
      return {
        key,
        title,
        value: typeof numVal === 'number' ? this.getValueText(numVal) : '—',
        observation: this.data[obsKey] || ''
      };
    });
  }

  /**
   * Calcular todos los sub-aspectos agrupados por las 5 categorías
   * Retorna { categories: [{key, title, global, subAspectos}] }
   */
  calculateAllSubAspectos() {
    const categories = MGDA_STRUCTURE.map(cat => {
      const subAspectos = cat.subAspectos.map(sub => ({
        nombre: sub.nombre,
        ...this.calculateByKeys(sub.products),
        items: this.generateItemsByKeys(sub.products),
        observaciones: this.getObservationsByKeys(sub.products)
      }));

      const allProducts = cat.subAspectos.flatMap(s => s.products);
      const global = this.calculateByKeys(allProducts);

      return { key: cat.key, title: cat.title, global, subAspectos };
    });

    return { categories };
  }
}
