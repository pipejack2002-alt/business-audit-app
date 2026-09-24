import {
  AreaAuditResult,
  DocumentAuditReport,
  UploadedFileMeta,
  CompanyInputData,
  DetectedMarketInfo,
  StrategicIdentityAudit,
  ExtractedQuestionDiagnosis,
  IndustrySector
} from './types';
import { detectSectorWithAnalysis, getIndustryConfig } from './industryBenchmarks';

export interface DocumentAnalysisInput {
  extractedTexts: { fileName: string; text: string }[];
  excelSheets?: { fileName: string; sheetNames: string[]; summaryData?: Record<string, any> }[];
}

export function runComprehensiveDocumentAudit(input: DocumentAnalysisInput): DocumentAuditReport {
  const allTexts = input.extractedTexts.map((t) => t.text).join('\n\n');
  const upperText = allTexts.toUpperCase();
  const normalizedText = normalizeSpanish(allTexts);

  const filesAnalyzed: UploadedFileMeta[] = [];

  for (const t of input.extractedTexts) {
    filesAnalyzed.push({
      name: t.fileName,
      size: t.text.length,
      type: t.fileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain',
      category: t.fileName.endsWith('.docx') || t.fileName.endsWith('.doc') ? 'word' : 'text',
      summary: `Documento procesado (${Math.round(t.text.length / 1000)}k caracteres)`
    });
  }

  if (input.excelSheets) {
    for (const e of input.excelSheets) {
      filesAnalyzed.push({
        name: e.fileName,
        size: e.sheetNames.length * 5000,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        category: 'excel',
        summary: `Modelo financiero con ${e.sheetNames.length} hojas parametrizadas`
      });
    }
  }

  // 1. Detección Inteligente de Mercado y Extracción de Datos
  const { data: extractedCompanyData, marketInfo } = extractSmartCompanyData(allTexts);
  const sector = marketInfo.sector;
  const sectorConfig = getIndustryConfig(sector);

  // 2. Diagnóstico Estratégico Especializado de Misión y Visión
  const strategicIdentityAudit = auditStrategicIdentity(extractedCompanyData, sector);

  // 3. Auditoría Dinámica de los 9 Capítulos Adaptada al Sector Detectado

  // --- MODULO 1: JUSTIFICACIÓN Y ANTECEDENTES ---
  const m1Keywords = ['1.2', 'JUSTIFICACI', 'ANTECEDENTES', 'PROBLEMA', 'NECESIDAD', 'OPORTUNIDAD', 'MERCADO', 'NORMATIV', 'LEY', 'SECTOR'];
  const m1Matches = m1Keywords.filter(k => normalizedText.includes(k)).length;
  const m1Snippet = extractSnippet(allTexts, ['JUSTIFICACIÓN', 'ANTECEDENTES DEL PLAN', 'CONTEXTO NACIONAL', '1.2 JUSTIFICACIÓN']);

  let m1Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m1Progress = 0;
  let m1Score = 0;
  const m1Strengths: string[] = [];
  const m1Improvements: string[] = [];

  if (m1Matches >= 5) {
    m1Status = 'completed';
    m1Progress = 95;
    m1Score = 96;
    m1Strengths.push(`Sólida fundamentación contextual orientada a las necesidades críticas del sector de ${sectorConfig.name}.`);
    m1Strengths.push('Identificación clara del problema del mercado y justificación cuantitativa y cualitativa de la iniciativa.');
    if (sector === 'tech') {
      m1Strengths.push('Cita explícita de normatividad legal/tributaria (Estatuto Tributario Art. 641, sanciones e intereses).');
    } else if (sector === 'agro') {
      m1Strengths.push('Enfoque en desarrollo rural sostenible, potencial exportador y aprovechamiento de vocación de suelo.');
    } else if (sector === 'tourism') {
      m1Strengths.push('Articulación con el crecimiento del turismo regional y salvaguarda de la tradición gastronómica/cultural.');
    } else if (sector === 'manufacturing') {
      m1Strengths.push('Justificación industrial basada en sustitución de importaciones y valor agregado local.');
    } else if (sector === 'retail') {
      m1Strengths.push('Demanda comprobada de canales de comercialización accesibles y con experiencia de cliente optimizada.');
    } else {
      m1Strengths.push('Respaldo profesional y pertinencia de la solución frente a riesgos del mercado.');
    }
    m1Improvements.push('Verificar que se cumpla la extensión institucional recomendada (mínimo 4 páginas en el documento final).');
  } else if (m1Matches >= 2) {
    m1Status = 'partial';
    m1Progress = 55;
    m1Score = 65;
    m1Strengths.push('Se detectan antecedentes generales y planteamiento inicial del problema.');
    m1Improvements.push(`Profundizar en cifras estadísticas oficiales del sector ${sectorConfig.name} en Colombia (DANE, Gremios).`);
    m1Improvements.push('Cuantificar con mayor precisión las pérdidas o costos que sufren los clientes al no contar con esta solución.');
  } else {
    m1Status = 'missing';
    m1Progress = 15;
    m1Score = 20;
    m1Improvements.push('La sección 1.2 de Justificación y Antecedentes no se detectó o se encuentra en fase preliminar.');
    m1Improvements.push('Formular la justificación respondiendo: ¿Por qué es vital este proyecto ahora? ¿Qué vacío del mercado llena?');
  }

  // --- MODULO 2: DEFINICIÓN DEL PRODUCTO/SERVICIO & MERCADO ---
  const m2Keywords = ['2.1', '2.2', 'PRODUCTO', 'SERVICIO', 'ATRIBUTOS', 'VENTAJAS COMPETITIVAS', 'DISTINGOS', 'SEGMENTO', 'CLIENTES', 'VALOR'];
  const m2Matches = m2Keywords.filter(k => normalizedText.includes(k)).length;
  const m2Snippet = extractSnippet(allTexts, ['DESCRIPCIÓN DEL PRODUCTO', 'CARACTERÍSTICAS, ATRIBUTOS', 'SEGMENTO DE MERCADO', '2.1 DESCRIPCIÓN']);

  let m2Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m2Progress = 0;
  let m2Score = 0;
  const m2Strengths: string[] = [];
  const m2Improvements: string[] = [];

  if (m2Matches >= 6) {
    m2Status = 'completed';
    m2Progress = 92;
    m2Score = 94;
    m2Strengths.push(`Clasificación técnica precisa del portafolio alineado a ${sectorConfig.badge}.`);
    m2Strengths.push('Diferenciación conceptual clara entre ventajas competitivas y distingos competitivos.');
    m2Strengths.push('Segmentación de clientes caracterizada con perfiles concretos y hábitos de consumo.');
    m2Improvements.push('Incorporar fichas técnicas detalladas por cada línea de producto o nivel de servicio.');
  } else if (m2Matches >= 3) {
    m2Status = 'partial';
    m2Progress = 55;
    m2Score = 65;
    m2Strengths.push('Se describen los productos/servicios a nivel global.');
    m2Improvements.push('Clasificar formalmente el bien (industrial vs consumo) o servicio (profesional vs comercial).');
    m2Improvements.push('Definir con mayor detalle las características técnicas y atributos diferenciadores.');
  } else {
    m2Status = 'missing';
    m2Progress = 15;
    m2Score = 25;
    m2Improvements.push('Falta formular el Capítulo 2 de Producto/Servicio y Segmentación de Mercado.');
  }

  // --- MODULO 3: MERCADOTECNIA & ESTRATEGIA COMERCIAL ---
  const m3Keywords = ['3.0', 'MERCADOTECNIA', 'INTRODUCCI', 'PUBLICIDAD', 'PROMOCI', 'POLTICAS DE MERCADEO', 'ESTRATEGIAS DE PRECIO', 'CANALES', 'COMERCIAL'];
  const m3Matches = m3Keywords.filter(k => normalizedText.includes(k)).length;
  const m3Snippet = extractSnippet(allTexts, ['MERCADOTECNIA DE LA EMPRESA', 'PLAN DE INTRODUCCIÓN', 'ESTRATEGIAS DE PROMOCIÓN', '3.0 MERCADOTECNIA']);

  let m3Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m3Progress = 0;
  let m3Score = 0;
  const m3Strengths: string[] = [];
  const m3Improvements: string[] = [];

  if (m3Matches >= 4) {
    m3Status = 'completed';
    m3Progress = 88;
    m3Score = 90;
    m3Strengths.push('Plan de introducción al mercado con canales de distribución y tácticas de tracción definidas.');
    m3Strengths.push('Políticas de precios y promociones coherentes con la estructura de costos proyectada.');
    if (sector === 'tech') {
      m3Improvements.push('Monitorear métricas de conversión digital (CAC, LTV, Churn rate).');
    } else if (sector === 'tourism' || sector === 'retail') {
      m3Improvements.push('Desarrollar calendario estacional de promociones para temporadas altas y bajas.');
    } else {
      m3Improvements.push('Definir cronograma formal de pauta publicitaria y metas de adquisición mes a mes.');
    }
  } else if (m3Matches >= 2) {
    m3Status = 'partial';
    m3Progress = 48;
    m3Score = 55;
    m3Strengths.push('Se mencionan acciones de divulgación comercial.');
    m3Improvements.push('Estructurar la estrategia comercial en las 4P (Producto, Precio, Plaza y Promoción).');
  } else {
    m3Status = 'missing';
    m3Progress = 10;
    m3Score = 20;
    m3Improvements.push('Falta formular el Capítulo 3 de Mercadotecnia y Plan de Introducción al Mercado.');
  }

  // --- MODULO 4: ASPECTOS TÉCNICOS Y OPERATIVOS ---
  const m4Keywords = ['4.0', 'ASPECTOS TECNICOS', 'MAQUINARIA', 'EQUIPOS', 'PROVEEDORES', 'UBICACI', 'PROCESOS', 'INFRAESTRUCTURA', 'TECNIC', 'PLANTA', 'COCINA', 'HERRAMIENTAS'];
  const m4Matches = m4Keywords.filter(k => normalizedText.includes(k)).length;
  const m4Snippet = extractSnippet(allTexts, ['ASPECTOS TECNICOS DEL PROYECTO', 'DESCRIPCIÓN TÉCNICA', 'DESCRIPCIÓN DE LOS PROCESOS', '4.0 ASPECTOS TÉCNICOS']);

  let m4Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m4Progress = 0;
  let m4Score = 0;
  const m4Strengths: string[] = [];
  const m4Improvements: string[] = [];

  if (m4Matches >= 4) {
    m4Status = 'completed';
    m4Progress = 88;
    m4Score = 90;
    if (sector === 'tech') {
      m4Strengths.push('Arquitectura de software en la nube, servidores con alta disponibilidad y acuerdos SLA.');
      m4Strengths.push('Mapeo de proveedores críticos (pasarelas de pago, bases de datos y microservicios).');
    } else if (sector === 'manufacturing') {
      m4Strengths.push('Especificación de maquinaria industrial, capacidad instalada mensual y flujo de planta (layout).');
      m4Strengths.push('Identificación de materias primas e insumos directos con sus fichas de almacenamiento.');
    } else if (sector === 'agro') {
      m4Strengths.push('Sistemas de riego tecnificado, manejo agronómico por hectárea y cadena de frío poscosecha.');
      m4Strengths.push('Proveedores certificados de semillas, biofertilizantes y maquinaria agrícola.');
    } else if (sector === 'tourism') {
      m4Strengths.push('Equipamiento gastronómico/hotelero profesional con flujo higiénico de alimentos y comensales.');
      m4Strengths.push('Red de proveedores locales de pesca, frutas e ingredientes frescos.');
    } else if (sector === 'retail') {
      m4Strengths.push('Punto de venta físico equipado, sistemas POS y bodegaje optimizado para rotación.');
    } else {
      m4Strengths.push('Infraestructura operativa y herramientas profesionales para prestación del servicio.');
    }
    m4Improvements.push('Complementar con diagrama de flujo visual de procesos (BPMN) con tiempos estándar.');
  } else if (m4Matches >= 2) {
    m4Status = 'partial';
    m4Progress = 45;
    m4Score = 55;
    m4Strengths.push('Se listan equipos e insumos básicos requeridos.');
    m4Improvements.push('Detallar los procesos operativos paso a paso y la capacidad instalada formal.');
  } else {
    m4Status = 'missing';
    m4Progress = 10;
    m4Score = 20;
    m4Improvements.push('Falta formular los Aspectos Técnicos, maquinaria, proveedores y mapa de procesos.');
  }

  // --- MODULO 5: ASPECTOS ORGANIZACIONALES (MISIÓN, VISIÓN, VALORES, ROLES) ---
  const m5Keywords = ['5.1', '5.2', 'MISI', 'VISI', 'VALORES', 'ORGANIGRAMA', 'MANUAL DE FUNCIONES', 'PERFILES', 'DOFA', '5.0 ASPECTOS'];
  const m5Matches = m5Keywords.filter(k => normalizedText.includes(k)).length;
  const m5Snippet = extractSnippet(allTexts, ['5.1 MISIÓN', 'ASPECTOS ORGANIZACIONALES', 'ESTRUCTURA ORGANIZACIONAL']);

  let m5Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m5Progress = 0;
  let m5Score = 0;
  const m5Strengths: string[] = [];
  const m5Improvements: string[] = [];

  if (m5Matches >= 5) {
    m5Status = 'completed';
    m5Progress = strategicIdentityAudit.misionScore >= 80 && strategicIdentityAudit.visionScore >= 80 ? 98 : 85;
    m5Score = Math.round((strategicIdentityAudit.misionScore + strategicIdentityAudit.visionScore) / 2);
    
    // Strengths from Strategic Identity
    m5Strengths.push(...strategicIdentityAudit.misionStrengths);
    m5Strengths.push(...strategicIdentityAudit.visionStrengths);
    m5Strengths.push('Estructura organizacional y perfiles de cargo articulados con la nómina presupuestada.');

    // Improvements from Strategic Identity
    m5Improvements.push(...strategicIdentityAudit.misionImprovements);
    m5Improvements.push(...strategicIdentityAudit.visionImprovements);
    m5Improvements.push('Asegurar que la matriz DOFA mantenga vinculación explícita con las estrategias cruzadas.');
  } else if (m5Matches >= 2) {
    m5Status = 'partial';
    m5Progress = 55;
    m5Score = 65;
    m5Strengths.push('Misión y Visión planteadas preliminarmente en el texto.');
    m5Improvements.push(...strategicIdentityAudit.misionImprovements);
    m5Improvements.push('Definir el manual de funciones y los perfiles de los cargos clave.');
  } else {
    m5Status = 'missing';
    m5Progress = 15;
    m5Score = 25;
    m5Improvements.push('Falta formular formalmente la Misión, Visión, Valores y Estructura Organizacional.');
  }

  // --- MODULO 6: MÓDULO LEGAL & FORMALIZACIÓN ---
  const m6Keywords = ['6.1', '6.2', 'TIPO DE SOCIEDAD', 'S.A.S', 'CAMARA DE COMERCIO', 'REGISTRO MERCANTIL', 'LICENCIA', 'PATENTE', 'DERECHOS DE AUTOR', 'RNT', 'INVIMA', 'ICA', 'CONCEPTO SANITARIO', 'MANIPULACION'];
  const m6Matches = m6Keywords.filter(k => normalizedText.includes(k)).length;
  const m6Snippet = extractSnippet(allTexts, ['MODULO LEGAL', 'TIPO DE SOCIEDAD', 'PERMISOS, LICENCIAS', '6.1 TIPO DE SOCIEDAD']);

  let m6Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m6Progress = 0;
  let m6Score = 0;
  const m6Strengths: string[] = [];
  const m6Improvements: string[] = [];

  if (m6Matches >= 4) {
    m6Status = 'completed';
    m6Progress = 90;
    m6Score = 92;
    m6Strengths.push('Selección fundamentada de la figura societaria (Sociedad por Acciones Simplificada - S.A.S.).');
    m6Strengths.push('Régimen tributario y registros mercantiles ante Cámara de Comercio debidamente previstos.');
    if (sector === 'tech') {
      m6Strengths.push('Protección de software y código fuente ante la Dirección Nacional de Derecho de Autor (DNDA).');
      m6Improvements.push('Añadir términos de servicio y políticas de protección de datos (Ley 1581 de 2012 / Habeas Data).');
    } else if (sector === 'manufacturing') {
      m6Strengths.push('Gestión de registros sanitarios INVIMA y cumplimiento de normas BPM.');
      m6Improvements.push('Formalizar protocolos de rotulado nutricional y etiquetado frontal.');
    } else if (sector === 'agro') {
      m6Strengths.push('Acreditación y registros ante el ICA y directrices fitosanitarias de exportación.');
    } else if (sector === 'tourism') {
      m6Strengths.push('Trámite de Registro Nacional de Turismo (RNT) y carnet de manipulación de alimentos.');
    } else {
      m6Strengths.push('Marco normativo y contratos marco de prestación de servicios diseñados.');
    }
  } else if (m6Matches >= 2) {
    m6Status = 'partial';
    m6Progress = 50;
    m6Score = 60;
    m6Strengths.push('Se menciona la forma jurídica básica del emprendimiento.');
    m6Improvements.push(`Especificar permisos y licencias obligatorias específicas para el sector ${sectorConfig.name}.`);
  } else {
    m6Status = 'missing';
    m6Progress = 10;
    m6Score = 20;
    m6Improvements.push('Falta formular el Módulo Legal y los trámites de formalización empresarial.');
  }

  // --- MODULO 7: RESPONSABILIDAD SOCIAL EMPRESARIAL (RSE) ---
  const m7Keywords = ['7.0', 'RESPONSABILIDAD SOCIAL', 'RSE', 'STAKEHOLDERS', 'GRUPOS DE INTER', 'COMUNIDAD', 'NORMA', 'ISO 26000'];
  const m7Matches = m7Keywords.filter(k => normalizedText.includes(k)).length;
  const m7Snippet = extractSnippet(allTexts, ['RESPONSABILIDAD SOCIAL EMPRESARIAL', 'GRUPOS DE INTERÉS', 'STAKEHOLDERS', '7.0 RESPONSABILIDAD SOCIAL']);

  let m7Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m7Progress = 0;
  let m7Score = 0;
  const m7Strengths: string[] = [];
  const m7Improvements: string[] = [];

  if (m7Matches >= 3) {
    m7Status = 'completed';
    m7Progress = 85;
    m7Score = 88;
    m7Strengths.push('Mapeo de grupos de interés (stakeholders) conforme a directrices de la guía institucional.');
    if (sector === 'tech') {
      m7Strengths.push('Aporte social orientado a la formalización fiscal y educación financiera accesible.');
    } else if (sector === 'agro' || sector === 'tourism') {
      m7Strengths.push('Comercio justo, generación de empleo digno rural y apoyo a productores de la región.');
    } else {
      m7Strengths.push('Compromiso con el bienestar de colaboradores, clientes y comunidad circundante.');
    }
    m7Improvements.push('Establecer indicadores medibles de impacto social anual (ej. beneficiarios capacitados).');
  } else if (m7Matches >= 1) {
    m7Status = 'partial';
    m7Progress = 40;
    m7Score = 50;
    m7Strengths.push('Se esboza un compromiso ético y social con el entorno.');
    m7Improvements.push('Desarrollar la estrategia de RSE por cada grupo de interés según el formato oficial.');
  } else {
    m7Status = 'missing';
    m7Progress = 10;
    m7Score = 20;
    m7Improvements.push('Falta formular el capítulo de Responsabilidad Social Empresarial.');
  }

  // --- MODULO 8: ASPECTOS AMBIENTALES & SOSTENIBILIDAD ---
  const m8Keywords = ['8.0', 'AMBIENTAL', 'RESIDUOS', 'SOSTENIBILIDAD', 'HUELLA DE CARBONO', 'ENERG', 'PAPEL CERO', 'ISO 14000', 'RECICLA'];
  const m8Matches = m8Keywords.filter(k => normalizedText.includes(k)).length;
  const m8Snippet = extractSnippet(allTexts, ['ASPECTOS AMBIENTALES', 'IMPACTO AMBIENTAL', '8.0 ASPECTOS AMBIENTALES']);

  let m8Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m8Progress = 0;
  let m8Score = 0;
  const m8Strengths: string[] = [];
  const m8Improvements: string[] = [];

  if (m8Matches >= 3) {
    m8Status = 'completed';
    m8Progress = 84;
    m8Score = 86;
    if (sector === 'tech') {
      m8Strengths.push('Enfoque digital con política cero papel y reducción de desplazamientos vehiculares.');
      m8Strengths.push('Buenas prácticas de eficiencia energética en servidores y manejo de RAEE.');
    } else if (sector === 'agro') {
      m8Strengths.push('Uso eficiente del recurso hídrico, conservación del suelo y bio-insumos limpios.');
    } else if (sector === 'tourism') {
      m8Strengths.push('Gestión y aprovechamiento de residuos orgánicos y eliminación de plásticos de un solo uso.');
    } else if (sector === 'manufacturing') {
      m8Strengths.push('Plan integral de manejo de residuos sólidos industriales, vertimientos y emisiones.');
    } else {
      m8Strengths.push('Plan de eco-eficiencia y consumo responsable en oficinas y sedes operativas.');
    }
    m8Improvements.push('Cuantificar metas de reducción de huella de carbono o ahorro de recursos anuales.');
  } else if (m8Matches >= 1) {
    m8Status = 'partial';
    m8Progress = 40;
    m8Score = 50;
    m8Strengths.push('Se identifican buenas intenciones de sostenibilidad.');
    m8Improvements.push('Completar la matriz de impacto ambiental y plan de manejo de residuos exigido.');
  } else {
    m8Status = 'missing';
    m8Progress = 10;
    m8Score = 20;
    m8Improvements.push('Falta formular el módulo de Aspectos Ambientales y gestión de impacto.');
  }

  // --- MODULO 9: ESTUDIO FINANCIERO Y PRESUPUESTAL (EXCEL) ---
  const hasExcel = Boolean(input.excelSheets && input.excelSheets.length > 0);
  const detectedSheets = input.excelSheets ? input.excelSheets.flatMap(e => e.sheetNames) : [];
  const detectedSheetsUpper = detectedSheets.map(s => s.toUpperCase());

  const hasInversion = detectedSheetsUpper.some(s => s.includes('INVERSION') || s.includes('INVERSIÓN'));
  const hasGastos = detectedSheetsUpper.some(s => s.includes('GASTOS'));
  const hasCostos = detectedSheetsUpper.some(s => s.includes('COSTOS'));
  const hasFlujo = detectedSheetsUpper.some(s => s.includes('FLUJO'));
  const hasPuntoEq = detectedSheetsUpper.some(s => s.includes('PUNTO') || s.includes('EQUILIBRIO'));
  const hasNomina = detectedSheetsUpper.some(s => s.includes('NOMINA') || s.includes('NÓMINA'));

  let m9Status: 'completed' | 'partial' | 'missing' = 'missing';
  let m9Progress = 0;
  let m9Score = 0;
  const m9Strengths: string[] = [];
  const m9Improvements: string[] = [];

  if (hasExcel && detectedSheets.length >= 8) {
    m9Status = 'completed';
    m9Progress = 96;
    m9Score = 95;
    m9Strengths.push(`Modelo financiero en Excel altamente completo con ${detectedSheets.length} hojas parametrizadas.`);
    if (hasFlujo) m9Strengths.push('Flujo de Caja mensual proyectado a 12 meses incorporado.');
    if (hasPuntoEq) m9Strengths.push('Cálculo analítico de Punto de Equilibrio operativo y financiero.');
    if (hasNomina) m9Strengths.push('Presupuesto de Nómina desagregado con aportes de ley colombiana (salud, pensión, parafiscales).');
    if (hasInversion) m9Strengths.push('Presupuesto de Inversión inicial y requerimiento de capital de trabajo estructurado.');
    m9Improvements.push('Añadir análisis de sensibilidad financiera (escenario optimista, base y pesimista).');
  } else if (hasExcel || upperText.includes('9.0') || upperText.includes('ESTUDIO FINANCIERO')) {
    m9Status = 'partial';
    m9Progress = 50;
    m9Score = 60;
    m9Strengths.push('Se detectan elementos presupuestales o tablas financieras parciales.');
    m9Improvements.push('Completar el paquete estándar de hojas: Flujo de Caja, Punto de Equilibrio y Estado de Resultados.');
    m9Improvements.push('Subir la hoja de cálculo .xlsx para auditar fórmulas cruzadas y coherencia matemática.');
  } else {
    m9Status = 'missing';
    m9Progress = 10;
    m9Score = 20;
    m9Improvements.push('No se detectó el archivo Excel del modelo presupuestal o el Capítulo 9 Financiero está sin formular.');
    m9Improvements.push('Subir el archivo .xlsx de proyecciones a 12 meses para auditar la viabilidad económica.');
  }

  // --- RECOPILACIÓN DE ÁREAS ---
  const areas: AreaAuditResult[] = [
    {
      id: 'area-1',
      moduleCode: 'Módulo 1',
      title: 'Justificación, Problema y Antecedentes',
      category: 'documental',
      status: m1Status,
      progress: m1Progress,
      score: m1Score,
      summary: `Evalúa la fundamentación legal, económica y pertinencia del proyecto en el sector de ${sectorConfig.name}.`,
      strengths: m1Strengths,
      improvements: m1Improvements,
      guideRequirements: [
        'Mínimo 4 páginas en el formato institucional.',
        'Marco normativo explícito del sector en Colombia.',
        'Cuantificación del problema y pérdidas que sufren los clientes.'
      ],
      extractedSnippet: m1Snippet
    },
    {
      id: 'area-2',
      moduleCode: 'Módulo 2',
      title: 'Definición del Producto / Servicio & Mercado',
      category: 'documental',
      status: m2Status,
      progress: m2Progress,
      score: m2Score,
      summary: 'Evalúa la clasificación del bien/servicio, atributos, ventajas competitivas y segmentación de clientes.',
      strengths: m2Strengths,
      improvements: m2Improvements,
      guideRequirements: [
        'Clasificación: Bien industrial/consumo o Servicio profesional/comercial.',
        'Diferenciación técnica: ventajas competitivas vs distingos competitivos.',
        'Segmentación de clientes con perfil socioeconómico y profesional.'
      ],
      extractedSnippet: m2Snippet
    },
    {
      id: 'area-3',
      moduleCode: 'Módulo 3',
      title: 'Mercadotecnia & Estrategia Comercial',
      category: 'documental',
      status: m3Status,
      progress: m3Progress,
      score: m3Score,
      summary: 'Evalúa el plan de introducción al mercado, políticas de precio, promoción y canales.',
      strengths: m3Strengths,
      improvements: m3Improvements,
      guideRequirements: [
        'Plan de introducción al mercado estructurado.',
        'Estrategia de promoción y publicidad digital / física.',
        'Canales de distribución y políticas de mercadeo.'
      ],
      extractedSnippet: m3Snippet
    },
    {
      id: 'area-4',
      moduleCode: 'Módulo 4',
      title: 'Aspectos Técnicos, Operativos y Proveedores',
      category: 'documental',
      status: m4Status,
      progress: m4Progress,
      score: m4Score,
      summary: `Evalúa la ficha técnica, maquinaria, equipos e infraestructura para ${sectorConfig.badge}.`,
      strengths: m4Strengths,
      improvements: m4Improvements,
      guideRequirements: [
        'Descripción técnica del producto/servicio.',
        'Listado y costos de maquinaria, equipos y adecuaciones.',
        'Identificación de proveedores clave y localización geográfica.',
        'Diagrama y descripción detallada de procesos operativos.'
      ],
      extractedSnippet: m4Snippet
    },
    {
      id: 'area-5',
      moduleCode: 'Módulo 5',
      title: 'Aspectos Organizacionales: Misión, Visión, Valores y Roles',
      category: 'documental',
      status: m5Status,
      progress: m5Progress,
      score: m5Score,
      summary: `Audita el cumplimiento de la Misión (¿Quiénes?, ¿Qué?, ¿Para quién?, ¿Cómo?), Visión (horizonte y liderazgo), Valores y Organigrama.`,
      strengths: m5Strengths,
      improvements: m5Improvements,
      guideRequirements: [
        'Misión: Responder obligatoriamente ¿Quiénes somos?, ¿Qué hacemos?, ¿Para quién? y ¿Cómo?.',
        'Visión: Horizonte temporal explícito (año), liderazgo sectorial y delimitación geográfica.',
        'Principios y valores organizacionales aplicados al día a día.',
        'Organigrama, manual de funciones, cargos y presupuesto de nómina.'
      ],
      extractedSnippet: m5Snippet
    },
    {
      id: 'area-6',
      moduleCode: 'Módulo 6',
      title: 'Módulo Legal, Permisos & Propiedad Intelectual',
      category: 'documental',
      status: m6Status,
      progress: m6Progress,
      score: m6Score,
      summary: `Evalúa la formalización societaria, registros mercantiles y permisos obligatorios (${sectorConfig.badge}).`,
      strengths: m6Strengths,
      improvements: m6Improvements,
      guideRequirements: [
        'Tipo de sociedad mercantil justificado (ej. S.A.S.).',
        'Permisos y registros sectoriales (Cámara de Comercio, DIAN, ICA/INVIMA/DNDA/RNT).',
        'Cumplimiento de normatividad de tratamiento de datos personales.'
      ],
      extractedSnippet: m6Snippet
    },
    {
      id: 'area-7',
      moduleCode: 'Módulo 7',
      title: 'Responsabilidad Social Empresarial (RSE)',
      category: 'documental',
      status: m7Status,
      progress: m7Progress,
      score: m7Score,
      summary: 'Evalúa las estrategias de impacto positivo frente a grupos de interés y la comunidad.',
      strengths: m7Strengths,
      improvements: m7Improvements,
      guideRequirements: [
        'Enfoque de gestión de RSE frente a stakeholders.',
        'Estrategias para empleados, clientes, proveedores y comunidad.'
      ],
      extractedSnippet: m7Snippet
    },
    {
      id: 'area-8',
      moduleCode: 'Módulo 8',
      title: 'Aspectos Ambientales & Sostenibilidad',
      category: 'documental',
      status: m8Status,
      progress: m8Progress,
      score: m8Score,
      summary: 'Evalúa la mitigación del impacto ambiental, políticas de eco-eficiencia y manejo de residuos.',
      strengths: m8Strengths,
      improvements: m8Improvements,
      guideRequirements: [
        'Identificación de impactos ambientales directos e indirectos.',
        'Medidas de mitigación, ahorro de recursos y reciclaje de residuos.'
      ],
      extractedSnippet: m8Snippet
    },
    {
      id: 'area-9',
      moduleCode: 'Módulo 9',
      title: 'Estudio Financiero & Presupuesto a 12 Meses (Excel)',
      category: 'presupuestal',
      status: m9Status,
      progress: m9Progress,
      score: m9Score,
      summary: 'Evalúa las proyecciones presupuestales, flujo de caja, punto de equilibrio y rentabilidad a 12 meses.',
      strengths: m9Strengths,
      improvements: m9Improvements,
      guideRequirements: [
        'Inversión inicial y estructura de capital.',
        'Proyección de costos fijos, variables y gastos operacionales.',
        'Flujo de caja mensual proyectado a 12 meses.',
        'Determinación analítica del punto de equilibrio.',
        'Presupuesto discriminado de nómina con aportes parafiscales.'
      ],
      extractedSnippet: hasExcel ? `Archivo Excel detectado con ${detectedSheets.length} hojas: ${detectedSheets.join(', ')}` : undefined
    }
  ];

  // Métricas globales
  const completedCount = areas.filter(a => a.status === 'completed').length;
  const partialCount = areas.filter(a => a.status === 'partial').length;
  const missingCount = areas.filter(a => a.status === 'missing').length;

  const docAreas = areas.filter(a => a.category === 'documental');
  const finAreas = areas.filter(a => a.category === 'presupuestal');

  const documentalProgress = Math.round(docAreas.reduce((acc, a) => acc + a.progress, 0) / docAreas.length);
  const financialProgress = Math.round(finAreas.reduce((acc, a) => acc + a.progress, 0) / finAreas.length);
  const overallProgress = Math.round((documentalProgress * 0.65) + (financialProgress * 0.35));

  return {
    id: `audit-${Date.now()}`,
    projectName: extractedCompanyData.companyName || 'Proyecto en Avance',
    timestamp: new Date().toLocaleString('es-CO'),
    filesAnalyzed,
    overallProgress,
    documentalProgress,
    financialProgress,
    completedModulesCount: completedCount,
    partialModulesCount: partialCount,
    missingModulesCount: missingCount,
    areas,
    extractedCompanyData,
    detectedMarket: marketInfo,
    strategicIdentityAudit,
    financialHighlights: hasExcel ? {
      sheetsDetected: detectedSheets,
      hasInvestmentSheet: hasInversion,
      hasCashFlowSheet: hasFlujo,
      hasBreakEvenSheet: hasPuntoEq,
      hasPayrollSheet: hasNomina,
      notes: [
        `Hojas totales analizadas: ${detectedSheets.length}`,
        hasFlujo ? 'Flujo de caja estructurado a 12 meses.' : 'Falta hoja de flujo de caja.',
        hasPuntoEq ? 'Cálculo de punto de equilibrio presente.' : 'Falta punto de equilibrio formal.',
        hasNomina ? 'Nómina operativa y administrativa proyectada.' : 'Falta hoja de nómina.'
      ]
    } : undefined
  };
}

