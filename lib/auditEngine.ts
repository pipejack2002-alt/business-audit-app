import {
  CompanyInputData,
  BusinessAuditReport,
  SectionAuditResult,
  RubricCriterion,
  CoherenceAuditResult,
  AuditScoreCategory
} from './types';

// Helper to determine category from numeric score
function getCategory(score: number): AuditScoreCategory {
  if (score >= 85) return 'excelente';
  if (score >= 70) return 'bueno';
  if (score >= 50) return 'regular';
  return 'critico';
}

// Clean text
function clean(text: string): string {
  return (text || '').trim();
}

// Detect year in vision
function extractYear(text: string): number | null {
  const match = text.match(/\b(20[2-9][0-9])\b/);
  return match ? parseInt(match[1], 10) : null;
}

export function auditMission(text: string, company: CompanyInputData): SectionAuditResult {
  const t = clean(text);
  const lower = t.toLowerCase();
  const wordCount = t ? t.split(/\s+/).length : 0;

  if (wordCount < 5) {
    return {
      title: 'Misión Institucional',
      originalText: text,
      score: 15,
      category: 'critico',
      summary: 'La declaración de misión es inexistente o demasiado corta para ser evaluada formalmente.',
      strengths: [],
      weaknesses: ['Texto insuficiente', 'No define qué hace, a quién atiende ni cómo genera valor'],
      suggestions: ['Redactar una misión formal que responda explícitamente a las 3 preguntas fundamentales del plan de negocio: ¿Qué?, ¿Quién? y ¿Cómo?.'],
      optimizedRewrite: `Somos ${company.companyName || 'Nuestra Empresa'}, comprometidos con transformar el sector de ${company.industry || 'nuestro rubro'} en ${company.location || 'nuestra región'}, ofreciendo soluciones innovadoras que resuelven las necesidades críticas de nuestros clientes con los más altos estándares de calidad y confianza.`,
      criteria: [
        {
          id: 'm1_que',
          name: '1. ¿Qué? (Problema o necesidad que resuelve)',
          questionTarget: 'que',
          weight: 35,
          score: 10,
          status: 'failed',
          feedback: 'No se identificó el problema o necesidad del mercado.',
          suggestion: 'Especifique con precisión qué servicio o solución provee su negocio.'
        },
        {
          id: 'm2_quien',
          name: '2. ¿Quién? (Segmento de clientes objetivo)',
          questionTarget: 'quien',
          weight: 30,
          score: 10,
          status: 'failed',
          feedback: 'No se definió el público o destinatario del servicio.',
          suggestion: 'Indique a quién se dirigen sus servicios (ej. PYMES, contribuyentes, contadores, pacientes).'
        },
        {
          id: 'm3_como',
          name: '3. ¿Cómo? (Método, tecnología y propuesta de valor)',
          questionTarget: 'como',
          weight: 25,
          score: 10,
          status: 'failed',
          feedback: 'No se especifica el método ni los distingos competitivos.',
          suggestion: 'Detalle cómo ejecutan su solución (plataforma digital, automatización, metodología propia).'
        },
        {
          id: 'm4_calidad',
          name: '4. Claridad y Congruencia',
          questionTarget: 'calidad',
          weight: 10,
          score: 20,
          status: 'failed',
          feedback: 'La extensión es insuficiente.',
          suggestion: 'Una misión profesional suele tener entre 30 y 65 palabras estructuradas.'
        }
      ]
    };
  }

  // 1. EVALUATION: ¿QUÉ HACE? (Need / problem / value)
  const queKeywords = [
    'cumplimiento', 'evitar sanciones', 'alerta', 'gesti', 'asesor', 'facilitar',
    'acompañ', 'acompan', 'soluci', 'proteger', 'automatiz', 'resolver', 'reducir',
    'mejorar', 'optimizar', 'garantizar', 'ofrecer', 'diagnost', 'prevenir', 'transformar'
  ];
  const matchedQue = queKeywords.filter(k => lower.includes(k));
  let queScore = 0;
  let queStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let queFeedback = '';
  let queSuggestion = '';

  if (matchedQue.length >= 2) {
    queScore = 95;
    queStatus = 'passed';
    queFeedback = `Excelente definición del propósito. Responde con claridad a la necesidad de mercado (palabras clave: ${matchedQue.slice(0, 3).join(', ')}).`;
    queSuggestion = 'Mantener la claridad del problema que soluciona en todas las piezas comerciales.';
  } else if (matchedQue.length === 1) {
    queScore = 75;
    queStatus = 'warning';
    queFeedback = 'Menciona de forma general la necesidad, pero podría ser más contundente en el dolor específico que resuelve.';
    queSuggestion = 'Especificar de manera explícita el impacto o dolor concreto que elimina a sus usuarios.';
  } else {
    queScore = 40;
    queStatus = 'failed';
    queFeedback = 'No queda claro cuál es la necesidad real que resuelve o qué dolor de mercado combate.';
    queSuggestion = 'Defina con precisión el problema que resuelve (ej. evitar multas, acelerar procesos, reducir costos).';
  }

  // 2. EVALUATION: ¿QUIÉN? (Target / clients)
  const quienKeywords = [
    'contribuyente', 'empresa', 'contador', 'independiente', 'pyme', 'cliente',
    'usuario', 'paciente', 'persona', 'instituci', 'consumidor', 'profesional',
    'organizaci', 'sector'
  ];
  const matchedQuien = quienKeywords.filter(k => lower.includes(k));
  let quienScore = 0;
  let quienStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let quienFeedback = '';
  let quienSuggestion = '';

  if (lower.includes('todo el mundo') || lower.includes('cualquiera') || lower.includes('la gente')) {
    quienScore = 45;
    quienStatus = 'warning';
    quienFeedback = 'La delimitación del público es excesivamente genérica ("todo el mundo" o "la gente"). Esto debilita la segmentación de mercado.';
    quienSuggestion = 'Reemplace términos ambiguos por perfiles de clientes específicos (ej. microempresarios, profesionales independientes).';
  } else if (matchedQuien.length >= 2) {
    queScore = Math.max(queScore, 80);
    quienScore = 95;
    quienStatus = 'passed';
    quienFeedback = `Segmentación muy precisa. Identifica claramente los grupos objetivos clave (${matchedQuien.slice(0, 3).join(', ')}).`;
    quienSuggestion = 'Excelente segmentación alineada con los requisitos del plan de negocio.';
  } else if (matchedQuien.length === 1) {
    quienScore = 75;
    quienStatus = 'warning';
    quienFeedback = `Menciona un destinatario (${matchedQuien[0]}), pero podría enriquecerse con el perfil específico del cliente ideal.`;
    quienSuggestion = 'Incluya de forma explícita el perfil específico del cliente o sub-segmentos que atiende.';
  } else {
    quienScore = 35;
    quienStatus = 'failed';
    quienFeedback = 'Falta especificar con exactitud a quién se dirigen los productos o servicios.';
    quienSuggestion = 'Responda a la pregunta: ¿A quién beneficia directamente este proyecto?';
  }

  // 3. EVALUATION: ¿CÓMO? (Method / Platform / Advantage)
  const comoKeywords = [
    'a través de', 'a traves de', 'combinamos', 'plataforma', 'algoritmo',
    'automatiz', 'tecnolog', 'metodolog', 'inteligencia', 'mediante',
    'análisis', 'analisis', 'herramienta', 'modelo', 'software', 'sistema'
  ];
  const matchedComo = comoKeywords.filter(k => lower.includes(k));
  let comoScore = 0;
  let comoStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let comoFeedback = '';
  let comoSuggestion = '';

  if (matchedComo.length >= 2) {
    comoScore = 95;
    comoStatus = 'passed';
    comoFeedback = `Distingos competitivos y método muy claros (${matchedComo.slice(0, 3).join(', ')}). Explica con solvencia la propuesta técnica.`;
    comoSuggestion = 'Conserve este balance entre valor funcional y diferenciador tecnológico.';
  } else if (matchedComo.length === 1) {
    comoScore = 70;
    comoStatus = 'warning';
    comoFeedback = 'Indica someramente cómo lo hace, pero no resalta con fuerza el distingo competitivo o la tecnología empleada.';
    comoSuggestion = 'Incorpore el mecanismo o tecnología única con la que entrega el valor.';
  } else {
    comoScore = 40;
    comoStatus = 'failed';
    comoFeedback = 'No describe la metodología, tecnología o vehículo a través del cual materializa la solución.';
    comoSuggestion = 'Indique si utiliza software, automatizaciones, asesoría personalizada o plataformas digitales.';
  }

  // 4. EVALUATION: EXTENSIÓN Y CONGRUENCIA
  let calidadScore = 90;
  let calidadFeedback = 'Longitud adecuada y fluidez sintáctica.';
  let calidadSuggestion = 'Estructura armónica.';
  let calidadStatus: 'passed' | 'warning' | 'failed' = 'passed';

  if (wordCount < 20) {
    calidadScore = 60;
    calidadStatus = 'warning';
    calidadFeedback = `Misión muy breve (${wordCount} palabras). Podría carecer de los matices institucionales exigidos.`;
    calidadSuggestion = 'Ampliar a al menos 30-50 palabras cubriendo ¿Qué?, ¿Quién? y ¿Cómo?.';
  } else if (wordCount > 85) {
    calidadScore = 70;
    calidadStatus = 'warning';
    calidadFeedback = `Misión excesivamente densa (${wordCount} palabras). Puede perder impacto comunicacional.`;
    calidadSuggestion = 'Sintetizar eliminando adjetivos redundantes para enfocar la esencia estratégica.';
  }

  // Weighted total
  const totalScore = Math.round(
    queScore * 0.35 +
    quienScore * 0.30 +
    comoScore * 0.25 +
    calidadScore * 0.10
  );

  const criteria: RubricCriterion[] = [
    {
      id: 'm1_que',
      name: '1. ¿Qué necesidad o problema satisface?',
      questionTarget: 'que',
      weight: 35,
      score: queScore,
      status: queStatus,
      feedback: queFeedback,
      detectedText: matchedQue.join(', ') || 'Sin coincidencias claras',
      suggestion: queSuggestion
    },
    {
      id: 'm2_quien',
      name: '2. ¿Quién es el cliente/segmento objetivo?',
      questionTarget: 'quien',
      weight: 30,
      score: quienScore,
      status: quienStatus,
      feedback: quienFeedback,
      detectedText: matchedQuien.join(', ') || 'Sin segmentación explícita',
      suggestion: quienSuggestion
    },
    {
      id: 'm3_como',
      name: '3. ¿Cómo lo soluciona y qué distingos posee?',
      questionTarget: 'como',
      weight: 25,
      score: comoScore,
      status: comoStatus,
      feedback: comoFeedback,
      detectedText: matchedComo.join(', ') || 'Sin metodología especificada',
      suggestion: comoSuggestion
    },
    {
      id: 'm4_calidad',
      name: '4. Claridad, Redacción y Dimensión',
      questionTarget: 'calidad',
      weight: 10,
      score: calidadScore,
      status: calidadStatus,
      feedback: calidadFeedback,
      detectedText: `${wordCount} palabras`,
      suggestion: calidadSuggestion
    }
  ];

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (queStatus === 'passed') strengths.push('Definición contundente de la necesidad y problema resuelto.');
  else weaknesses.push('Ambigüedad en la definición del problema o dolor del cliente.');

  if (quienStatus === 'passed') strengths.push('Segmentación de clientes precisa y profesional.');
  else weaknesses.push('Falta de delimitación de los perfiles de clientes beneficiarios.');

  if (comoStatus === 'passed') strengths.push('Diferencial tecnológico y metodológico claramente expresado.');
  else weaknesses.push('Omisión de la metodología o tecnología con la que se entrega el servicio.');

  if (calidadStatus === 'passed') strengths.push('Extensión y balance sintáctico óptimos.');

  criteria.forEach(c => {
    if (c.status !== 'passed' && c.suggestion) {
      suggestions.push(c.suggestion);
    }
  });

  if (suggestions.length === 0) {
    suggestions.push('La misión cumple de forma sobresaliente con el estándar normativo del plan de negocios.');
  }

  // Generate optimized rewrite proposal
  let optimizedRewrite = '';
  if (totalScore >= 88) {
    optimizedRewrite = t;
  } else {
    const cName = company.companyName || 'Nuestra Organización';
    const cInd = company.industry || 'servicios tecnológicos';
    const cLoc = company.location ? `, con sede en ${company.location},` : '';
    const cAud = company.targetAudience || 'personas naturales, independientes y empresas';
    const cVal = company.valueProposition || 'soluciones oportunas de alta precisión';
    optimizedRewrite = `Somos ${cName}${cLoc} una organización del sector de ${cInd}, dedicada a brindar a ${cAud} el cumplimiento ágil y confiable de sus necesidades, combinando innovación continua, tecnología especializada y ${cVal} para garantizar tranquilidad y excelencia operativa.`;
  }

  return {
    title: 'Misión Institucional',
    originalText: text,
    score: totalScore,
    category: getCategory(totalScore),
    summary: totalScore >= 80 
      ? 'La misión presenta una estructura robusta y alineada con los estándares de planeación estratégica.'
      : 'La misión requiere ajustes en uno o varios de los pilares esenciales (¿Qué?, ¿Quién? o ¿Cómo?).',
    strengths,
    weaknesses,
    suggestions,
    optimizedRewrite,
    criteria
  };
}

