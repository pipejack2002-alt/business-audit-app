import { PresetCase } from './types';

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'tributoapp',
    name: 'TributoApp S.A.S.',
    description: 'Plataforma LegalTech & FinTech de gestión de calendario y alertas tributarias DIAN.',
    badge: 'Caso Real (TributoApp)',
    data: {
      companyName: 'TributoApp S.A.S.',
      industry: 'Tecnología Tributaria / FinTech / LegalTech',
      location: 'Barranquilla, Atlántico (Colombia)',
      targetYear: '2040',
      mision: 'Somos TributoApp S.A.S., una empresa con sede en Barranquilla, comprometida con acompañar a contribuyentes, independientes, empresas y contadores públicos en el cumplimiento puntual y organizado de sus obligaciones tributarias. A través de nuestra plataforma, combinamos automatización de alertas por último dígito de NIT y análisis de perfil fiscal para evitar sanciones por extemporaneidad.',
      vision: 'Para el año 2040, ser la plataforma digital líder en gestión de calendario tributario y alertas de cumplimiento fiscal en la región Caribe y Colombia. Nos distinguiremos por la actualización constante frente a las reformas tributarias, la precisión en la información distrital y nacional, y una atención técnica de alta calidad.',
      values: '• Precisión Normativa: Verificación rigurosa con fuentes oficiales de la DIAN y entes distritales.\n• Puntualidad Absoluta: Sistemas de alertas automáticas ejecutados con anticipación oportuna.\n• Seguridad y Confianza: Confidencialidad y custodia estricta de perfiles tributarios.',
      valueProposition: 'Alertas predictivas automatizadas por último dígito de NIT que eliminan el 100% del riesgo de extemporaneidad y sanciones tributarias ante la DIAN y Secretarías de Hacienda locales.',
      targetAudience: 'Contribuyentes personas naturales, trabajadores independientes, pequeñas y medianas empresas (PYMES) y contadores públicos con cartera múltiple.'
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
