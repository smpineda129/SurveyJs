/**
 * Generadores de slides dinámicos (basados en datos del formulario)
 * Incluye gráficos de barras horizontales y hallazgos textuales
 */

import { INSTITUTIONAL_STYLES as STYLES, getComplianceColor, chunkArray } from '../config/institutionalStyles.js';

/**
 * Agregar elementos decorativos diagonales blancos
 */
function addDecorativeElements(slide) {
  slide.addShape('triangle', {
    x: 8.5,
    y: 0,
    w: 1.5,
    h: 1.0,
    fill: { color: STYLES.colors.white, transparency: 90 },
    line: { type: 'none' },
    rotate: 45
  });

  slide.addShape('triangle', {
    x: 0,
    y: 5.0,
    w: 1.2,
    h: 0.8,
    fill: { color: STYLES.colors.white, transparency: 90 },
    line: { type: 'none' },
    rotate: 225
  });
}

/**
 * Crear gráfico de barras horizontales con semáforo
 */
function createHorizontalBarChart(slide, data, title, yStart, spacing = 0.6) {
  const maxBarWidth = 6.0;
  const barHeight = 0.4;

  data.forEach((item, index) => {
    const yPos = yStart + (index * spacing);
    const percentage = item.value;
    const barWidth = (percentage / 100) * maxBarWidth;
    const color = getComplianceColor(percentage);

    // Etiqueta
    slide.addText(item.label, {
      x: 0.8,
      y: yPos,
      w: 2.0,
      h: barHeight,
      fontSize: 10,
      color: STYLES.colors.white,
      valign: 'middle'
    });

    // Barra de fondo (gris)
    slide.addShape('rect', {
      x: 3.0,
      y: yPos,
      w: maxBarWidth,
      h: barHeight,
      fill: { color: '2C3E50', transparency: 50 },
      line: { type: 'none' }
    });

    // Barra de progreso (color semáforo)
    if (barWidth > 0) {
      slide.addShape('rect', {
        x: 3.0,
        y: yPos,
        w: barWidth,
        h: barHeight,
        fill: { color: color },
        line: { type: 'none' }
      });
    }

    // Porcentaje
    slide.addText(`${percentage.toFixed(1)}%`, {
      x: 9.1,
      y: yPos,
      w: 0.8,
      h: barHeight,
      fontSize: 10,
      color: STYLES.colors.white,
      valign: 'middle',
      bold: true
    });
  });
}

/**
 * Slide: Resultado global del diagnóstico
 */
export function createResultadoGlobal(pptx, globalResult) {
  const slide = pptx.addSlide();
  slide.background = { color: STYLES.colors.bgBlue };

  addDecorativeElements(slide);

  // Título
  slide.addText('INFORME DIAGNÓSTICO DOCUMENTAL', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.6,
    ...STYLES.fonts.titleMain,
    align: 'center'
  });

  // Subtítulo
  slide.addText('RESULTADOS GENERALES POR ÍTEM', {
    x: 0.5,
    y: 0.9,
    w: 9,
    h: 0.4,
    fontSize: 14,
    color: STYLES.colors.textLight,
    align: 'center'
  });

  // Gráfico de barras — usa sections[] si existe (MGDA: 5), sino 3 secciones clásicas
  const chartData = globalResult.sections
    ? globalResult.sections.map(s => ({ label: s.label, value: s.porcentaje }))
    : [
      { label: 'ASPECTOS ADMINISTRATIVOS', value: globalResult.bySection.admin.porcentaje },
      { label: 'ASPECTOS FUNCIÓN ARCHIVÍSTICA', value: globalResult.bySection.func.porcentaje },
      { label: 'ASPECTOS DE PRESERVACIÓN', value: globalResult.bySection.pres.porcentaje }
    ];

  // Dynamic layout: start and spacing so bars always clear the result box
  const barH = 0.4;
  const barSpacing = chartData.length > 3 ? 0.46 : 0.6;
  const startY = chartData.length > 3 ? 1.5 : 2.0;
  createHorizontalBarChart(slide, chartData, '', startY, barSpacing);

  // Position the total box safely below the last bar
  const lastBarBottom = startY + (chartData.length - 1) * barSpacing + barH;
  const totalBoxY = Math.max(4.0, lastBarBottom + 0.3);

  // Resultado total en caja destacada
  const color = getComplianceColor(globalResult.porcentaje);

  slide.addShape('rect', {
    x: 3.0,
    y: totalBoxY,
    w: 4.0,
    h: 1.2,
    fill: { color: color },
    line: { type: 'none' }
  });

  slide.addText(`Total cumplimiento\n${globalResult.porcentaje.toFixed(1)}%`, {
    x: 3.0,
    y: totalBoxY + 0.1,
    w: 4.0,
    h: 1.0,
    fontSize: 18,
    color: STYLES.colors.white,
    align: 'center',
    valign: 'middle',
    bold: true
  });
}

