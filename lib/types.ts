export type AuditScoreCategory = 'excelente' | 'bueno' | 'regular' | 'critico';

export interface RubricCriterion {
  id: string;
  name: string;
  questionTarget: 'que' | 'quien' | 'como' | 'horizonte' | 'posicionamiento' | 'alcance' | 'calidad' | 'inspiracion';
  weight: number;
  score: number;
  status: 'passed' | 'warning' | 'failed';
  feedback: string;
  detectedText?: string;
  suggestion: string;
}

export interface SectionAuditResult {
  title: string;
  originalText: string;
  score: number;
  category: AuditScoreCategory;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  optimizedRewrite: string;
  criteria: RubricCriterion[];
}

export interface CoherenceAuditResult {
  score: number;
  category: AuditScoreCategory;
  alignmentSummary: string;
  audienceMatch: boolean;
  temporalFeasibility: boolean;
  valuePropAlignment: boolean;
  observations: string[];
  horizonYear?: number | null;
  gapYears?: number;
}

export interface BusinessAuditReport {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  targetYear: string;
  timestamp: string;
  overallScore: number;
  overallCategory: AuditScoreCategory;
  misionAudit: SectionAuditResult;
  visionAudit: SectionAuditResult;
  coherenceAudit: CoherenceAuditResult;
  executiveSummary: string;
  actionPlan: {
    priority: 'Alta' | 'Media' | 'Baja';
    item: string;
    impact: string;
    section: 'Misión' | 'Visión' | 'Alineación General';
  }[];
}

export interface CompanyInputData {
  companyName: string;
  industry: string;
  location: string;
  targetYear: string;
  mision: string;
  vision: string;
  values?: string;
  valueProposition?: string;
  targetAudience?: string;
  sector?: IndustrySector;
}

export interface PresetCase {
  id: string;
  name: string;
  description: string;
  badge: string;
  data: CompanyInputData;
}

export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
  category: 'word' | 'excel' | 'pdf' | 'text' | 'other';
  summary?: string;
}

export interface AreaAuditResult {
  id: string;
  moduleCode: string;
  title: string;
  category: 'documental' | 'presupuestal';
  status: 'completed' | 'partial' | 'missing';
  progress: number; // 0 - 100
  score: number; // 0 - 100
  summary: string;
  strengths: string[];
  improvements: string[];
  guideRequirements: string[];
  extractedSnippet?: string;
}

export interface ExtractedQuestionDiagnosis {
  found: boolean;
  score: number; // 0 - 100
  label: string;
  detail: string;
}

export interface StrategicIdentityAudit {
  misionText?: string;
  misionScore: number;
  misionCategory: 'excelente' | 'bueno' | 'regular' | 'critico';
  misionQuestions: {
    quienesSomos: ExtractedQuestionDiagnosis;
    queHacemos: ExtractedQuestionDiagnosis;
    paraQuien: ExtractedQuestionDiagnosis;
    comoDiferenciador: ExtractedQuestionDiagnosis;
  };
  misionStrengths: string[];
  misionImprovements: string[];
  aiOptimizedMission: string;

  visionText?: string;
  visionScore: number;
  visionCategory: 'excelente' | 'bueno' | 'regular' | 'critico';
  visionChecklist: {
    hasTargetYear: boolean;
    targetYear?: string;
    hasLeadership: boolean;
    hasTerritorialScope: boolean;
    territorialScope?: string;
  };
  visionStrengths: string[];
  visionImprovements: string[];
  aiOptimizedVision: string;
}

export interface DocumentAuditReport {
  id: string;
  projectName: string;
  timestamp: string;
  filesAnalyzed: UploadedFileMeta[];
  overallProgress: number;
  documentalProgress: number;
  financialProgress: number;
  completedModulesCount: number;
  partialModulesCount: number;
  missingModulesCount: number;
  areas: AreaAuditResult[];
  extractedCompanyData?: Partial<CompanyInputData>;
  detectedMarket?: DetectedMarketInfo;
  strategicIdentityAudit?: StrategicIdentityAudit;
  financialHighlights?: {
    sheetsDetected: string[];
    hasInvestmentSheet: boolean;
    hasCashFlowSheet: boolean;
    hasBreakEvenSheet: boolean;
    hasPayrollSheet: boolean;
    notes: string[];
  };
}

export interface DetectedMarketInfo {
  sector: IndustrySector;
  sectorName: string;
  confidence: 'Alta' | 'Media';
  reason: string;
  keySignals: string[];
}

export type IndustrySector =
  | 'tech'
  | 'retail'
  | 'services'
  | 'manufacturing'
  | 'agro'
  | 'tourism'
  | 'other';

export interface IndustrySectorConfig {
  id: IndustrySector;
  name: string;
  badge: string;
  iconName: string;
  description: string;
  keyEvaluationPoints: string[];
  sampleBusinessTypes: string[];
  misionFormula: string;
  visionFormula: string;
  sampleCompany: CompanyInputData;
}

export interface DofaItem {
  id: string;
  text: string;
  impact: 'Alta' | 'Media' | 'Baja';
}

export interface DofaCrossStrategy {
  type: 'FO' | 'DO' | 'FA' | 'DA';
  title: string;
  subtitle: string;
  strategies: string[];
}

export interface DofaReport {
  strengths: DofaItem[];
  weaknesses: DofaItem[];
  opportunities: DofaItem[];
  threats: DofaItem[];
  crossStrategies: DofaCrossStrategy[];
}
