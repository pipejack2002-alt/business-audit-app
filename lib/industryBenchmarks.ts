import { IndustrySectorConfig, CompanyInputData, IndustrySector, DetectedMarketInfo } from './types';

export const INDUSTRY_SECTORS: IndustrySectorConfig[] = [
  {
    id: 'tech',
    name: 'Tecnología, SaaS, FinTech & Software',
    badge: 'LegalTech / SaaS / Cloud',
    iconName: 'Cpu',
    description: 'Empresas de base tecnológica, plataformas en la nube, aplicaciones móviles y soluciones digitales automatizadas.',
    keyEvaluationPoints: [
      'Propiedad intelectual y registro de derechos de autor sobre el código fuente (DNDA / MinTIC).',
      'Infraestructura en la nube (AWS, Azure, GCP) con alta disponibilidad y acuerdos SLA.',
      'Modelo de ingresos recurrentes (MRR / ARR) con métricas CAC, Churn y LTV.',
      'Cumplimiento estricto de protección de datos personales y Habeas Data (Ley 1581 de 2012).'
    ],
    sampleBusinessTypes: [
      'Plataforma SaaS de alertas fiscales',
      'Pasarela de pagos y billetera digital',
      'Software de gestión clínica y telemedicina',
      'App de delivery y logística de última milla'
    ],
    misionFormula: 'Somos [Nombre], empresa especializada en [Solución digital], comprometida con acompañar a [Público objetivo] en [Problema que resuelve], mediante [Plataforma tecnológica/Algoritmo] que garantiza [Beneficio o diferenciador].',
    visionFormula: 'Para el año [Año meta], ser la plataforma digital líder en [Sector/Mercado] en [Territorio], reconocida por su constante innovación tecnológica, alta seguridad y excelencia operativa.',
    sampleCompany: {
      companyName: 'TributoApp S.A.S.',
      industry: 'Tecnología Tributaria / FinTech / LegalTech',
      location: 'Barranquilla, Atlántico (Colombia)',
      targetYear: '2040',
      sector: 'tech',
      mision: 'Somos TributoApp S.A.S., una empresa con sede en Barranquilla, comprometida con acompañar a contribuyentes, independientes, empresas y contadores públicos en el cumplimiento puntual y organizado de sus obligaciones tributarias. A través de nuestra plataforma, combinamos automatización de alertas por último dígito de NIT y análisis de perfil fiscal para evitar sanciones por extemporaneidad.',
      vision: 'Para el año 2040, ser la plataforma digital líder en gestión de calendario tributario y alertas de cumplimiento fiscal en la región Caribe y Colombia. Nos distinguiremos por la actualización constante frente a las reformas tributarias, la precisión en la información distrital y nacional, y una atención técnica de alta calidad.',
      values: '• Precisión Normativa: Verificación con fuentes oficiales de la DIAN.\n• Puntualidad Absoluta: Alertas automáticas oportunas.\n• Seguridad de la Información: Custodia confidencial de datos.',
      valueProposition: 'Alertas automatizadas por último dígito de NIT que eliminan el 100% de las sanciones por extemporaneidad ante la DIAN.',
      targetAudience: 'Personas naturales, independientes, microempresas y contadores públicos con múltiples clientes.'
    }
  },
  {
    id: 'retail',
    name: 'Comercio, Retail, E-Commerce & Distribución',
    badge: 'Comercial / Tiendas / Retail',
    iconName: 'ShoppingBag',
    description: 'Empresas de comercialización al por mayor o al detal, tiendas físicas, comercio electrónico y cadenas de distribución.',
    keyEvaluationPoints: [
      'Gestión y rotación de inventarios (política FIFO/PEPS y control de mermas).',
      'Estrategia omnicanal (integración entre punto de venta físico, web y WhatsApp Business).',
      'Márgenes brutos de comercialización y acuerdos de crédito con proveedores clave.',
      'Experiencia de compra y tiempos de entrega en logística de distribución.'
    ],
    sampleBusinessTypes: [
      'Tienda multimarca de ropa y calzado',
      'Distribuidora de insumos de ferretería y construcción',
      'Supermercado o minimercado de proximidad',
      'E-commerce de productos cosméticos y cuidado personal'
    ],
    misionFormula: 'Somos [Nombre], empresa comercializadora de [Línea de productos], dedicada a satisfacer las necesidades de [Clientes objetivos] ofreciendo [Ventaja: variedad, precio, calidad], a través de [Canales de venta físicos y digitales] con una atención cálida y personalizada.',
    visionFormula: 'Para el año [Año meta], consolidarnos como la cadena comercial referente en [Sector] en [Ciudad/Región], distinguiéndonos por la accesibilidad de nuestros productos, excelencia logística y satisfacción total del consumidor.',
    sampleCompany: {
      companyName: 'NovaModa Retail & E-Commerce',
      industry: 'Comercio al por Menor / Moda & Calzado',
      location: 'Medellín, Antioquia (Colombia)',
      targetYear: '2032',
      sector: 'retail',
      mision: 'Somos NovaModa, una empresa comercializadora de vestuario y calzado contemporáneo, dedicada a brindar a jóvenes profesionales y familias prendas versátiles y de alta calidad a precios justos, a través de nuestra red de tiendas boutique y plataforma omnicanal con entregas rápidas.',
      vision: 'Para el año 2032, ser la marca de retail de moda accesible preferida en el Valle de Aburrá y el Eje Cafetero, reconocida por nuestro catálogo vanguardista, políticas de sostenibilidad textil y una experiencia de compra omnicanal inigualable.',
      values: '• Honestidad y Transparencia en Precios\n• Enfoque de Servicio al Cliente\n• Agilidad en la Cadena Logística',
      valueProposition: 'Prendas con diseño de tendencia y alta durabilidad disponibles en menos de 24 horas a nivel metropolitano.',
      targetAudience: 'Hombres y mujeres de 22 a 45 años, estudiantes universitarios y trabajadores del sector corporativo.'
    }
  },
  {
    id: 'services',
    name: 'Servicios Profesionales, Consultoría & Salud',
    badge: 'Servicios / Consultoría / Clínico',
    iconName: 'Briefcase',
    description: 'Firmas de asesoría contable, legal, tributaria, auditoría, agencias de marketing, clínicas IPS, centros odontológicos y consultoría.',
    keyEvaluationPoints: [
      'Acreditación profesional y tarjetas profesionales del talento humano líder.',
      'Estructura de costos basada en horas-hombre, tarifas por honorarios y capacidad instalada.',
      'Retención de clientes recurrentes mediante contratos de prestación de servicios o pólizas.',
      'Cumplimiento de estándares de calidad según el ente rector (JCC, MinSalud, SuperSociedades).'
    ],
    sampleBusinessTypes: [
      'Firma de auditoría financiera y revisoría fiscal',
      'Centro de terapia física y rehabilitación',
      'Consultoría en transformación digital y ciberseguridad',
      'Agencia de marketing digital y branding estratégico'
    ],
    misionFormula: 'Somos [Nombre], firma de servicios profesionales especializada en [Área de especialidad], comprometida con optimizar [Problema o necesidad del cliente] para [Público objetivo], aplicando [Metodología/Tecnología] con los más altos estándares de ética y rigor técnico.',
    visionFormula: 'Para el año [Año meta], ser la firma consultora de mayor reputación y confianza en [Especialidad] en [Ámbito territorial], destacada por generar impacto cuantificable y relaciones estratégicas de largo plazo.',
    sampleCompany: {
      companyName: 'Nexus Consultores Tributarios & Legales',
      industry: 'Servicios Profesionales / Consultoría Empresarial',
      location: 'Bogotá D.C., Colombia',
      targetYear: '2030',
      sector: 'services',
      mision: 'Somos Nexus Consultores, una firma especializada en derecho corporativo y planeación tributaria integral, dedicada a proteger el patrimonio de medianas empresas y grupos familiares, implementando estructuras fiscales éticas, seguras y plenamente apegadas a la ley.',
      vision: 'Para el año 2030, ser la firma de consultoría tributaria de referencia en el centro del país para empresas del sector real, reconocida por su solvencia técnica ante litigios DIAN y soluciones preventivas de alto impacto patrimonial.',
      values: '• Ética y Rigor Jurídico Inquebrantable\n• Confidencialidad y Secreto Profesional\n• Proactividad en Soluciones Estratégicas',
      valueProposition: 'Blindaje jurídico-tributario integral que reduce contingencias sancionatorias y optimiza el flujo de caja corporativo.',
      targetAudience: 'Gerentes generales, directores financieros y familias empresarias de PYMES colombianas.'
    }
  },
  {
    id: 'manufacturing',
    name: 'Manufactura, Alimentos & Producción Industrial',
    badge: 'Producción / Fábrica / Alimentos',
    iconName: 'Factory',
    description: 'Plantas de transformación, elaboración de alimentos procesados, confección, metalmecánica, plásticos y manufactura industrial.',
    keyEvaluationPoints: [
      'Cálculo preciso del costo primo (materia prima directa + mano de obra directa + CIF).',
      'Capacidad instalada mensual (unidades producidas vs. capacidad máxima teórica).',
      'Registros y certificaciones sanitarias obligatorias (INVIMA, Buenas Prácticas de Manufactura - BPM).',
      'Punto de equilibrio expresado en unidades físicas de producción y en ventas monetarias.'
    ],
    sampleBusinessTypes: [
      'Planta de snacks y alimentos saludables horneados',
      'Taller industrial de confección de uniformes dotacionales',
      'Fábrica de envases biodegradables a partir de bagazo de caña',
      'Laboratorio de suplementos nutricionales y fitoterapéuticos'
    ],
    misionFormula: 'Somos [Nombre], empresa industrial dedicada a la formulación y elaboración de [Producto terminado], para satisfacer las exigencias de [Consumidores o distribuidores], mediante procesos de producción tecnificados que garantizan [Inocuidad, calidad o rendimiento].',
    visionFormula: 'Para el año [Año meta], ser la planta manufacturera líder en producción de [Categoría] en [Región/País], reconocida por sus estándares internacionales de calidad, eco-eficiencia y competitividad industrial.',
    sampleCompany: {
      companyName: 'NutriSnack Andino S.A.S.',
      industry: 'Manufactura de Alimentos / Snacks Saludables',
      location: 'Cali, Valle del Cauca (Colombia)',
      targetYear: '2035',
      sector: 'manufacturing',
      mision: 'Somos NutriSnack Andino S.A.S., una empresa manufacturera dedicada a la elaboración y empaque de pasabocas saludables a base de tubérculos y semillas nativas, satisfaciendo el deseo de bienestar de consumidores conscientes, mediante procesos de horneado con certificación BPM que preservan los nutrientes esenciales.',
      vision: 'Para el año 2035, ser la empresa líder de alimentos funcionales y snacks limpios en el suroccidente colombiano y mercados de exportación de la Alianza del Pacífico, reconocida por nuestra innovación agronómica y empaques 100% compostables.',
      values: '• Inocuidad y Calidad Alimentaria sin Concesiones\n• Sostenibilidad en el Abastecimiento de Materias Primas\n• Pasión por la Nutrición Preventiva',
      valueProposition: 'Snacks libres de sellos de advertencia frontal con materias primas locales que apoyan a pequeños productores del agro.',
      targetAudience: 'Consumidores de estilo de vida saludable, tiendas naturistas, colegios y cadenas de supermercados.'
    }
  },
  {
    id: 'agro',
    name: 'Agroindustria, Ganadería & Sostenibilidad',
    badge: 'Campo / Agro / Exportación',
    iconName: 'Sprout',
    description: 'Cultivos agrícolas tecnificados, producción pecuaria, poscosecha, agroexportación y biocomercio sostenible.',
    keyEvaluationPoints: [
      'Manejo de estacionalidad de cosechas y ciclos biológicos de producción.',
      'Cadena de frío, almacenamiento poscosecha y control de mermas agrícolas.',
      'Certificaciones agropecuarias y de buenas prácticas (ICA, GlobalGAP, Rainforest Alliance).',
      'Plan de gestión hídrica, conservación del suelo y mitigación del cambio climático.'
    ],
    sampleBusinessTypes: [
      'Cultivo y exportación de aguacate Hass y gulupa',
      'Producción avícola sostenible y huevos de pastoreo',
      'Piscicultura tecnificada de tilapia roja y trucha arcoíris',
      'Finca cafetera de cafés especiales de origen con denominación'
    ],
    misionFormula: 'Somos [Nombre], empresa agropecuaria comprometida con la producción sostenible de [Cultivo o especie], abasteciendo a [Compradores locales o internacionales] con productos de excelente frescura y trazabilidad, implementando buenas prácticas agrícolas y regeneración ambiental.',
    visionFormula: 'Para el año [Año meta], ser un referente agroindustrial en [Región], reconocido internacionalmente por la calidad de nuestros productos del campo, bienestar de nuestros trabajadores rurales y certificación carbono neutro.',
    sampleCompany: {
      companyName: 'AgroFrutas del Caribe Export S.A.S.',
      industry: 'Agroindustria & Exportación de Frutas Exóticas',
      location: 'Santa Marta, Magdalena (Colombia)',
      targetYear: '2035',
      sector: 'agro',
      mision: 'Somos AgroFrutas del Caribe Export, una empresa agroindustrial dedicada al cultivo, cosecha y despacho de frutas tropicales de alta calidad organoléptica, abasteciendo a importadores europeos y cadenas gourmet, mediante sistemas de riego por goteo fotovoltaico y alianzas justas con familias campesinas de la Sierra Nevada.',
      vision: 'Para el año 2035, consolidarnos como el principal exportador de mango de azúcar y cítricos orgánicos del norte de Colombia, distinguiéndonos por la certificación GlobalGAP, trazabilidad digital de origen y neutralidad en emisiones de carbono.',
      values: '• Respeto por la Tierra y los Recursos Hídricos\n• Comercio Justo con Productores del Campo\n• Rigor Fitosanitario y Trazabilidad',
      valueProposition: 'Frutas tropicales de aroma y sabor premium con cosecha bajo pedido y entrega refrigerada en puertos internacionales.',
      targetAudience: 'Importadores de fruta fresca en la Unión Europea, supermercados premium y cadenas de jugos naturales.'
    }
  },
  {
    id: 'tourism',
    name: 'Gastronomía, Turismo & Experiencias',
    badge: 'Horeca / Restaurantes / Hotelería',
    iconName: 'UtensilsCrossed',
    description: 'Restaurantes, gastrobares, hoteles boutique, operadores turísticos, ecoturismo y eventos culturales.',
    keyEvaluationPoints: [
      'Determinación del Costo de Alimentos y Bebidas (Food & Beverage Cost % ideal: 28-35%).',
      'Tiquete promedio por cliente (Average Ticket) y rotación diaria de mesas u ocupación hotelera.',
      'Cumplimiento de estándares de manipulación higiénica de alimentos y normatividad turística (RNT).',
      'Estrategia de fidelización, reseñas en plataformas (Google Maps, TripAdvisor) y estacionalidad vacacional.'
    ],
    sampleBusinessTypes: [
      'Restaurante de cocina de autor y maridaje local',
      'Eco-lodge y glamping en entorno natural protegido',
      'Agencia operadora de turismo de aventura y senderismo',
      'Cafetería de especialidad y panadería artesanal con coworking'
    ],
    misionFormula: 'Somos [Nombre], espacio dedicado a brindar experiencias de [Gastronomía o turismo], deleitando a [Visitantes o comensales] a través de [Propuesta de valor: sabores locales, calidez, hospitalidad], operando con insumos frescos y respeto por la cultura local.',
    visionFormula: 'Para el año [Año meta], ser el destino obligado y referente gastronómico/turístico en [Ciudad o destino], celebrado por su autenticidad, atmósfera cautivadora y servicio al cliente de clase mundial.',
    sampleCompany: {
      companyName: 'Fogón Caribeño Restaurante & Tradición',
      industry: 'Gastronomía / Restaurante & Turismo Cultural',
      location: 'Cartagena de Indias, Bolívar (Colombia)',
      targetYear: '2030',
      sector: 'tourism',
      mision: 'Somos Fogón Caribeño, un restaurante de cocina de herencia costera ubicado en Cartagena, comprometido con brindar a turistas y comensales locales un viaje sensorial por los sabores afrocolombianos e indígenas de la región, a través de ingredientes frescos del mar y un servicio que celebra la calidez caribeña.',
      vision: 'Para el año 2030, ser el restaurante de cocina tradicional de mayor renombre en el Caribe colombiano, reconocido en guías gastronómicas internacionales por la salvaguarda de recetas ancestrales, sostenibilidad marina y turismo responsable.',
      values: '• Orgullo por las Tradiciones Culinarias\n• Hospitalidad Genuina y Calidez en el Trato\n• Pesca Responsable y Apoyo a Pescadores Artesanales',
      valueProposition: 'Cocina de herencia caribeña elaborada con pesca del día sostenible en una atmósfera colonial restaurada.',
      targetAudience: 'Turistas nacionales y extranjeros, ejecutivos de negocios y familias que aprecian la alta gastronomía tradicional.'
    }
  }
];