export function auditVision(text: string, company: CompanyInputData): SectionAuditResult {
  const t = clean(text);
  const lower = t.toLowerCase();
  const wordCount = t ? t.split(/\s+/).length : 0;
  const detectedYear = extractYear(t);
  const currentYear = 2026;

  if (wordCount < 5) {
    return {
      title: 'Visión Institucional',
      originalText: text,
      score: 15,
      category: 'critico',
      summary: 'La declaración de visión está vacía o es insuficiente.',
      strengths: [],
      weaknesses: ['Sin horizonte temporal', 'Sin posicionamiento definido'],
      suggestions: ['Defina un año meta claro (ej. 2030, 2035) y el alcance geográfico de liderazgo pretendido.'],
      optimizedRewrite: `Para el año ${company.targetYear || '2030'}, ser la organización líder y referente en ${company.industry || 'nuestro sector'} a nivel ${company.location ? 'regional y nacional' : 'nacional'}, reconocida por su excelencia operativa, innovación constante y confianza absoluta de nuestros clientes.`,
      criteria: [
        {
          id: 'v1_horizonte',
          name: '1. Horizonte Temporal (Año Meta)',
          questionTarget: 'horizonte',
          weight: 30,
          score: 10,
          status: 'failed',
          feedback: 'No tiene año meta.',
          suggestion: 'Agregue un año concreto (ej. Para el año 2030...).'
        },
        {
          id: 'v2_posicionamiento',
          name: '2. Posicionamiento Deseado',
          questionTarget: 'posicionamiento',
          weight: 30,
          score: 10,
          status: 'failed',
          feedback: 'No se describe el nivel de liderazgo deseado.',
          suggestion: 'Defina su aspiración (ej. ser la plataforma líder, referente principal).'
        },
        {
          id: 'v3_alcance',
          name: '3. Alcance Geográfico y Sectorial',
          questionTarget: 'alcance',
          weight: 25,
          score: 10,
          status: 'failed',
          feedback: 'No especifica delimitación geográfica.',
          suggestion: 'Especifique si será local, regional, nacional o internacional.'
        },
        {
          id: 'v4_vanguardia',
          name: '4. Atributos de Vanguardia y Diferenciación',
          questionTarget: 'calidad',
          weight: 15,
          score: 10,
          status: 'failed',
          feedback: 'No incluye factores de diferenciación futura.',
          suggestion: 'Mencione qué atributos garantizarán su vigencia a largo plazo.'
        }
      ]
    };
  }

  // 1. HORIZONTE TEMPORAL
  let horizonteScore = 0;
  let horizonteStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let horizonteFeedback = '';
  let horizonteSuggestion = '';

  if (detectedYear) {
    const diff = detectedYear - currentYear;
    if (diff < 0) {
      horizonteScore = 30;
      horizonteStatus = 'failed';
      horizonteFeedback = `El año indicado (${detectedYear}) ya ha pasado respecto al año en curso (${currentYear}). La visión debe proyectarse siempre hacia el futuro.`;
      horizonteSuggestion = 'Actualice el horizonte temporal a un año posterior a 2026.';
    } else if (diff === 0) {
      horizonteScore = 55;
      horizonteStatus = 'warning';
      horizonteFeedback = `El año indicado (${detectedYear}) coincide con el presente año. Una visión suele formularse a un horizonte de 3 a 10 años (o generacional).`;
      horizonteSuggestion = 'Proyecte su visión a mediano/largo plazo (ej. 2030, 2035).';
    } else if (diff > 25) {
      horizonteScore = 80;
      horizonteStatus = 'warning';
      horizonteFeedback = `Horizonte a muy largo plazo (${detectedYear}, +${diff} años). Válido como visión aspiracional generacional, aunque se recomienda acompañarla de hitos intermedios.`;
      horizonteSuggestion = 'Vincule la visión de largo plazo con metas operativas intermedias a 3 y 5 años.';
    } else {
      horizonteScore = 100;
      horizonteStatus = 'passed';
      horizonteFeedback = `Horizonte temporal óptimo (${detectedYear}, +${diff} años de proyección). Cumple a cabalidad con la técnica de planeación.`;
      horizonteSuggestion = 'Mantener este horizonte temporal alineado con el plan estratégico.';
    }
  } else {
    if (lower.includes('próximos') || lower.includes('proximos') || lower.includes('años') || lower.includes('futuro')) {
      horizonteScore = 65;
      horizonteStatus = 'warning';
      horizonteFeedback = 'Menciona una intención temporal relativa, pero carece de un año meta explícito numérico.';
      horizonteSuggestion = 'Especifique el año exacto (ej. "Para el año 2030...").';
    } else {
      horizonteScore = 30;
      horizonteStatus = 'failed';
      horizonteFeedback = 'Falta por completo el horizonte temporal. Sin una fecha meta, la visión carece de punto de llegada medible.';
      horizonteSuggestion = 'Inicie su visión con la frase: "Para el año [20XX], ser..."';
    }
  }

  // 2. POSICIONAMIENTO DESEADO
  const posKeywords = [
    'ser la plataforma', 'ser la empresa', 'ser el referente', 'ser reconocida',
    'ser reconocido', 'liderar', 'líder', 'lider', 'posicionarse', 'referente',
    'primera opción', 'mayor impacto', 'consolidarse'
  ];
  const matchedPos = posKeywords.filter(k => lower.includes(k));
  let posScore = 0;
  let posStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let posFeedback = '';
  let posSuggestion = '';

  if (lower.includes('la mejor empresa del mundo') || lower.includes('la mas grande de todas')) {
    posScore = 50;
    posStatus = 'warning';
    posFeedback = 'El posicionamiento cae en clichés hiperbólicos ("la mejor del mundo") difíciles de auditar o sustentar.';
    posSuggestion = 'Sustituya frases hiperbólicas genéricas por categorías específicas de liderazgo sustentable.';
  } else if (matchedPos.length >= 1) {
    posScore = 95;
    posStatus = 'passed';
    posFeedback = `Excelente postulado de posicionamiento (${matchedPos[0]}). Formula una aspiración retadora y concreta.`;
    posSuggestion = 'Excelente definición de la aspiración de mercado.';
  } else {
    posScore = 45;
    posStatus = 'failed';
    posFeedback = 'No declara con suficiente fuerza la posición o liderazgo que aspira a alcanzar en su industria.';
    posSuggestion = 'Declare con precisión el rol que ocupará (ej. plataforma líder, referente en innovación).';
  }

  // 3. ALCANCE GEOGRÁFICO Y SECTORIAL
  const geoKeywords = [
    'caribe', 'colombia', 'barranquilla', 'bogotá', 'medellin', 'cali',
    'nacional', 'regional', 'latinoamérica', 'latinoamerica', 'internacional',
    'global', 'local', 'departamental', 'ciudad', 'país', 'pais'
  ];
  const matchedGeo = geoKeywords.filter(k => lower.includes(k));
  let geoScore = 0;
  let geoStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let geoFeedback = '';
  let geoSuggestion = '';

  if (matchedGeo.length >= 2) {
    geoScore = 100;
    geoStatus = 'passed';
    geoFeedback = `Delimitación geográfica impecable (${matchedGeo.slice(0, 3).join(', ')}). Define con exactitud el radio de acción.`;
    geoSuggestion = 'Mantener la congruencia con la capacidad operativa de expansión.';
  } else if (matchedGeo.length === 1) {
    geoScore = 80;
    geoStatus = 'passed';
    geoFeedback = `Incluye alcance geográfico (${matchedGeo[0]}).`;
    geoSuggestion = 'Podría especificar si contempla fases de expansión (ej. regional primero, luego nacional).';
  } else {
    geoScore = 35;
    geoStatus = 'failed';
    geoFeedback = 'No delimita el territorio o geografía del mercado meta.';
    geoSuggestion = 'Indique si su visión abarca su ciudad, su región geográfica, el país o mercados internacionales.';
  }

  // 4. ATRIBUTOS DE VANGUARDIA Y DIFERENCIACIÓN
  const vanKeywords = [
    'actualización', 'actualizacion', 'precisión', 'precision', 'calidad',
    'tecnolog', 'innovación', 'innovacion', 'reformas', 'vanguardia',
    'atención técnica', 'normativa', 'sostenible', 'eficiencia'
  ];
  const matchedVan = vanKeywords.filter(k => lower.includes(k));
  let vanScore = 0;
  let vanStatus: 'passed' | 'warning' | 'failed' = 'failed';
  let vanFeedback = '';
  let vanSuggestion = '';

  if (matchedVan.length >= 2) {
    vanScore = 95;
    vanStatus = 'passed';
    vanFeedback = `Atributos diferenciales sólidos y concretos (${matchedVan.slice(0, 3).join(', ')}).`;
    vanSuggestion = 'Excelente soporte cualitativo para la visión.';
  } else if (matchedVan.length === 1) {
    vanScore = 75;
    vanStatus = 'warning';
    vanFeedback = `Menciona un atributo (${matchedVan[0]}), pero convendría respaldar con mayores señas de excelencia técnica.`;
    vanSuggestion = 'Mencione qué factores técnicos o normativos sostendrán ese liderazgo.';
  } else {
    vanScore = 40;
    vanStatus = 'failed';
    vanFeedback = 'Faltan atributos distintivos que expliquen por qué la empresa será elegida en el futuro.';
    vanSuggestion = 'Agregue distinciones (ej. atención técnica de alta calidad, precisión normativa, innovación constante).';
  }

  const totalScore = Math.round(
    horizonteScore * 0.30 +
    posScore * 0.30 +
    geoScore * 0.25 +
    vanScore * 0.15
  );

  const criteria: RubricCriterion[] = [
    {
      id: 'v1_horizonte',
      name: '1. Horizonte Temporal (Año Meta)',
      questionTarget: 'horizonte',
      weight: 30,
      score: horizonteScore,
      status: horizonteStatus,
      feedback: horizonteFeedback,
      detectedText: detectedYear ? `Año ${detectedYear}` : 'No detectado',
      suggestion: horizonteSuggestion
    },
    {
      id: 'v2_posicionamiento',
      name: '2. Posicionamiento y Liderazgo Deseado',
      questionTarget: 'posicionamiento',
      weight: 30,
      score: posScore,
      status: posStatus,
      feedback: posFeedback,
      detectedText: matchedPos.join(', ') || 'Sin postulado explícito',
      suggestion: posSuggestion
    },
    {
      id: 'v3_alcance',
      name: '3. Delimitación Geográfica / Alcance',
      questionTarget: 'alcance',
      weight: 25,
      score: geoScore,
      status: geoStatus,
      feedback: geoFeedback,
      detectedText: matchedGeo.join(', ') || 'No delimitado',
      suggestion: geoSuggestion
    },
    {
      id: 'v4_vanguardia',
      name: '4. Atributos de Diferenciación y Vanguardia',
      questionTarget: 'calidad',
      weight: 15,
      score: vanScore,
      status: vanStatus,
      feedback: vanFeedback,
      detectedText: matchedVan.join(', ') || 'Sin atributos detectados',
      suggestion: vanSuggestion
    }
  ];

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (horizonteStatus === 'passed') strengths.push(`Horizonte temporal formal definido (${detectedYear}).`);
  else weaknesses.push('Ausencia o imprecisión en el año meta de la visión.');

  if (posStatus === 'passed') strengths.push('Definición clara del rol y posicionamiento de liderazgo.');
  else weaknesses.push('Aspiración difusa o basada en frases sin sustento estratégico.');

  if (geoStatus === 'passed') strengths.push(`Alcance territorial explícito (${matchedGeo.join(', ')}).`);
  else weaknesses.push('Falta de delimitación del territorio geográfico al que aspira.');

  if (vanStatus === 'passed') strengths.push('Inclusión de distingos de calidad, técnica o innovación.');

  criteria.forEach(c => {
    if (c.status !== 'passed' && c.suggestion) {
      suggestions.push(c.suggestion);
    }
  });

  if (suggestions.length === 0) {
    suggestions.push('La visión reúne todos los atributos exigidos por las directrices de formulación estratégica.');
  }

  // Optimized Rewrite Proposal
  let optimizedRewrite = '';
  if (totalScore >= 88) {
    optimizedRewrite = t;
  } else {
    const year = detectedYear || (company.targetYear ? parseInt(company.targetYear, 10) : 2030);
    const cName = company.companyName || 'nuestra empresa';
    const cInd = company.industry || 'soluciones digitales y servicios especializados';
    const geo = company.location ? `en ${company.location} y el territorio nacional` : 'a nivel nacional e internacional';
    optimizedRewrite = `Para el año ${year}, ${cName} será la organización líder y referente en ${cInd} ${geo}. Nos distinguiremos por la vanguardia tecnológica, la constante actualización frente a los cambios del sector y un estándar inquebrantable de calidad y confianza para nuestros usuarios.`;
  }

  return {
    title: 'Visión Institucional',
    originalText: text,
    score: totalScore,
    category: getCategory(totalScore),
    summary: totalScore >= 80 
      ? 'La visión está sólidamente formulada con horizonte, alcance y atributos de posicionamiento.'
      : 'La visión adolece de elementos indispensables como horizonte temporal específico o alcance delimitado.',
    strengths,
    weaknesses,
    suggestions,
    optimizedRewrite,
    criteria
  };
}