/**
 * Helper: Dibujar tarjeta de sub-aspecto con indicador circular pequeño y barra de progreso
 */
function drawSubAspectoCard(slide, subAspecto, x, y, w, h) {
  const pct = subAspecto.porcentaje;
  const color = getComplianceColor(pct);
  const barW = w - 1.35; // Leave room for percentage label

  // Card background
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: '1A4F72', transparency: 10 },
    line: { color: STYLES.colors.accent, width: 0.75 }
  });

  // Compliance circle — scaled to card height so it never overlaps the bar
  const barAreaStart = h * 0.55; // bar starts at 55% of card height
  const maxCircleD = Math.min(0.32, barAreaStart - 0.1); // stays above bar area
  const r = maxCircleD / 2;
  const circleTopY = y + (barAreaStart - maxCircleD) / 2; // vertically centered in top area
  slide.addShape('ellipse', {
    x: x + 0.1, y: circleTopY, w: maxCircleD, h: maxCircleD,
    fill: { color },
    line: { type: 'none' }
  });

  // Sub-aspect name — starts after the circle horizontally
  slide.addText(subAspecto.nombre, {
    x: x + 0.1 + maxCircleD + 0.08, y: y + 0.05, w: w - (0.18 + maxCircleD + 0.08), h: h * 0.50,
    fontSize: 9, bold: true, color: STYLES.colors.white, valign: 'middle'
  });

  // Progress bar
  const barY = y + h * 0.60;
  const barH = 0.15;

  // Background
  slide.addShape('rect', {
    x: x + 0.12, y: barY, w: barW, h: barH,
    fill: { color: '2C3E50', transparency: 20 },
    line: { type: 'none' }
  });
  // Fill
  const fillW = Math.max(0.01, (pct / 100) * barW);
  slide.addShape('rect', {
    x: x + 0.12, y: barY, w: fillW, h: barH,
    fill: { color },
    line: { type: 'none' }
  });

  // Percentage text
  slide.addText(`${pct.toFixed(1)}%`, {
    x: x + 0.12 + barW + 0.04, y: barY - 0.06, w: 0.6, h: 0.28,
    fontSize: 8, bold: true, color, align: 'right', valign: 'middle'
  });
}

/**
 * Slide: Vista general de un aspecto con indicador circular central y sub-aspectos
 * @param {object} pptx - Instancia PptxGenJS
 * @param {string} aspectTitle - Título del aspecto (e.g. 'ASPECTOS ADMINISTRATIVOS')
 * @param {Array} subAspectos - Array de { nombre, porcentaje, cumple, parcial, noCumple, total, observaciones }
 * @param {object} globalStats - { porcentaje, cumple, parcial, noCumple, total }
 */
