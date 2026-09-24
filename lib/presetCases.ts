import { PresetCase } from './types';

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'cloudfiscal',
    name: 'CloudFiscal Tech S.A.S. (Caso de Referencia SaaS)',
    description: 'Plataforma B2B para automatización de calendarios tributarios y cumplimiento normativo.',
    badge: 'Ejemplo de Referencia',
    data: {
      companyName: 'CloudFiscal Tech S.A.S.',
      industry: 'Tecnología / Software SaaS / LegalTech',
      location: 'Bogotá, Colombia',
      targetYear: '2030',
      mision: 'Somos CloudFiscal Tech S.A.S., una empresa especializada en optimizar el cumplimiento tributario y contable para empresas y profesionales independientes mediante una plataforma en la nube intuitiva y segura, reduciendo riesgos de sanción y ahorrando tiempo operativo.',
      vision: 'Para el año 2030, posicionarnos como la solución SaaS líder en gestión tributaria automatizada para más de 10.000 empresas en Latinoamérica, destacándonos por la precisión algorítmica y la interoperabilidad contable.',
      values: '• Precisión y Cumplimiento Normativo\n• Seguridad de la Información y Cifrado Bancario\n• Innovación Continua y Simplicidad de Uso',
      valueProposition: 'Automatización inteligente de plazos y cálculo predictivo que disminuye en un 95% el riesgo de extemporaneidad en declaraciones fiscales.',
      targetAudience: 'Contadores públicos independientes, directores financieros (CFOs) y pequeñas y medianas empresas (PYMES).'
    }
  },
  {
    id: 'logirapido',
    name: 'LogiRápido Express (Caso de Estudio: Errores Frecuentes)',
    description: 'Empresa logística con misión ambigua y visión sin año ni métricas.',
    badge: 'Caso con Falencias',
    data: {
      companyName: 'LogiRápido Express',
      industry: 'Transporte y Encomiendas',
      location: 'Bogotá, Colombia',
      targetYear: '',
      mision: 'Somos una empresa que hace entregas rápidas de paquetes para que la gente quede contenta con su servicio.',
      vision: 'Ser la mejor empresa del mundo y la más reconocida por todos los clientes en todas partes.',
      values: 'Responsabilidad, amabilidad y trabajo duro.',
      valueProposition: 'Entregamos rápido.',
      targetAudience: 'Todo el mundo.'
    }
  },
  {
    id: 'bionova',
    name: 'BioNova Health Tech',
    description: 'Startup de diagnóstico clínico preventivo con inteligencia artificial.',
    badge: 'SaaS Innovador',
    data: {
      companyName: 'BioNova Health Tech',
      industry: 'Salud Digital / DeepTech',
      location: 'Medellín, Colombia',
      targetYear: '2030',
      mision: 'Empoderar a centros de salud ambulatorios y pacientes crónicos mediante algoritmos de cribado temprano no invasivo, reduciendo en un 40% los tiempos de diagnóstico precoz a través de tecnología médica accesible.',
      vision: 'Para el año 2030, ser el estándar de referencia en tele-diagnóstico asistido por IA en Latinoamérica, conectando más de 500 instituciones hospitalarias con una precisión clínica superior al 98%.',
      values: '• Rigor Científico y Bioético\n• Accesibilidad Médica Universal\n• Innovación Centrada en el Paciente',
      valueProposition: 'Diagnóstico predictivo de patologías cardiovasculares en menos de 10 minutos con correlación clínica validada.',
      targetAudience: 'Clínicas ambulatorias, EPS, centros médicos privados y pacientes de medicina prepagada.'
    }
  },
  {
    id: 'nuevo',
    name: 'Nueva Empresa (Formulario en Blanco)',
    description: 'Audita desde cero la misión y visión de cualquier emprendimiento o corporación.',
    badge: 'Auditoría Libre',
    data: {
      companyName: '',
      industry: '',
      location: '',
      targetYear: '2030',
      mision: '',
      vision: '',
      values: '',
      valueProposition: '',
      targetAudience: ''
    }
  }
];
