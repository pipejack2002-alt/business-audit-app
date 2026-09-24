import { CompanyInputData, DofaReport, DofaItem, DofaCrossStrategy, IndustrySector } from './types';
import { getIndustryConfig } from './industryBenchmarks';

export function generateStrategicDofa(company: CompanyInputData): DofaReport {
  const sector = company.sector || 'tech';
  const indConfig = getIndustryConfig(sector);

  const strengths: DofaItem[] = [];
  const weaknesses: DofaItem[] = [];
  const opportunities: DofaItem[] = [];
  const threats: DofaItem[] = [];

  // 1. FORTALEZAS (INTERNAS)
  if (company.valueProposition) {
    strengths.push({
      id: 'f-1',
      text: `Propuesta de valor clara: "${company.valueProposition.substring(0, 100)}..."`,
      impact: 'Alta'
    });
  } else {
    strengths.push({
      id: 'f-1',
      text: 'Definición de modelo de negocio con enfoque en solución a un dolor de mercado evidente.',
      impact: 'Alta'
    });
  }

  if (company.mision && company.mision.length > 50) {
    strengths.push({
      id: 'f-2',
      text: 'Misión articulada respondiendo a necesidad, público objetivo y mecanismo de entrega.',
      impact: 'Alta'
    });
  }

  if (sector === 'tech') {
    strengths.push({
      id: 'f-3',
      text: 'Solución escalable basada en software con bajo costo marginal por nuevo usuario.',
      impact: 'Alta'
    });
    strengths.push({
      id: 'f-4',
      text: 'Automatización de alertas y cruce de datos que reduce el factor de error humano.',
      impact: 'Media'
    });
  } else if (sector === 'retail') {
    strengths.push({
      id: 'f-3',
      text: 'Enfoque omnicanal con proximidad comercial y atención directa y personalizada.',
      impact: 'Alta'
    });
    strengths.push({
      id: 'f-4',
      text: 'Catálogo de productos diversificado y adaptado al poder adquisitivo local.',
      impact: 'Media'
    });
  } else if (sector === 'manufacturing') {
    strengths.push({
      id: 'f-3',
      text: 'Estandarización de procesos productivos bajo normativa de Buenas Prácticas (BPM).',
      impact: 'Alta'
    });
    strengths.push({
      id: 'f-4',
      text: 'Control directo de la formulación y calidad final del producto terminado.',
      impact: 'Media'
    });
  } else if (sector === 'agro') {
    strengths.push({
      id: 'f-3',
      text: 'Condiciones agroecológicas óptimas y compromiso con agricultura regenerativa y limpia.',
      impact: 'Alta'
    });
    strengths.push({
      id: 'f-4',
      text: 'Trazabilidad desde el origen del cultivo hasta el despacho del producto.',
      impact: 'Media'
    });
  } else if (sector === 'tourism') {
    strengths.push({
      id: 'f-3',
      text: 'Propuesta gastronómica y de hospitalidad con identidad y arraigo cultural.',
      impact: 'Alta'
    });
    strengths.push({
      id: 'f-4',
      text: 'Excelente ubicación geográfica y atmósfera diseñada para generar recordación.',
      impact: 'Media'
    });
  } else {
    strengths.push({
      id: 'f-3',
      text: 'Especialización técnica y ética profesional de los socios fundadores.',
      impact: 'Alta'
    });
  }

  // 2. DEBILIDADES (INTERNAS)
  if (!company.values || company.values.length < 20) {
    weaknesses.push({
      id: 'd-1',
      text: 'Falta formalizar la declaración de principios y valores organizacionales en el manual.',
      impact: 'Media'
    });
  }

  if (!company.targetYear || parseInt(company.targetYear) < 2027) {
    weaknesses.push({
      id: 'd-2',
      text: 'Horizonte de visión a corto plazo; requiere proyectarse con mayor ambición estratégica (5 a 10 años).',
      impact: 'Media'
    });
  }

  weaknesses.push({
    id: 'd-3',
    text: 'Etapa temprana en tracción comercial con presupuesto inicial de mercadeo limitado.',
    impact: 'Alta'
  });
  weaknesses.push({
    id: 'd-4',
    text: 'Alta dependencia del equipo fundador en la ejecución operativa del día a día.',
    impact: 'Media'
  });

  // 3. OPORTUNIDADES (EXTERNAS)
  if (sector === 'tech') {
    opportunities.push({
      id: 'o-1',
      text: 'Acelerada digitalización tributaria e imposición de nuevas obligaciones electrónicas por la DIAN.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-2',
      text: 'Creciente mercado de trabajadores independientes y PYMES que buscan evitar sanciones fiscales.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-3',
      text: 'Alianzas con colegios de contadores, gremios empresariales y pasarelas de pago.',
      impact: 'Media'
    });
  } else if (sector === 'retail') {
    opportunities.push({
      id: 'o-1',
      text: 'Expansión de ventas por canales conversacionales (WhatsApp Business y redes sociales).',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-2',
      text: 'Preferencia de los consumidores por marcas locales con políticas de sostenibilidad.',
      impact: 'Media'
    });
    opportunities.push({
      id: 'o-3',
      text: 'Negociación de compras por volumen con fabricantes directos para elevar el margen bruto.',
      impact: 'Alta'
    });
  } else if (sector === 'manufacturing') {
    opportunities.push({
      id: 'o-1',
      text: 'Tendencia global de consumo de productos saludables, limpios de conservantes y con empaques eco.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-2',
      text: 'Acceso a convocatorias de fomento industrial, Fondo Emprender y créditos verdes.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-3',
      text: 'Apertura de nuevos canales de distribución minorista e institucional.',
      impact: 'Media'
    });
  } else if (sector === 'agro') {
    opportunities.push({
      id: 'o-1',
      text: 'Alta demanda y precios de exportación para frutas tropicales y cafés especiales.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-2',
      text: 'Programas de crédito de fomento agropecuario (Finagro) con tasas subsidiadas.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-3',
      text: 'Certificación en mercados de bonos de carbono por preservación forestal.',
      impact: 'Media'
    });
  } else {
    opportunities.push({
      id: 'o-1',
      text: 'Creciente demanda de servicios corporativos especializados ante complejidades normativas.',
      impact: 'Alta'
    });
    opportunities.push({
      id: 'o-2',
      text: 'Automatización de procesos de consultoría mediante IA para elevar márgenes de utilidad.',
      impact: 'Media'
    });
  }

  // 4. AMENAZAS (EXTERNAS)
  if (sector === 'tech') {
    threats.push({
      id: 'a-1',
      text: 'Modificaciones repentinas en las APIs, portales o cronogramas oficiales de la DIAN.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-2',
      text: 'Competidores tradicionales de software contable (Siigo, World Office) integrando funciones similares.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-3',
      text: 'Riesgos de ciberseguridad, caídas de servidores o filtración de perfiles tributarios.',
      impact: 'Media'
    });
  } else if (sector === 'retail') {
    threats.push({
      id: 'a-1',
      text: 'Inflación y volatilidad en los costos de adquisición de mercancía importada o fletes.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-2',
      text: 'Competencia desleal o guerra de precios de cadenas de descuento masivo.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-3',
      text: 'Contracción del consumo de los hogares en periodos de desaceleración económica.',
      impact: 'Media'
    });
  } else if (sector === 'manufacturing') {
    threats.push({
      id: 'a-1',
      text: 'Alzas imprevistas en los precios de materias primas e insumos de empaque.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-2',
      text: 'Retrasos en trámites regulatorios ante entidades sanitarias (INVIMA).',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-3',
      text: 'Fallos mecánicos imprevistos en maquinaria crítica que detengan la línea de producción.',
      impact: 'Media'
    });
  } else if (sector === 'agro') {
    threats.push({
      id: 'a-1',
      text: 'Fenómenos climáticos extremos (sequías prolongadas o lluvias de alta intensidad).',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-2',
      text: 'Plagas o enfermedades fitosanitarias que impacten el rendimiento por hectárea.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-3',
      text: 'Fluctuaciones en las tasas de cambio de exportación (revaluación del peso).',
      impact: 'Media'
    });
  } else {
    threats.push({
      id: 'a-1',
      text: 'Llegada de firmas consultoras de gran escala con mayor músculo comercial.',
      impact: 'Alta'
    });
    threats.push({
      id: 'a-2',
      text: 'Rotación de profesionales clave hacia el mercado laboral internacional.',
      impact: 'Media'
    });
  }

  // 5. CRUCE ESTRATÉGICO INSTITUCIONAL (FO, DO, FA, DA)
  const crossStrategies: DofaCrossStrategy[] = [
    {
      type: 'FO',
      title: 'Estrategias Ofensivas (FO • Maxi-Maxi)',
      subtitle: 'Utilizar las fortalezas internas para explotar las oportunidades de mercado',
      strategies: [
        `Aprovechar la ventaja de "${company.valueProposition?.substring(0, 70) || 'la propuesta innovadora'}" para capturar la creciente demanda de ${indConfig.sampleBusinessTypes[0].toLowerCase()}.`,
        `Desplegar campañas de captación digital apoyadas en la estructura de costos ligeros y la calidad demostrada del servicio.`,
        `Consolidar alianzas con canales estratégicos e influenciadores del sector para acelerar la penetración de mercado.`
      ]
    },
    {
      type: 'DO',
      title: 'Estrategias Adaptativas / Reorientación (DO • Mini-Maxi)',
      subtitle: 'Superar debilidades internas aprovechando las oportunidades externas',
      strategies: [
        `Acceder a programas de cofinanciación (Fondo Emprender, convocatorias MinCiencias) para robustecer el capital de trabajo y la inversión en marketing.`,
        `Estructurar procesos operativos y documentar manuales de funciones para reducir la dependencia exclusiva de los fundadores.`,
        `Formalizar convenios comerciales que permitan apalancar la distribución sin incurrir en costos fijos elevados.`
      ]
    },
    {
      type: 'FA',
      title: 'Estrategias Defensivas (FA • Maxi-Mini)',
      subtitle: 'Usar las fortalezas internas para blindarse y neutralizar las amenazas del entorno',
      strategies: [
        `Fidelizar a los clientes actuales mediante atención cercana y valor agregado que los competidores masivos no pueden ofrecer.`,
        `Reforzar los protocolos de calidad, respaldo técnico y certificaciones para generar barreras de entrada ante nuevos entrantes.`,
        `Monitorear permanentemente los cambios normativos para anticipar actualizaciones antes que la competencia.`
      ]
    },
    {
      type: 'DA',
      title: 'Estrategias de Supervivencia (DA • Mini-Mini)',
      subtitle: 'Minimizar debilidades y evitar que las amenazas externas comprometan el negocio',
      strategies: [
        `Mantener una estricta disciplina financiera con fondo de reserva de mínimo 3 meses de costos fijos para amortiguar contingencias.`,
        `Diversificar la cartera de clientes para evitar concentración de ingresos en pocos compradores.`,
        `Establecer planes de contingencia técnica y acuerdos de nivel de servicio (SLA) con proveedores clave.`
      ]
    }
  ];

  return {
    strengths,
    weaknesses,
    opportunities,
    threats,
    crossStrategies
  };
}