export function createAspectoOverview(pptx, aspectTitle, subAspectos, globalStats) {
  const slide = pptx.addSlide();
  slide.background = { color: STYLES.colors.bgBlue };

  // Header bar
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.95,
    fill: { color: STYLES.colors.bgDarkBlue },
    line: { type: 'none' }
  });
  slide.addText(`DIAGNÓSTICO DOCUMENTAL – ${aspectTitle}`, {
    x: 0.4, y: 0.17, w: 9.0, h: 0.62,
    fontSize: 15, bold: true, color: STYLES.colors.white, valign: 'middle'
  });

  // Split sub-aspects: left = first half (ceil), right = second half
  const midpoint = Math.ceil(subAspectos.length / 2);
  const leftItems = subAspectos.slice(0, midpoint);
  const rightItems = subAspectos.slice(midpoint);

  const maxColItems = Math.max(leftItems.length, rightItems.length);
  const availableH = 3.25; // y=1.05 to y=4.3
  const cardH = Math.min(1.4, availableH / maxColItems);
  const startY = 1.1;
  const colW = 2.75;

  // Left column (x=0.3)
  leftItems.forEach((sub, i) => {
    drawSubAspectoCard(slide, sub, 0.3, startY + i * cardH, colW, cardH - 0.07);
  });

  // Right column (x=6.95)
  rightItems.forEach((sub, i) => {
    drawSubAspectoCard(slide, sub, 6.95, startY + i * cardH, colW, cardH - 0.07);
  });

  // ── Central compliance donut ───────────────────────────────
  const pct = globalStats.porcentaje;
  const color = getComplianceColor(pct);

  // Center area: x=3.3 to x=6.9 (w=3.6")
  const outerD = 2.3;
  const innerD = 1.45;
  const circleX = 3.3 + (3.6 - outerD) / 2; // = 3.3 + 0.65 = 3.95
  const circleY = 1.3;

  // Outer filled circle
  slide.addShape('ellipse', {
    x: circleX, y: circleY, w: outerD, h: outerD,
    fill: { color },
    line: { type: 'none' }
  });

  // Inner hole (background color)
  const holeOffset = (outerD - innerD) / 2;
  slide.addShape('ellipse', {
    x: circleX + holeOffset, y: circleY + holeOffset, w: innerD, h: innerD,
    fill: { color: STYLES.colors.bgBlue },
    line: { type: 'none' }
  });

  // Percentage text centered in circle
  slide.addText(`${pct.toFixed(1)}%`, {
    x: circleX, y: circleY + outerD / 2 - 0.33,
    w: outerD, h: 0.5,
    fontSize: 19, bold: true, color: STYLES.colors.white, align: 'center', valign: 'middle'
  });

  // "CUMPLIMIENTO" label below circle
  slide.addText('CUMPLIMIENTO\nGLOBAL', {
    x: circleX, y: circleY + outerD + 0.12,
    w: outerD, h: 0.5,
    fontSize: 9, bold: true, color: STYLES.colors.textLight, align: 'center'
  });

  // Items total
  slide.addText(`${globalStats.total} ítems evaluados`, {
    x: circleX - 0.2, y: circleY + outerD + 0.68,
    w: outerD + 0.4, h: 0.28,
    fontSize: 8, color: STYLES.colors.textLight, align: 'center'
  });

  // Cumple / Parcial / No cumple legend
  const legendY = circleY + outerD + 1.05;
  [
    { label: `✓ Cumple: ${globalStats.cumple}`, color: STYLES.colors.optimal },
    { label: `≈ Parcial: ${globalStats.parcial}`, color: STYLES.colors.acceptable },
    { label: `✗ No cumple: ${globalStats.noCumple}`, color: STYLES.colors.critical }
  ].forEach((item, i) => {
    slide.addText(item.label, {
      x: circleX - 0.3, y: legendY + i * 0.27,
      w: outerD + 0.6, h: 0.27,
      fontSize: 8, bold: true, color: item.color, align: 'center'
    });
  });

}

/**
 * Helper: Map compliance text value to color
 */
function getStatusColor(value) {
  if (value === 'Cumple' || value === 'Indica') return STYLES.colors.optimal;
  if (value === 'Parcial' || value === 'Cumple parcial') return STYLES.colors.acceptable;
  // MGDA maturity levels
  if (value === 'Avanzado' || value === 'Optimizado') return STYLES.colors.optimal;
  if (value === 'Básico' || value === 'Intermedio') return STYLES.colors.acceptable;
  if (value === 'Inicial') return STYLES.colors.critical;
  return STYLES.colors.critical;
}

/**
 * Slides: Detalle de preguntas por sub-aspecto
 * Generates one or more slides per sub-aspecto showing all items with status and observation
 * @param {object} pptx - PptxGenJS instance
 * @param {string} aspectTitle - e.g. 'ASPECTOS ADMINISTRATIVOS'
 * @param {Array} subAspectos - Array with { nombre, items: [{ key, title, value, observation }] }
 */