export function auditCoherence(misionResult: SectionAuditResult, visionResult: SectionAuditResult, company: CompanyInputData): CoherenceAuditResult {
  const mScore = misionResult.score;
  const vScore = visionResult.score;
  const observations: string[] = [];

  const detectedYear = extractYear(visionResult.originalText);
  const currentYear = 2026;
  const gapYears = detectedYear ? detectedYear - currentYear : 0;

  let audienceMatch = true;
  let temporalFeasibility = true;
  let valuePropAlignment = true;

  // Check audience coherence
  if (misionResult.criteria.find(c => c.id === 'm2_quien')?.status === 'failed') {
    audienceMatch = false;
    observations.push('Al no estar claro el público en la misión, resulta difícil validar la correspondencia con la visión futura.');
  } else {
    observations.push('Existe alineación entre los segmentos atendidos en el presente y el mercado objetivo de expansión futura.');
  }

  // Check temporal feasibility
  if (!detectedYear || gapYears < 1) {
    temporalFeasibility = false;
    observations.push('La visión no cuenta con un año meta que permita trazar una ruta temporal realista desde la operación actual.');
  } else if (gapYears > 20) {
    observations.push(`La visión proyecta a largo plazo (+${gapYears} años, año ${detectedYear}). Es crucial establecer metas de control a 12 meses (como la proyección presupuestal 2026) para asegurar la viabilidad de la trayectoria.`);
  } else {
    observations.push(`Horizonte temporal armónico (+${gapYears} años), compatible con un ciclo de consolidación de mercado de mediano plazo.`);
  }

  // Check value prop alignment
  if (mScore >= 70 && vScore >= 70) {
    valuePropAlignment = true;
    observations.push('La propuesta de valor presente en la misión sirve de base lógica para sustentar el posicionamiento pretendido en la visión.');
  } else {
    valuePropAlignment = false;
    observations.push('Se detectan vacíos en la propuesta o en los factores diferenciadores que impiden garantizar la transición natural de la misión a la visión.');
  }

  // Calculate coherence score
  let coherenceScore = Math.round((mScore * 0.45) + (vScore * 0.45) + (temporalFeasibility ? 10 : 0));
  coherenceScore = Math.min(100, Math.max(10, coherenceScore));

  let summary = '';
  if (coherenceScore >= 85) {
    summary = 'Excelente coherencia estratégica. La visión es el desenlace natural y escalable de la misión corporativa.';
  } else if (coherenceScore >= 70) {
    summary = 'Buena alineación general, con pequeñas oportunidades de articulación entre los objetivos inmediatos y los de largo plazo.';
  } else {
    summary = 'Desconexión conceptual entre lo que la empresa hace hoy (misión) y lo que aspira a ser (visión). Requiere redefinición coordinada.';
  }

  return {
    score: coherenceScore,
    category: getCategory(coherenceScore),
    alignmentSummary: summary,
    audienceMatch,
    temporalFeasibility,
    valuePropAlignment,
    observations,
    horizonYear: detectedYear,
    gapYears
  };
}