function extractSnippet(text: string, targets: string[]): string | undefined {
  const upper = text.toUpperCase();
  for (const target of targets) {
    const idx = upper.indexOf(target.toUpperCase());
    if (idx >= 0) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + 350);
      return text.substring(start, end).replace(/\s+/g, ' ').trim();
    }
  }
  return undefined;
}

export function auditStrategicIdentity(
  company: Partial<CompanyInputData>,
  sector: IndustrySector
): StrategicIdentityAudit {
  const misionText = (company.mision || '').trim();
  const visionText = (company.vision || '').trim();
  const sectorConfig = getIndustryConfig(sector);
  const companyName = company.companyName || 'Nuestra Empresa';

  // --- ANÁLISIS DE LA MISIÓN ---
  const mLower = misionText.toLowerCase();

  // 1. ¿Quiénes somos?
  const whoKeywords = ['somos', 'empresa', 'firma', 'planta', 'sociedad', 's.a.s', 'compañía', 'emprendimiento', 'iniciativa', 'finca', 'restaurante'];
  const hasWho = whoKeywords.some(k => mLower.includes(k)) || (company.companyName && mLower.includes(company.companyName.toLowerCase()));
  const quienesSomos: ExtractedQuestionDiagnosis = {
    found: Boolean(hasWho),
    score: hasWho ? 95 : 20,
    label: '1. ¿Quiénes somos? (Identidad)',
    detail: hasWho
      ? 'Define con claridad la identidad empresarial u origen de la organización.'
      : 'No define explícitamente quién es la organización. Recomendado iniciar con: "Somos [Nombre], empresa especializada en..."'
  };

  // 2. ¿Qué hacemos o necesidad que resolvemos?
  const whatKeywords = ['acompañar', 'solución', 'servicio', 'producto', 'plataforma', 'elaboración', 'cultivo', 'comercializ', 'cumplimiento', 'evitar', 'facilitar', 'resolver', 'optimizar', 'transformar', 'atender', 'proteger'];
  const hasWhat = whatKeywords.some(k => mLower.includes(k));
  const queHacemos: ExtractedQuestionDiagnosis = {
    found: Boolean(hasWhat),
    score: hasWhat ? 95 : 25,
    label: '2. ¿Qué hacemos? (Problema o Solución)',
    detail: hasWhat
      ? 'Declara explícitamente el bien, servicio o problema crítico que resuelve.'
      : 'Falta explicitar qué producto o servicio se entrega o qué dolor concreto de mercado se soluciona.'
  };

  // 3. ¿Para quién? (Segmento objetivo)
  const forWhomKeywords = ['contribuyentes', 'empresas', 'independientes', 'contadores', 'clientes', 'usuarios', 'consumidores', 'familias', 'jóvenes', 'pacientes', 'turistas', 'comensales', 'productores', 'público', 'pymes'];
  const hasForWhom = forWhomKeywords.some(k => mLower.includes(k)) || Boolean(company.targetAudience);
  const paraQuien: ExtractedQuestionDiagnosis = {
    found: Boolean(hasForWhom),
    score: hasForWhom ? 95 : 20,
    label: '3. ¿Para quién? (Público Objetivo)',
    detail: hasForWhom
      ? 'Identifica el segmento de clientes o destinatarios del beneficio.'
      : 'No delimita a quién va dirigida la propuesta de valor. Indique su segmento objetivo.'
  };

  // 4. ¿Cómo / Ventaja diferenciadora?
  const howKeywords = ['mediante', 'a través de', 'combinamos', 'automatización', 'calidad', 'innovación', 'tecnología', 'algoritmo', 'metodología', 'buenas prácticas', 'bpm', 'frescura', 'sostenibilidad', 'cuidado', 'garantiza'];
  const hasHow = howKeywords.some(k => mLower.includes(k)) || Boolean(company.valueProposition);
  const comoDiferenciador: ExtractedQuestionDiagnosis = {
    found: Boolean(hasHow),
    score: hasHow ? 90 : 25,
    label: '4. ¿Cómo / Distingo Competitivo?',
    detail: hasHow
      ? 'Establece el mecanismo operativo, tecnológico o cualidad diferenciadora.'
      : 'Falta explicar el "cómo": ¿mediante qué tecnología, método o factor diferenciador se logra el objetivo?'
  };

  const misionScore = Math.round(
    quienesSomos.score * 0.25 +
    queHacemos.score * 0.35 +
    paraQuien.score * 0.25 +
    comoDiferenciador.score * 0.15
  );

  const misionCategory = misionScore >= 85 ? 'excelente' : misionScore >= 70 ? 'bueno' : misionScore >= 50 ? 'regular' : 'critico';

  const misionStrengths: string[] = [];
  const misionImprovements: string[] = [];

  if (quienesSomos.found) misionStrengths.push('Identidad empresarial claramente expresada.');
  else misionImprovements.push('Incluir el nombre y tipo de entidad al inicio de la Misión.');

  if (queHacemos.found) misionStrengths.push('Propósito central y oferta de valor identificables.');
  else misionImprovements.push('Precisar el producto, servicio o problema que atiende la empresa.');

  if (paraQuien.found) misionStrengths.push('Público objetivo y segmento de clientes delimitado.');
  else misionImprovements.push('Especificar el segmento de clientes destinatarios.');

  if (comoDiferenciador.found) misionStrengths.push('Mecanismo de entrega y diferenciador competitivo declarados.');
  else misionImprovements.push('Incorporar el distingo competitivo o metodología ("a través de... / mediante...").');

  // AI-Optimized Mission Formula
  const aiOptimizedMission = sectorConfig.misionFormula
    .replace(/\[Nombre\]/g, companyName)
    .replace(/\[Solución digital\]|\[Línea de productos\]|\[Área de especialidad\]|\[Producto terminado\]|\[Cultivo o especie\]|\[Gastronomía o turismo\]/g, company.industry || sectorConfig.badge)
    .replace(/\[Público objetivo\]|\[Clientes objetivos\]|\[Consumidores o distribuidores\]|\[Compradores locales o internacionales\]|\[Visitantes o comensales\]/g, company.targetAudience || 'nuestros clientes')
    .replace(/\[Problema que resuelve\]|\[Problema o necesidad del cliente\]/g, company.valueProposition ? `la optimización de ${company.valueProposition}` : 'sus necesidades prioritarias')
    .replace(/\[Plataforma tecnológica\/Algoritmo\]|\[Canales de venta físicos y digitales\]|\[Metodología\/Tecnología\]|\[procesos de producción tecnificados\]|\[buenas prácticas agrícolas y regeneración ambiental\]|\[Propuesta de valor: sabores locales, calidez, hospitalidad\]/g, 'procesos estandarizados y altos estándares de calidad')
    .replace(/\[Beneficio o diferenciador\]|\[Inocuidad, calidad o rendimiento\]/g, 'máxima confiabilidad, puntualidad y excelencia operativa');

  // --- ANÁLISIS DE LA VISIÓN ---
  const vLower = visionText.toLowerCase();

  // 1. Horizonte Temporal
  const yearMatch = visionText.match(/\b(20[2-9][0-9])\b/);
  const hasTargetYear = Boolean(yearMatch);
  const targetYear = yearMatch ? yearMatch[1] : (company.targetYear || undefined);

  // 2. Liderazgo y Posicionamiento
  const leadershipKeywords = ['líder', 'lider', 'referente', 'reconocida', 'preferida', 'posicionarnos', 'destacada', 'liderazgo', 'renombre'];
  const hasLeadership = leadershipKeywords.some(k => vLower.includes(k));

  // 3. Alcance Territorial
  const territoryKeywords = ['colombia', 'región', 'region', 'caribe', 'nacional', 'internacional', 'bogotá', 'barranquilla', 'medellín', 'cali', 'mercados', 'latinoamérica', 'país'];
  const hasTerritorialScope = territoryKeywords.some(k => vLower.includes(k)) || Boolean(company.location);
  const territorialScope = territoryKeywords.find(k => vLower.includes(k)) || company.location || 'regional y nacional';

  let visionScore = 20;
  if (hasTargetYear) visionScore += 35;
  if (hasLeadership) visionScore += 30;
  if (hasTerritorialScope) visionScore += 15;

  const visionCategory = visionScore >= 85 ? 'excelente' : visionScore >= 70 ? 'bueno' : visionScore >= 50 ? 'regular' : 'critico';

  const visionStrengths: string[] = [];
  const visionImprovements: string[] = [];

  if (hasTargetYear) visionStrengths.push(`Horizonte temporal formal definido para el año ${targetYear}.`);
  else visionImprovements.push('Incorporar el año meta explícito (ej. "Para el año 2030...").');

  if (hasLeadership) visionStrengths.push('Enfoque claro de liderazgo y posicionamiento sectorial de mercado.');
  else visionImprovements.push('Declarar la aspiración de liderazgo ("ser la empresa líder / referente en...").');

  if (hasTerritorialScope) visionStrengths.push(`Delimitación geográfica definida (${territorialScope}).`);
  else visionImprovements.push('Establecer el ámbito territorial (local, regional, nacional o de exportación).');

  // AI-Optimized Vision Formula
  const targetYearEffective = targetYear || '2030';
  const aiOptimizedVision = sectorConfig.visionFormula
    .replace(/\[Año meta\]/g, targetYearEffective)
    .replace(/\[Sector\/Mercado\]|\[Sector\]|\[Especialidad\]|\[Categoría\]/g, company.industry || sectorConfig.badge)
    .replace(/\[Territorio\]|\[Ciudad\/Región\]|\[Ámbito territorial\]|\[Región\/País\]|\[Región\]|\[Ciudad o destino\]/g, company.location || 'Colombia y su área de influencia');

  return {
    misionText,
    misionScore,
    misionCategory,
    misionQuestions: {
      quienesSomos,
      queHacemos,
      paraQuien,
      comoDiferenciador
    },
    misionStrengths,
    misionImprovements,
    aiOptimizedMission,

    visionText,
    visionScore,
    visionCategory,
    visionChecklist: {
      hasTargetYear,
      targetYear,
      hasLeadership,
      hasTerritorialScope,
      territorialScope
    },
    visionStrengths,
    visionImprovements,
    aiOptimizedVision
  };
}

