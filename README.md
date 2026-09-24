# Business Audit App — Auditor Empresarial Inteligente

Plataforma inteligente de auditoría, diagnóstico y formulación de planes de negocio estructurada conforme a la **Guía Oficial Institucional de Emprendimiento (Plan Modelo de Negocio 2025)** y modelos de proyección presupuestal en Excel.

---

## 🚀 Características Principales

1. **Detección Automática de Mercado & Sector Económico:**
   - Clasificación semántica instantánea entre 6 industrias clave:
     - 💻 **Tecnología, SaaS, FinTech & Software**
     - 🛍️ **Comercio, Retail, E-Commerce & Distribución**
     - 💼 **Servicios Profesionales, Consultoría & Salud**
     - 🏭 **Manufactura, Alimentos & Producción Industrial**
     - 🌱 **Agroindustria, Ganadería & Sostenibilidad**
     - 🍽️ **Gastronomía, Turismo & Experiencias**
   - Calibración dinámica de rúbricas, normativas y requisitos según el sector identificado.

2. **Diagnóstico Estratégico de Misión (4 Pilares Institucionales):**
   - Evaluación rigurosa de los 4 postulados obligatorios:
     - *¿Quiénes somos?* (Identidad / Tipo de empresa)
     - *¿Qué hacemos?* (Problema de mercado o solución provista)
     - *¿Para quién?* (Público objetivo y segmento de clientes)
     - *¿Cómo / Distingo?* (Mecanismo tecnológico, metodología o ventaja competitiva)
   - Calificación numérica (0 a 100), diagnóstico cualitativo y **Redacción Optimizada con IA** lista para copiar o aplicar.

3. **Evaluación de la Visión Estratégica:**
   - Verificación de horizonte temporal explícito (año meta).
   - Aspiración de liderazgo y posicionamiento sectorial.
   - Delimitación del ámbito territorial (local, regional, nacional o de exportación).

4. **Matriz DOFA Estratégica Cruzada (Sección 5.6):**
   - Cuadrantes internos y externos (Fortalezas, Oportunidades, Debilidades, Amenazas) con niveles de impacto.
   - Formulación de las 4 estrategias cruzadas institucionales:
     - **FO (Estrategias Ofensivas)**: Usar fortalezas para aprovechar oportunidades.
     - **DO (Estrategias de Adaptación)**: Superar debilidades aprovechando oportunidades.
     - **FA (Estrategias Defensivas)**: Usar fortalezas para mitigar amenazas.
     - **DA (Estrategias de Supervivencia)**: Minimizar debilidades y evitar amenazas.

5. **Auditoría Modular de los 9 Capítulos:**
   - Diagnóstico detallado con retroalimentación clara:
     - 🟢 *Esta parte está bien (Puntos Fuertes)*
     - 🟡 *Qué podemos mejorar (Recomendaciones de Formulación)*
   - Cobertura total de los 9 módulos: Justificación, Producto/Servicio, Mercadotecnia, Aspectos Técnicos, Aspectos Organizacionales, Módulo Legal, RSE, Aspectos Ambientales y Estudio Financiero 12M.

6. **Ingesta Inteligente de Documentos (Word & Excel):**
   - Soporte para arrastrar archivos `.docx` (Word) y `.xlsx` (Excel).
   - Extracción automática de hojas presupuestales (Flujo de Caja, Punto de Equilibrio, Nómina, Inversión).

7. **Dossier Ejecutivo Imprimible:**
   - Modal de impresión y descarga directa a PDF con maquetación ejecutiva.

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 + TypeScript
- **Estilos**: Tailwind CSS + CSS Moderno
- **Iconografía**: Lucide React
- **Procesamiento de Documentos**:
  - `mammoth`: Extracción y parseo de texto desde archivos Microsoft Word (`.docx`).
  - `xlsx`: Lectura y validación de hojas de cálculo del modelo financiero (`.xlsx`).

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar bundle de producción
npm run start
```

Abre [http://localhost:3000](http://localhost:3000) (o el puerto configurado) en tu navegador.

---

## ☁️ Despliegue en Vercel

Este proyecto está optimizado y 100% listo para desplegarse en **Vercel** con un solo clic:

1. Ingresa a tu cuenta de [Vercel](https://vercel.com).
2. Haz clic en **"Add New Project"** e importa el repositorio:
   ```
   pipejack2002-alt/business-audit-app
   ```
3. Parámetros de configuración:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `next build` o `npm run build`
   - **Output Directory**: `.next` (automático)
   - **Node.js Version**: 20.x o superior
4. Haz clic en **"Deploy"**.
5. ¡Listo! Vercel compilará la aplicación y te generará una URL pública segura (`.vercel.app`).
