/**
 * Calculadora de diagnóstico para Entidades Públicas
 * Usa scoring numérico ponderado (valor seleccionado / valor máximo * 100)
 */

import { surveyJson } from '../../../../../frontend/src/config/EntidadesPublicasConfig.js';
import { getQuestionTitle } from '../config/questionTitles.js';

export class PublicaDiagnosticCalculator {
  constructor(surveyData) {
    this.data = surveyData;
    this.choiceMap = this.buildChoiceMap();
  }

  /**
   * Recorre todos los elementos del surveyJson y construye un mapa
   * { questionKey: { maxValue, choices: [{value, text}] } }
   */
  buildChoiceMap() {
    const map = {};

    const processElement = (el) => {
      if (!el || typeof el !== 'object') return;

      if (el.type === 'radiogroup' && el.name && Array.isArray(el.choices)) {
        const numericChoices = el.choices.filter(c => typeof c.value === 'number');
        if (numericChoices.length > 0) {
          const maxValue = Math.max(...numericChoices.map(c => c.value));
          map[el.name] = { maxValue, choices: numericChoices };
        }
      }

      if (Array.isArray(el.elements)) el.elements.forEach(processElement);
      if (Array.isArray(el.panels)) el.panels.forEach(processElement);
    };

    if (Array.isArray(surveyJson.pages)) {
      surveyJson.pages.forEach(page => {
        if (Array.isArray(page.elements)) page.elements.forEach(processElement);
      });
    }

    return map;
  }

  /**
   * Obtiene el texto de display para un valor numérico de una pregunta
   */
  getValueText(key, numericValue) {
    const entry = this.choiceMap[key];
    if (!entry) return 'Sin respuesta';
    const choice = entry.choices.find(c => Math.abs(c.value - numericValue) < 0.001);
    return choice ? choice.text : 'Sin respuesta';
  }

  /**
   * Calcular cumplimiento por prefijo — porcentaje ponderado por valor numérico
   * Retorna { cumple, parcial, noCumple, total, sumSelected, sumMax, porcentaje }
   */
  calculateByPrefix(prefix) {
    let cumple = 0, parcial = 0, noCumple = 0, total = 0;
    let sumSelected = 0, sumMax = 0;

    Object.keys(this.data).forEach(key => {
      if (key.startsWith(prefix) &&
          key.match(/^[AC]_\d+_\d+_\d+$/) &&
          !key.includes('_obs') &&
          this.choiceMap[key]) {

        const numericValue = this.data[key];
        if (typeof numericValue !== 'number') return;

        const { maxValue } = this.choiceMap[key];
        sumSelected += numericValue;
        sumMax += maxValue;
        total++;

        const text = this.getValueText(key, numericValue);
        if (text === 'Cumple' || text === 'Indica') cumple++;
        else if (text === 'Cumple parcial') parcial++;
        else noCumple++;
      }
    });

    const porcentaje = sumMax > 0
      ? parseFloat((sumSelected / sumMax * 100).toFixed(1))
      : 0;

    return { cumple, parcial, noCumple, total, sumSelected, sumMax, porcentaje };
  }

  /**
   * Combina múltiples resultados manteniendo el porcentaje ponderado correcto
   */
  mergeResults(results) {
    const merged = results.reduce((acc, curr) => ({
      cumple: acc.cumple + curr.cumple,
      parcial: acc.parcial + curr.parcial,
      noCumple: acc.noCumple + curr.noCumple,
      total: acc.total + curr.total,
      sumSelected: acc.sumSelected + curr.sumSelected,
      sumMax: acc.sumMax + curr.sumMax
    }), { cumple: 0, parcial: 0, noCumple: 0, total: 0, sumSelected: 0, sumMax: 0 });

    const porcentaje = merged.sumMax > 0
      ? parseFloat((merged.sumSelected / merged.sumMax * 100).toFixed(1))
      : 0;

    return { ...merged, porcentaje };
  }

  /**
   * Calcular cumplimiento global con los tres aspectos
   */
  calculateGlobal() {
    const admin = this.mergeResults(['A_1_', 'A_2_', 'A_3_', 'A_4_'].map(p => this.calculateByPrefix(p)));
    const func  = this.mergeResults(['C_5_', 'C_6_', 'C_7_'].map(p => this.calculateByPrefix(p)));
    const pres  = this.calculateByPrefix('C_8_');

    const allMerged = this.mergeResults([admin, func, pres]);

    return {
      ...allMerged,
      bySection: { admin, func, pres }
    };
  }

  /**
   * Extraer observaciones por prefijo de sección
   */
  getObservationsBySection(prefix) {
    const observations = [];
    const keys = Object.keys(this.data).sort();

    keys.forEach(key => {
      if (key.startsWith(prefix) && key.includes('_obs') && this.data[key]) {
        const obs = this.data[key].trim();
        if (obs) observations.push(obs);
      }
    });

    return observations;
  }

  /**
   * Generar listado completo de ítems por sección con títulos y texto de cumplimiento
   * Retorna objetos { key, title, value (display text), observation }
   */
  generateAllItemsBySection(prefix) {
    const items = [];
    const keys = Object.keys(this.data).sort();

    keys.forEach(key => {
      if (key.startsWith(prefix) &&
          key.match(/^[AC]_\d+_\d+_\d+$/) &&
          !key.includes('_obs') &&
          this.choiceMap[key]) {

        const numericValue = this.data[key];
        if (typeof numericValue !== 'number') return;

        const value = this.getValueText(key, numericValue);
        const obsKey = `${key}_obs`;
        const observation = this.data[obsKey] || '';
        const strippedKey = key.replace(/^[AC]_/, '');
        const title = getQuestionTitle(strippedKey);

        items.push({ key, title, value, observation });
      }
    });

    return items;
  }

  /**
   * Calcular todos los sub-aspectos agrupados por los 3 aspectos principales
   * Retorna { admin, func, pres } con global stats y array de sub-aspectos
   */
  calculateAllSubAspectos() {
    const buildSubAspecto = (nombre, prefix) => ({
      nombre,
      prefix,
      ...this.calculateByPrefix(prefix),
      items: this.generateAllItemsBySection(prefix),
      observaciones: this.getObservationsBySection(prefix)
    });

    return {
      admin: {
        global: this.mergeResults(['A_1_', 'A_2_', 'A_3_', 'A_4_'].map(p => this.calculateByPrefix(p))),
        subAspectos: [
          buildSubAspecto('Instancias asesoras', 'A_1_'),
          buildSubAspecto('Aspectos organizacionales', 'A_2_'),
          buildSubAspecto('Aspectos de financiación', 'A_3_'),
          buildSubAspecto('Aspectos de formación y capacitación', 'A_4_'),
        ]
      },
      func: {
        global: this.mergeResults(['C_5_', 'C_6_', 'C_7_'].map(p => this.calculateByPrefix(p))),
        subAspectos: [
          buildSubAspecto('Instrumentos archivísticos', 'C_5_'),
          buildSubAspecto('Organización y descripción', 'C_6_'),
          buildSubAspecto('Comunicaciones oficiales', 'C_7_'),
        ]
      },
      pres: {
        global: this.calculateByPrefix('C_8_'),
        subAspectos: [
          buildSubAspecto('Condiciones de edificios y locales', 'C_8_1_'),
          buildSubAspecto('Unidades de conservación', 'C_8_2_'),
          buildSubAspecto('Condiciones ambientales', 'C_8_3_'),
          buildSubAspecto('Mantenimiento', 'C_8_4_'),
          buildSubAspecto('Seguridad y emergencias', 'C_8_5_'),
        ]
      }
    };
  }
}