export function getIndustryConfig(sectorId?: IndustrySector): IndustrySectorConfig {
  const found = INDUSTRY_SECTORS.find((s) => s.id === sectorId);
  return found || INDUSTRY_SECTORS[0]; // fallback to tech
}

export function detectSectorFromText(text: string): IndustrySector {
  const upper = text.toUpperCase();

  if (
    upper.includes('SOFTWARE') ||
    upper.includes('SAAS') ||
    upper.includes('PLATAFORMA') ||
    upper.includes('APP') ||
    upper.includes('NIT') ||
    upper.includes('TRIBUTO') ||
    upper.includes('DIGITAL') ||
    upper.includes('FINTECH') ||
    upper.includes('TECNOLOG')
  ) {
    return 'tech';
  }

  if (
    upper.includes('ALIMENTO') ||
    upper.includes('MANUFACTURA') ||
    upper.includes('PLANTA') ||
    upper.includes('FÁBRICA') ||
    upper.includes('PRODUCCIÓN') ||
    upper.includes('ENVASES') ||
    upper.includes('BPM') ||
    upper.includes('INVIMA')
  ) {
    return 'manufacturing';
  }

  if (
    upper.includes('AGRÍCOLA') ||
    upper.includes('CULTIVO') ||
    upper.includes('COSECHA') ||
    upper.includes('FRUTAS') ||
    upper.includes('CAMPO') ||
    upper.includes('AGRO') ||
    upper.includes('GANAD')
  ) {
    return 'agro';
  }

  if (
    upper.includes('RESTAURANTE') ||
    upper.includes('GASTRONOM') ||
    upper.includes('HOTEL') ||
    upper.includes('TURISMO') ||
    upper.includes('GLAMPING') ||
    upper.includes('COMENSAL')
  ) {
    return 'tourism';
  }

  if (
    upper.includes('TIENDA') ||
    upper.includes('COMERCIO') ||
    upper.includes('RETAIL') ||
    upper.includes('ROPA') ||
    upper.includes('CALZADO') ||
    upper.includes('VENTA') ||
    upper.includes('DISTRIBUIDORA')
  ) {
    return 'retail';
  }

  if (
    upper.includes('CONSULTOR') ||
    upper.includes('ASESOR') ||
    upper.includes('CLÍNICA') ||
    upper.includes('SALUD') ||
    upper.includes('MÉDIC') ||
    upper.includes('HONORARIOS') ||
    upper.includes('FIRMA')
  ) {
    return 'services';
  }

  return 'tech';
}

