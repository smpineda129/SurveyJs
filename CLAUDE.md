# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev        # Start dev server (port 5173)
npm run build      # Production build
npm run lint       # ESLint
```

### Backend (Node.js + Express)
```bash
cd backend
npm install
npm run dev        # Start with nodemon (hot reload)
npm start          # Production server
```

### Docker (full stack)
```bash
docker-compose up --build   # Start all services
docker-compose down          # Stop services
```

### Environment Setup
Copy `backend/.env.example` to `backend/.env` and configure:
- `MONGODB_URI` — MongoDB Atlas connection string
- `PORT` — Backend port (default 5000)
- `FRONTEND_URL` — For CORS configuration

## Architecture Overview

This is a **GDI (Gestión Documental Inteligente)** platform — a monorepo with a React SPA frontend and an Express/MongoDB backend. There are no tests configured.

### Structure
```
frontend/src/
  App.jsx           # Route definitions (3 routes)
  pages/            # HomePage, SurveyPage, ResultsPage
  components/       # Layout, SurveyComponent
  config/           # Survey form definitions (3 instruments)
  services/api.js   # Centralized Axios API client
  theme/theme.js    # MUI theme (primary blue, secondary pink)

backend/src/
  server.js         # Express app init, middleware chain
  routes/           # survey.routes.js, surveyDefinition.routes.js
  controllers/      # Business logic (survey.controller.js)
  models/           # Mongoose schemas (Survey, SurveyDefinition)
  services/         # PPTX generation (pptx.service.js)
  middleware/       # Validation, error handling
  config/database.js
```

### Three Survey Instruments
Defined in `frontend/src/config/`. Each has fundamentally different scoring:

#### `surveyConfig.js` → `entidades_privadas` (Entidades Privadas)
- Questions named `X_X_X` (e.g., `1_1_1`, `6_2_3`)
- `radiogroup` choices are text strings: `"Cumple"` / `"Parcial"` / `"No cumple"`
- Score computed by hidden `expression` field `c_X_X_X` using SurveyJS `iif()`:
  - `"Cumple"` → full points, `"Parcial"` → half, `"No cumple"` → 0
- Each question may also have `X_X_X_detail` (conditional text) and `X_X_X_obs` (observations)
- Page-level totals: hidden `A_total`, `B_total`, `C_total` expressions
- Sections by page: I. Admin (1–4), II. Función Archivística (5–7), III. Preservación (8)

#### `EntidadesPublicasConfig.js` → `entidades_publicas` (Entidades Públicas)
- Questions named `A_X_X_X` (e.g., `A_1_1_1`, `A_2_3_5`)
- `radiogroup` choices have **numeric values as scores**: `{value: 1.42, text: "Cumple"}`, `{value: 0.71, text: "Cumple parcial"}`, `{value: 0, text: "No cumple"}`
- Some questions use 2-choice variants: `"Indica"` / `"No indica"`
- No hidden `expression` fields — the selected value IS the score
- Only `_obs` suffix for observations (no `_detail` fields)

#### `MGMAconfig.js` → `mgda` (MGDA)
- Questions named in UPPERCASE (e.g., `DIAGNOSTICO_SEL`, `POLITICA_GD_SEL`, `PINAR_SEL`)
- `dropdown` choices use **maturity scale values**: 0 (Inicial), 65 (Básico), 79 (Intermedio), 94 (Avanzado 1), 100 (Avanzado 2/Optimizado)
- Conditional `html` elements display the level name based on selected value
- Observations field named `PRODUCT_OBS` (not `_obs` suffix)
- Organized by: Category → Subcategory (panels) → Products (dropdown questions)
- Categories: Estratégico, Administración de Archivos, Procesos de la Gestión Documental

### Data Flow
```
SurveyJS form → SurveyComponent → api.js (Axios)
  → Express route → controller → Mongoose → MongoDB Atlas
  → Response → ResultsPage (charts, tables, PPTX download)
```

### Key API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/surveys` | Submit survey response |
| GET | `/api/surveys` | List surveys (paginated) |
| GET | `/api/surveys/stats` | Aggregated statistics |
| GET | `/api/surveys/:id/presentation` | Download PPTX |
| GET | `/api/survey-definitions/active` | Active form definition |

### Survey Schema
```js
{
  formType: 'entidades_publicas' | 'mgda' | 'entidades_privadas',
  surveyData: Object,   // Flexible — stores all form answers
  status: 'draft' | 'completed',
  completedAt: Date,
  metadata: { userAgent, ipAddress, sessionId }
}
```

### Frontend Tech Stack
- **SurveyJS** (`survey-core` + `survey-react-ui` v1.9.x) — form engine
- **Material UI 5** — component library
- **Tailwind CSS 3** — utility classes
- **React Router 6** — client routing
- **Axios** — HTTP client

### PPTX Generation
PPTX generation is **only implemented for `entidades_privadas`** (enforced at line 194 of `survey.controller.js`). The modular service lives in `backend/src/services/pptx/`:

```
calculators/diagnosticCalculator.js  # Scoring logic
config/institutionalStyles.js         # Slide styles
config/questionTitles.js              # Maps "1_1_1" → full question text
generators/staticSlides.js            # Fixed slides (portada, objetivos, etc.)
generators/dynamicSlides.js           # Data-driven slides (charts, tables)
generators/helpers.js                 # Date formatting, sanitization, recommendations
content/staticContent.js              # Static text content
```

`DiagnosticCalculator` groups questions into three sections:
- **admin** — prefixes `1_`, `2_`, `3_`, `4_` (Aspectos Administrativos)
- **func** — prefixes `5_`, `6_`, `7_` (Función Archivística)
- **pres** — prefix `8_` (Preservación)

Score formula: `(cumple + parcial * 0.5) / total * 100`

### Deployment
- Frontend: Vercel (`VITE_API_URL` env var points to backend)
- Backend: Render.com
- See `VERCEL_SETUP.md` and `DEPLOYMENT.md` for details