export function createDetalleAspecto(pptx, aspectTitle, subAspectos) {
  subAspectos.forEach(sub => {
    if (!sub.items || sub.items.length === 0) return;

    const chunks = chunkArray(sub.items, 8);
    chunks.forEach((chunk, chunkIdx) => {
      const slide = pptx.addSlide();
      slide.background = { color: STYLES.colors.bgBlue };

      // Header bar
      slide.addShape('rect', {
        x: 0, y: 0, w: 10, h: 0.95,
        fill: { color: STYLES.colors.bgDarkBlue },
        line: { type: 'none' }
      });
      slide.addText(aspectTitle, {
        x: 0.4, y: 0.05, w: 9.0, h: 0.45,
        fontSize: 13, bold: true, color: STYLES.colors.white, valign: 'middle'
      });
      slide.addText(sub.nombre, {
        x: 0.4, y: 0.5, w: 9.0, h: 0.38,
        fontSize: 10, color: STYLES.colors.textLight, valign: 'middle'
      });

      // Item list
      let currentY = 1.1;
      chunk.forEach(item => {
        const statusColor = getStatusColor(item.value);
        // Line 1: key + title (left) + status (right)
        const keyTitle = `● ${item.key}: ${item.title}`;
        const truncated = keyTitle.length > 100 ? keyTitle.substring(0, 100) + '…' : keyTitle;
        slide.addText(truncated, {
          x: 0.4, y: currentY, w: 7.8, h: 0.3,
          fontSize: 9, bold: true, color: STYLES.colors.white, valign: 'middle'
        });
        slide.addText(item.value, {
          x: 8.2, y: currentY, w: 1.5, h: 0.3,
          fontSize: 8, bold: true, color: statusColor, align: 'right', valign: 'middle'
        });

        currentY += 0.42;
      });

      // Page indicator for multi-chunk sub-aspects
      if (chunks.length > 1) {
        slide.addText(`${sub.nombre} ${chunkIdx + 1}/${chunks.length}`, {
          x: 7.0, y: 6.8, w: 2.8, h: 0.25,
          fontSize: 7, color: STYLES.colors.textLight, align: 'right', valign: 'middle'
        });
      }
    });
  });
}

/**
 * Slide: Resumen IA de observaciones por sección
 */
export function createObservacionesIA(pptx, sectionTitle, bullets) {
  if (!bullets || bullets.length === 0) return;

  const slide = pptx.addSlide();
  slide.background = { color: STYLES.colors.bgBlue };

  // Header bar
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 0.95,
    fill: { color: STYLES.colors.bgDarkBlue },
    line: { type: 'none' }
  });
  slide.addText('ANÁLISIS DE OBSERVACIONES', {
    x: 0.4, y: 0.05, w: 9.0, h: 0.45,
    fontSize: 13, bold: true, color: STYLES.colors.white, valign: 'middle'
  });
  slide.addText(sectionTitle + '  •  Síntesis generada por IA', {
    x: 0.4, y: 0.5, w: 9.0, h: 0.38,
    fontSize: 9, color: STYLES.colors.textLight, valign: 'middle'
  });

  // Bullets
  let y = 1.2;
  bullets.forEach(bullet => {
    slide.addText(`▸  ${bullet}`, {
      x: 0.5, y, w: 9.0, h: 0.6,
      fontSize: 10, color: STYLES.colors.white, valign: 'top',
      wrap: true
    });
    y += 0.7;
  });

  // Footer
  slide.addText('Generado automáticamente a partir de las observaciones del diagnóstico', {
    x: 0.4, y: 6.85, w: 9.2, h: 0.2,
    fontSize: 7, color: STYLES.colors.textLight, italic: true, align: 'right'
  });
}

/**
 * Slide: Plan de acción
 */
export function createPlanAccion(
  pptx,
  recommendations = []
) {

  const slide =
    pptx.addSlide();

  slide.background = {
    color:
      STYLES.colors.bgBlue
  };

  addDecorativeElements(slide);

  // Título
  slide.addText(
    'PLAN DE ACCIÓN',
    {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      ...STYLES.fonts.titleMain,
      align: 'center'
    }
  );

  // Subtítulo
  slide.addText(
    'ACCIONES GENERADAS POR IA',
    {
      x: 0.5,
      y: 0.95,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color:
        STYLES.colors.textLight,
      align: 'center'
    }
  );

  const tableData = [

    [
      'ÍTEM',
      'PLAN DE ACCIÓN'
    ]

  ];

  recommendations
    .slice(0, 5)
    .forEach((rec, index) => {

      tableData.push([

        `${index + 1}`,

        rec || ''

      ]);

    });

  slide.addTable(tableData, {

    x: 0.4,
    y: 1.5,
    w: 9.0,

    colW: [
      3.0,
      4.8,
      1.2
    ],

    fontSize: 9,

    color:
      STYLES.colors.white,

    fill: {
      color:
        STYLES.colors.secondary
    },

    border: {
      pt: 1,
      color:
        STYLES.colors.white
    },

    rowH: 0.55,

    valign: 'middle'

  });

}
/**
 * Slide: Cierre con agradecimiento
 */
export function createCierre(pptx, entityName) {
  const slide = pptx.addSlide();
  slide.background = { color: STYLES.colors.bgBlue };

  slide.addText('¡Gracias!', {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1.0,
    fontSize: 48,
    bold: true,
    color: STYLES.colors.white,
    align: 'center',
    valign: 'middle'
  });

  slide.addText(entityName.toUpperCase(), {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: STYLES.colors.textLight,
    align: 'center'
  });
}
