/**
 * Configuración base del formulario multi-step con SurveyJS
 * Esta configuración puede ser modificada para agregar más pasos y campos
 */

export const surveyJson = {
  title: "Formulario Multi-Step",
  description: "Complete el siguiente formulario paso a paso",
  logoPosition: "right",
  showProgressBar: "top",
  progressBarType: "buttons",
  showQuestionNumbers: "off",
  completeText: "Enviar",
  completedHtml: "<h3>¡Gracias por completar el formulario!</h3>",
  
  pages: [
    {
      name: "page1",
      title: "Paso 1: Información Personal",
      description: "Por favor, proporcione su información personal básica",
      elements: [
        {
          type: "text",
          name: "firstName",
          title: "Nombre",
          isRequired: true,
          validators: [
            {
              type: "text",
              minLength: 2,
              maxLength: 50,
              text: "El nombre debe tener entre 2 y 50 caracteres"
            }
          ]
        },
        {
          type: "text",
          name: "lastName",
          title: "Apellido",
          isRequired: true,
          validators: [
            {
              type: "text",
              minLength: 2,
              maxLength: 50,
              text: "El apellido debe tener entre 2 y 50 caracteres"
            }
          ]
        },
        {
          type: "text",
          name: "age",
          title: "Edad",
          inputType: "number",
          isRequired: true,
          validators: [
            {
              type: "numeric",
              minValue: 18,
              maxValue: 120,
              text: "La edad debe estar entre 18 y 120 años"
            }
          ]
        },
        {
          type: "dropdown",
          name: "gender",
          title: "Género",
          isRequired: true,
          choices: [
            { value: "male", text: "Masculino" },
            { value: "female", text: "Femenino" },
            { value: "other", text: "Otro" },
            { value: "prefer_not_say", text: "Prefiero no decir" }
          ]
        }
      ]
    },
    {
      name: "page2",
      title: "Paso 2: Información de Contacto",
      description: "Proporcione sus datos de contacto",
      elements: [
        {
          type: "text",
          name: "email",
          title: "Correo Electrónico",
          inputType: "email",
          isRequired: true,
          validators: [
            {
              type: "email",
              text: "Por favor, ingrese un correo electrónico válido"
            }
          ]
        },
        {
          type: "text",
          name: "phone",
          title: "Teléfono",
          inputType: "tel",
          isRequired: true,
          validators: [
            {
              type: "regex",
              regex: "^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$",
              text: "Por favor, ingrese un número de teléfono válido"
            }
          ]
        },
        {
          type: "text",
          name: "address",
          title: "Dirección",
          isRequired: false
        },
        {
          type: "text",
          name: "city",
          title: "Ciudad",
          isRequired: true
        },
        {
          type: "text",
          name: "country",
          title: "País",
          isRequired: true
        }
      ]
    },
    {
      name: "page3",
      title: "Paso 3: Preferencias",
      description: "Cuéntenos sobre sus preferencias",
      elements: [
        {
          type: "checkbox",
          name: "interests",
          title: "Áreas de Interés",
          isRequired: true,
          choices: [
            { value: "technology", text: "Tecnología" },
            { value: "sports", text: "Deportes" },
            { value: "music", text: "Música" },
            { value: "art", text: "Arte" },
            { value: "travel", text: "Viajes" },
            { value: "food", text: "Gastronomía" }
          ],
          validators: [
            {
              type: "answercount",
              minCount: 1,
              text: "Por favor, seleccione al menos una opción"
            }
          ]
        },
        {
          type: "radiogroup",
          name: "contactPreference",
          title: "¿Cómo prefiere ser contactado?",
          isRequired: true,
          choices: [
            { value: "email", text: "Correo Electrónico" },
            { value: "phone", text: "Teléfono" },
            { value: "sms", text: "SMS" }
          ]
        },
        {
          type: "boolean",
          name: "newsletter",
          title: "¿Desea recibir nuestro boletín informativo?",
          isRequired: false,
          defaultValue: false
        }
      ]
    },
    {
      name: "page4",
      title: "Paso 4: Comentarios Adicionales",
      description: "Información adicional (opcional)",
      elements: [
        {
          type: "comment",
          name: "comments",
          title: "Comentarios o Sugerencias",
          isRequired: false,
          rows: 5,
          placeholder: "Escriba aquí cualquier comentario adicional..."
        },
        {
          type: "rating",
          name: "satisfaction",
          title: "¿Qué tan satisfecho está con este formulario?",
          isRequired: false,
          rateMin: 1,
          rateMax: 5,
          minRateDescription: "Muy insatisfecho",
          maxRateDescription: "Muy satisfecho"
        }
      ]
    }
  ],
  
  showPrevButton: true,
  firstPageIsStarted: false,
  startSurveyText: "Comenzar",
  pagePrevText: "Anterior",
  pageNextText: "Siguiente",
  completeText: "Finalizar"
};

export default surveyJson;