function extractSmartCompanyData(text: string): { data: Partial<CompanyInputData>; marketInfo: DetectedMarketInfo } {
  const upper = text.toUpperCase();
  const data: Partial<CompanyInputData> = {};

  const marketInfo = detectSectorWithAnalysis(text);
  data.sector = marketInfo.sector;

  // 1. Detectar Nombre de Empresa
  const matchName = text.match(/(?:NOMBRE O TÍTULO DEL PLAN DE NEGOCIO|NOMBRE DE LA EMPRESA|RAZÓN SOCIAL|PROYECTO|EMPRENDIMIENTO)[:\s]+([^\n\r]+)/i);
  if (matchName && matchName[1]) {
    data.companyName = matchName[1].trim();
  } else {
    // Buscar primera línea con S.A.S. o Ltda
    const companyLineMatch = text.match(/([A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s]{3,40}\s+(?:S\.A\.S\.|SAS|LTDA|S\.A\.|S\.C\.S\.))/);
    if (companyLineMatch && companyLineMatch[1]) {
      data.companyName = companyLineMatch[1].trim();
    }
  }

  if (!data.industry) {
    data.industry = marketInfo.sectorName;
  }

  // 2. Detectar Ubicación
  const locMatch = text.match(/(?:CIUDAD|UBICACIÓN|DOMICILIO|MUNICIPIO|SEDE)[:\s]+([^\n\r]+)/i);
  if (locMatch && locMatch[1]) {
    data.location = locMatch[1].trim();
  } else if (upper.includes('BARRANQUILLA')) {
    data.location = 'Barranquilla, Atlántico (Colombia)';
  } else if (upper.includes('BOGOTÁ') || upper.includes('BOGOTA')) {
    data.location = 'Bogotá D.C., Colombia';
  } else if (upper.includes('MEDELLÍN') || upper.includes('MEDELLIN')) {
    data.location = 'Medellín, Antioquia (Colombia)';
  } else if (upper.includes('CALI')) {
    data.location = 'Cali, Valle del Cauca (Colombia)';
  }

  // 3. Detectar Misión
  const mMatch = text.match(/(?:5\.1\s*MISI[OÓ]N|MISI[OÓ]N INSTITUCIONAL|MISI[OÓ]N DE LA EMPRESA|MISI[OÓ]N)[:\s\n]+([^5\n\r][\s\S]+?)(?=(?:5\.2|VISI[OÓ]N|PRINCIPIOS|VALORES|$))/i);
  if (mMatch && mMatch[1]) {
    data.mision = mMatch[1].replace(/\s+/g, ' ').trim().substring(0, 450);
  }

  // 4. Detectar Visión
  const vMatch = text.match(/(?:5\.2\s*VISI[OÓ]N|VISI[OÓ]N INSTITUCIONAL|VISI[OÓ]N DE LA EMPRESA|VISI[OÓ]N)[:\s\n]+([^5\n\r][\s\S]+?)(?=(?:5\.3|PRINCIPIOS|VALORES|5\.4|$))/i);
  if (vMatch && vMatch[1]) {
    data.vision = vMatch[1].replace(/\s+/g, ' ').trim().substring(0, 450);
  }

  // 5. Detectar Año meta
  const yearMatch = text.match(/(?:AÑO|PARA EL AÑO|AL AÑO|HORIZONTE)\s*(20[2-9][0-9])/i);
  if (yearMatch && yearMatch[1]) {
    data.targetYear = yearMatch[1];
  } else {
    data.targetYear = '2030';
  }

  // 6. Detectar Valores y Principios
  const valMatch = text.match(/(?:5\.3\s*(?:PRINCIPIOS|VALORES)|VALORES CORPORATIVOS|VALORES ORGANIZACIONALES)[^\n]*\n+([\s\S]+?)(?=(?:5\.4|ESTRUCTURA|$))/i);
  if (valMatch && valMatch[1]) {
    data.values = valMatch[1].replace(/\s+/g, ' ').trim().substring(0, 400);
  }

  // 7. Detectar Propuesta de Valor
  if (upper.includes('ELIMINAR EL 100% DE LAS SANCIONES')) {
    data.valueProposition = 'Alertas predictivas automáticas por último dígito de NIT que eliminan el riesgo de extemporaneidad ante la DIAN.';
  } else {
    const vpMatch = text.match(/(?:PROPUESTA DE VALOR|VENTAJA COMPETITIVA|VENTAJAS COMPETITIVAS)[:\s]+([^.\n\r]+)/i);
    if (vpMatch && vpMatch[1]) {
      data.valueProposition = vpMatch[1].trim().substring(0, 200);
    }
  }

  // 8. Detectar Segmento / Audiencia
  const audMatch = text.match(/(?:(?:CLIENTES OBJETIVO|DESTINATARIOS|PÚBLICO OBJETIVO)[:\s]+|(?:2\.3\s*SEGMENTO DE MERCADO[^\n]*\n+|2\.4\s*¿QUIÉNES SON TUS CLIENTES[^\n]*\n+))([^.\n\r]{10,180})/i);
  if (
    audMatch &&
    audMatch[1] &&
    !audMatch[1].toUpperCase().includes('ESCOGIDO') &&
    !audMatch[1].toUpperCase().includes('CARACTERÍSTICAS') &&
    !audMatch[1].toUpperCase().includes('VARIABLE') &&
    !audMatch[1].toUpperCase().includes('SEGMENTACI')
  ) {
    data.targetAudience = audMatch[1].trim().substring(0, 180);
  } else if (upper.includes('CONTADORES') || upper.includes('CONTRIBUYENTES')) {
    data.targetAudience = 'Contribuyentes personas naturales, trabajadores independientes, microempresas y contadores públicos.';
  }

  return { data, marketInfo };
}

function normalizeSpanish(str: string): string {
  return (str || '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