export function runFullBusinessAudit(data: CompanyInputData): BusinessAuditReport {
  const misionAudit = auditMission(data.mision, data);
  const visionAudit = auditVision(data.vision, data);
  const coherenceAudit = auditCoherence(misionAudit, visionAudit, data);

  // Overall Score calculation (40% Mision, 35% Vision, 25% Coherence)
  const overallScore = Math.round(
    misionAudit.score * 0.40 +
    visionAudit.score * 0.35 +
    coherenceAudit.score * 0.25
  );

  const overallCategory = getCategory(overallScore);

  // Action plan compilation
  const actionPlan: BusinessAuditReport['actionPlan'] = [];

  // Mission issues
  misionAudit.criteria.forEach(c => {
    if (c.status === 'failed') {
      actionPlan.push({
        priority: 'Alta',
        section: 'Misión',
        item: `Completar el pilar de ${c.name}: ${c.suggestion}`,
        impact: 'Garantiza que evaluadores e inversionistas comprendan inmediatamente el modelo de negocio.'
      });
    } else if (c.status === 'warning') {
      actionPlan.push({
        priority: 'Media',
        section: 'Misión',
        item: `Pulir redacción en ${c.name}: ${c.suggestion}`,
        impact: 'Aumenta la fuerza comunicativa y la convicción del documento.'
      });
    }
  });

  // Vision issues
  visionAudit.criteria.forEach(c => {
    if (c.status === 'failed') {
      actionPlan.push({
        priority: 'Alta',
        section: 'Visión',
        item: `Ajustar requerimiento normativo en ${c.name}: ${c.suggestion}`,
        impact: 'Evita penalizaciones formales en comités de evaluación y convocatorias de financiamiento.'
      });
    } else if (c.status === 'warning') {
      actionPlan.push({
        priority: 'Media',
        section: 'Visión',
        item: `Mejorar formulación en ${c.name}: ${c.suggestion}`,
        impact: 'Otorga solidez y realismo al horizonte de crecimiento empresarial.'
      });
    }
  });

  // General Coherence issues
  if (!coherenceAudit.temporalFeasibility) {
    actionPlan.push({
      priority: 'Alta',
      section: 'Alineación General',
      item: 'Definir explícitamente el año meta en la visión y conectarlo con la proyección financiera a 12 meses.',
      impact: 'Permite desglosar las metas estratégicas en presupuestos e indicadores trimestrales.'
    });
  }

  if (actionPlan.length === 0) {
    actionPlan.push({
      priority: 'Baja',
      section: 'Alineación General',
      item: 'Documento en estado óptimo. Realizar revisiones anuales para actualizar hitos normativos y tecnológicos.',
      impact: 'Mantiene la vigencia competitiva del plan estratégico.'
    });
  }

  // Executive Summary text
  let executiveSummary = '';
  if (overallScore >= 85) {
    executiveSummary = `El plan estratégico de ${data.companyName || 'la empresa'} presenta una calidad formal sobresaliente (${overallScore}/100). Cumple rigurosamente con los 3 cuestionamientos clave de la Misión (¿Qué?, ¿Quién?, ¿Cómo?) y establece una Visión inspiradora con horizonte y delimitación geográfica adecuados. Se recomienda conservar esta estructura en los informes y proyecciones a 12 meses.`;
  } else if (overallScore >= 70) {
    executiveSummary = `El plan estratégico de ${data.companyName || 'la empresa'} cuenta con bases sólidas (${overallScore}/100), pero requiere precisión en aspectos puntuales de diferenciación competitiva y delimitación de hitos temporales para maximizar su impacto ante auditores y evaluadores.`;
  } else {
    executiveSummary = `Se detectan vacíos estructurales relevantes (${overallScore}/100) en la formulación de la identidad estratégica. Es fundamental subsanar los puntos críticos señalados en la matriz de evaluación y adoptar las propuestas de redacción sugeridas antes de someter el plan de negocio a instancias decisorias.`;
  }

  return {
    id: `audit-${Date.now()}`,
    companyName: data.companyName || 'Empresa Sin Nombre',
    industry: data.industry || 'No especificada',
    location: data.location || 'No especificada',
    targetYear: data.targetYear || '',
    timestamp: new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }),
    overallScore,
    overallCategory,
    misionAudit,
    visionAudit,
    coherenceAudit,
    executiveSummary,
    actionPlan
  };
}