export function detectSectorWithAnalysis(text: string): DetectedMarketInfo {
  const upper = text.toUpperCase();

  const signals = {
    tech: [
      'SOFTWARE', 'SAAS', 'PLATAFORMA', 'ALERTA', 'NIT', 'CLOUD', 'APP',
      'FINTECH', 'LEGALTECH', 'API', 'DIAN', 'AUTOMATIZACIÓN', 'EXTEMPORANEIDAD', 'SISTEMA'
    ],
    manufacturing: [
      'ALIMENTO', 'FÁBRICA', 'MANUFACTURA', 'PRODUCCIÓN', 'INVIMA', 'BPM',
      'MATERIA PRIMA', 'PLANTA', 'ENVASES', 'EMPAQUE', 'MÁQUINA', 'HORNEADO', 'COSTO PRIMO'
    ],
    agro: [
      'AGRÍCOLA', 'CULTIVO', 'COSECHA', 'FRUTAS', 'CAMPO', 'AGROEXPORT',
      'GANAD', 'RIEGO', 'HECTÁREAS', 'FINAGRO', 'ICA', 'GLOBALGAP', 'SIEMBRA'
    ],
    tourism: [
      'RESTAURANTE', 'GASTRONOM', 'HOTEL', 'TURISMO', 'GLAMPING', 'COMENSAL',
      'COCINA', 'PLATOS', 'HOSPEDAJE', 'RECETA', 'CHEF', 'RNT'
    ],
    retail: [
      'TIENDA', 'COMERCIO', 'RETAIL', 'ROPA', 'CALZADO', 'DISTRIBUIDORA',
      'INVENTARIO', 'PUNTO DE VENTA', 'MERCANCÍA', 'E-COMMERCE', 'CATÁLOGO', 'OMNICANAL'
    ],
    services: [
      'CONSULTOR', 'ASESOR', 'CLÍNICA', 'SALUD', 'MÉDIC', 'HONORARIOS',
      'FIRMA', 'ODONTOL', 'AUDITOR', 'JURÍDICO', 'PATRIMONIO', 'TERAPIA'
    ]
  };

  const scores: Record<IndustrySector, { count: number; matched: string[] }> = {
    tech: { count: 0, matched: [] },
    manufacturing: { count: 0, matched: [] },
    agro: { count: 0, matched: [] },
    tourism: { count: 0, matched: [] },
    retail: { count: 0, matched: [] },
    services: { count: 0, matched: [] },
    other: { count: 0, matched: [] }
  };

  (Object.keys(signals) as (keyof typeof signals)[]).forEach((sec) => {
    signals[sec].forEach((word) => {
      if (upper.includes(word)) {
        scores[sec].count++;
        if (!scores[sec].matched.includes(word)) {
          scores[sec].matched.push(word);
        }
      }
    });
  });

  // Pick winner
  let bestSector: IndustrySector = 'tech';
  let maxScore = -1;

  (Object.keys(scores) as IndustrySector[]).forEach((sec) => {
    if (scores[sec].count > maxScore) {
      maxScore = scores[sec].count;
      bestSector = sec;
    }
  });

  const bestConfig = getIndustryConfig(bestSector);
  const matchedSignals = scores[bestSector].matched;

  const confidence: 'Alta' | 'Media' = maxScore >= 4 ? 'Alta' : 'Media';

  const reason = `Clasificado automáticamente como ${bestConfig.name} a partir de ${maxScore} señales sectoriales detectadas: [${matchedSignals.slice(0, 5).join(', ')}].`;

  return {
    sector: bestSector,
    sectorName: bestConfig.name,
    confidence,
    reason,
    keySignals: matchedSignals
  };
}
