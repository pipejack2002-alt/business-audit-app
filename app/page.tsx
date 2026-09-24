'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ScoreMeter from '../components/ScoreMeter';
import CriterionCard from '../components/CriterionCard';
import RewriteCard from '../components/RewriteCard';
import ActionPlanTable from '../components/ActionPlanTable';
import PrintReportModal from '../components/PrintReportModal';
import DocumentDropzone from '../components/DocumentDropzone';
import ProjectAreaAuditView from '../components/ProjectAreaAuditView';
import IndustrySelector from '../components/IndustrySelector';
import DofaAuditView from '../components/DofaAuditView';
import UniversalBusinessAssistant from '../components/UniversalBusinessAssistant';
import { PRESET_CASES } from '../lib/presetCases';
import { CompanyInputData, DocumentAuditReport, IndustrySector } from '../lib/types';
import { runFullBusinessAudit } from '../lib/auditEngine';
import { INDUSTRY_SECTORS, detectSectorFromText } from '../lib/industryBenchmarks';
import {
  LayoutDashboard,
  Compass,
  Target,
  TrendingUp,
  BookOpenCheck,
  Building2,
  Calendar,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  AlertCircle,
  FolderKanban,
  UploadCloud,
  FileText,
  Layers,
  Wand2,
  ShieldAlert
} from 'lucide-react';

export default function Home() {
  const [activePresetId, setActivePresetId] = useState<string>('cloudfiscal');
  const [companyData, setCompanyData] = useState<CompanyInputData>({
    ...PRESET_CASES[0].data,
    sector: 'tech'
  });
  const [activeTab, setActiveTab] = useState<
    'documents' | 'dashboard' | 'mision' | 'vision' | 'dofa' | 'industry' | 'coherence' | 'normative'
  >('documents');
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [documentReport, setDocumentReport] = useState<DocumentAuditReport | null>(null);

  // Real-time audit recalculation
  const auditReport = useMemo(() => {
    return runFullBusinessAudit(companyData);
  }, [companyData]);

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const found = PRESET_CASES.find((p) => p.id === presetId);
    if (found) {
      setCompanyData({
        ...found.data,
        sector: found.data.sector || detectSectorFromText(found.data.industry + ' ' + found.data.companyName)
      });
    }
  };

  const handleResetNew = () => {
    setActivePresetId('nuevo');
    setCompanyData({
      companyName: '',
      industry: '',
      location: '',
      targetYear: '2030',
      sector: 'other',
      mision: '',
      vision: '',
      values: '',
      valueProposition: '',
      targetAudience: ''
    });
    setIsFormExpanded(true);
  };

  const handleApplyExtractedData = (extracted: Partial<CompanyInputData>) => {
    setCompanyData((prev) => {
      const updated = {
        ...prev,
        ...extracted
      };
      if (!updated.sector) {
        updated.sector = detectSectorFromText((updated.industry || '') + ' ' + (updated.companyName || ''));
      }
      return updated;
    });
    setIsFormExpanded(true);
  };

  const handleSelectSector = (sector: IndustrySector) => {
    setCompanyData((prev) => ({
      ...prev,
      sector
    }));
  };

  const handleLoadSampleCompany = (sample: CompanyInputData) => {
    setCompanyData(sample);
    setActivePresetId('nuevo');
    setIsFormExpanded(true);
  };

  const handleApplyGeneratedCompany = (generated: CompanyInputData) => {
    setCompanyData(generated);
    setIsFormExpanded(true);
    setActiveTab('dashboard');
  };

  // Field change helper
  const updateField = (field: keyof CompanyInputData, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onResetNew={handleResetNew}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Alert for Preloaded Presets */}
        <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-white">
                  Auditoría Activa: {companyData.companyName || 'Empresa en formulación'}
                </h2>
                <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  {auditReport.overallCategory.toUpperCase()}
                </span>
                {documentReport && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {documentReport.overallProgress}% Avance Documental & Financiero
                  </span>
                )}
                {companyData.sector && (
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                    Sector: {companyData.sector.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluando cumplimiento técnico conforme a la metodología oficial institucional (¿Qué?, ¿Quién?, ¿Cómo?, Horizonte Temporal y Matriz DOFA).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsAssistantOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Asistente de Formulación</span>
            </button>

            <button
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer"
            >
              <span>{isFormExpanded ? 'Ocultar Editor' : 'Modificar Textos'}</span>
              {isFormExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Editor Form */}
        {isFormExpanded && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Parámetros y Declaraciones de la Empresa
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Los cambios se auditan automáticamente en tiempo real
              </span>
            </div>

            {/* General parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Nombre de la Empresa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Ej. TributoApp S.A.S."
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Sector Económico
                </label>
                <select
                  value={companyData.sector || 'tech'}
                  onChange={(e) => updateField('sector', e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {INDUSTRY_SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name.split('/')[0].trim()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Industria / Detalle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    placeholder="Ej. Tecnología Tributaria"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Ubicación Geográfica
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Ej. Barranquilla, Colombia"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Año Meta Proyectado
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyData.targetYear}
                    onChange={(e) => updateField('targetYear', e.target.value)}
                    placeholder="Ej. 2030 o 2040"
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Strategic Statements Textareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Misión textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Misión de la Empresa</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {companyData.mision ? companyData.mision.split(/\s+/).filter(Boolean).length : 0} palabras
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={companyData.mision}
                  onChange={(e) => updateField('mision', e.target.value)}
                  placeholder="Redacte la misión respondiendo a: ¿Qué necesidad resuelve?, ¿A quién va dirigida? y ¿Cómo se satisface?"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed resize-y"
                />
                <p className="text-[11px] text-slate-500">
                  Regla del formato: Debe contener ¿Qué?, ¿Quién? y ¿Cómo?.
                </p>
              </div>

              {/* Visión textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Visión de la Empresa</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {companyData.vision ? companyData.vision.split(/\s+/).filter(Boolean).length : 0} palabras
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={companyData.vision}
                  onChange={(e) => updateField('vision', e.target.value)}
                  placeholder="Redacte la visión especificando: Año meta (ej. 2030), posicionamiento de liderazgo y alcance geográfico."
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
                />
                <p className="text-[11px] text-slate-500">
                  Regla del formato: Debe incluir horizonte temporal, posicionamiento y delimitación geográfica.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          {/* TAB 0: DOCUMENT AUDIT & ADVANCE */}
          <button
            onClick={() => setActiveTab('documents')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-slate-900 border-t-2 border-cyan-400 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <span>Auditoría de Documentos & Avance</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              {documentReport ? `${documentReport.overallProgress}%` : 'Subir Archivos'}
            </span>
          </button>

          {/* TAB 1: DASHBOARD */}
          <button
            onClick={() => setActiveTab('dashboard')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 border-t-2 border-indigo-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Tablero & Dictamen</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              {auditReport.overallScore}
            </span>
          </button>

          {/* TAB 2: MISIÓN */}
          <button
            onClick={() => setActiveTab('mision')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'mision'
                ? 'bg-slate-900 border-t-2 border-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Auditoría de Misión</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
              {auditReport.misionAudit.score}
            </span>
          </button>

          {/* TAB 3: VISIÓN */}
          <button
            onClick={() => setActiveTab('vision')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'vision'
                ? 'bg-slate-900 border-t-2 border-indigo-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Auditoría de Visión</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              {auditReport.visionAudit.score}
            </span>
          </button>

          {/* TAB 4: MATRIZ DOFA (NUEVO) */}
          <button
            onClick={() => setActiveTab('dofa')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'dofa'
                ? 'bg-slate-900 border-t-2 border-emerald-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Matriz DOFA & Estrategia (5.6)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              FO/DO/FA
            </span>
          </button>

          {/* TAB 5: ENFOQUE POR SECTOR (NUEVO) */}
          <button
            onClick={() => setActiveTab('industry')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'industry'
                ? 'bg-slate-900 border-t-2 border-amber-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Enfoque por Industria</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
              6 Sectores
            </span>
          </button>

          {/* TAB 6: COHERENCIA Y FINANZAS */}
          <button
            onClick={() => setActiveTab('coherence')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'coherence'
                ? 'bg-slate-900 border-t-2 border-purple-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Alineación & Finanzas 12M</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-mono">
              {auditReport.coherenceAudit.score}
            </span>
          </button>

          {/* TAB 7: ESTÁNDARES DEL FORMATO */}
          <button
            onClick={() => setActiveTab('normative')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold tracking-wide transition whitespace-nowrap cursor-pointer ${
              activeTab === 'normative'
                ? 'bg-slate-900 border-t-2 border-slate-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-slate-400" />
            <span>Estándares del Formato</span>
          </button>
        </div>

        {/* TAB 0 CONTENT: DOCUMENT AUDIT & ADVANCE */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <DocumentDropzone
              onAuditComplete={(report) => {
                setDocumentReport(report);
              }}
              onApplyExtractedData={handleApplyExtractedData}
            />

            {documentReport ? (
              <ProjectAreaAuditView
                report={documentReport}
                onApplyExtractedData={handleApplyExtractedData}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <UploadCloud className="w-10 h-10 text-indigo-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">
                  Aún no has cargado documentos para auditar
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Arrastra tu archivo .docx (Plan de Negocio) o .xlsx (Finanzas 12M) en la zona superior, o haz clic en &ldquo;Auditar Archivos de TributoApp&rdquo; para ver la evaluación en tiempo real.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: DASHBOARD & EXECUTIVE SCORE */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Score Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Overall Score */}
              <div className="md:col-span-2 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Puntuación Global de Solidez
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {companyData.companyName || 'Empresa Auditada'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                    {auditReport.executiveSummary}
                  </p>
                </div>
                <div className="shrink-0">
                  <ScoreMeter
                    score={auditReport.overallScore}
                    category={auditReport.overallCategory}
                    size={140}
                    label="Índice Global"
                  />
                </div>
              </div>

              {/* Sub-Score Misión */}
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Misión
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Peso: 40%</span>
                </div>
                <div className="my-3 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">
                      {auditReport.misionAudit.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                    <p className="text-[11px] font-semibold text-cyan-400 capitalize">
                      {auditReport.misionAudit.category}
                    </p>
                  </div>
                  <ScoreMeter
                    score={auditReport.misionAudit.score}
                    category={auditReport.misionAudit.category}
                    size={80}
                    showLabel={false}
                  />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {auditReport.misionAudit.summary}
                </p>
              </div>

              {/* Sub-Score Visión */}
              <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> Visión
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Peso: 35%</span>
                </div>
                <div className="my-3 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-white">
                      {auditReport.visionAudit.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                    <p className="text-[11px] font-semibold text-indigo-400 capitalize">
                      {auditReport.visionAudit.category}
                    </p>
                  </div>
                  <ScoreMeter
                    score={auditReport.visionAudit.score}
                    category={auditReport.visionAudit.category}
                    size={80}
                    showLabel={false}
                  />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {auditReport.visionAudit.summary}
                </p>
              </div>
            </div>

            {/* Prioritized Action Plan Matrix */}
            <ActionPlanTable actionPlan={auditReport.actionPlan} />

            {/* Rewrites Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RewriteCard
                type="mision"
                originalText={companyData.mision}
                optimizedText={auditReport.misionAudit.optimizedRewrite}
                score={auditReport.misionAudit.score}
                strengths={auditReport.misionAudit.strengths}
                weaknesses={auditReport.misionAudit.weaknesses}
                onApply={(rewritten) => updateField('mision', rewritten)}
              />

              <RewriteCard
                type="vision"
                originalText={companyData.vision}
                optimizedText={auditReport.visionAudit.optimizedRewrite}
                score={auditReport.visionAudit.score}
                strengths={auditReport.visionAudit.strengths}
                weaknesses={auditReport.visionAudit.weaknesses}
                onApply={(rewritten) => updateField('vision', rewritten)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: AUDITORÍA DE MISIÓN */}
        {activeTab === 'mision' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" /> Diagnóstico Especializado de Misión (Sección 5.1)
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Evaluación de la Razón de Ser y Orientación al Cliente
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {auditReport.misionAudit.summary}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                <ScoreMeter
                  score={auditReport.misionAudit.score}
                  category={auditReport.misionAudit.category}
                  size={110}
                  label="Puntaje Misión"
                />
              </div>
            </div>

            {/* 4 Rubric Cards for Mission */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Desglose de Criterios Institucionales de Misión
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditReport.misionAudit.criteria.map((criterion) => (
                  <CriterionCard key={criterion.id} criterion={criterion} />
                ))}
              </div>
            </div>

            {/* Rewrite Proposal for Mission */}
            <RewriteCard
              type="mision"
              originalText={companyData.mision}
              optimizedText={auditReport.misionAudit.optimizedRewrite}
              score={auditReport.misionAudit.score}
              strengths={auditReport.misionAudit.strengths}
              weaknesses={auditReport.misionAudit.weaknesses}
              onApply={(rewritten) => updateField('mision', rewritten)}
            />
          </div>
        )}

        {/* TAB 3: AUDITORÍA DE VISIÓN */}
        {activeTab === 'vision' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Diagnóstico Especializado de Visión (Sección 5.2)
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Evaluación del Horizonte Temporal y Posicionamiento
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {auditReport.visionAudit.summary}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                <ScoreMeter
                  score={auditReport.visionAudit.score}
                  category={auditReport.visionAudit.category}
                  size={110}
                  label="Puntaje Visión"
                />
              </div>
            </div>

            {/* 4 Rubric Cards for Vision */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Desglose de Criterios Institucionales de Visión
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditReport.visionAudit.criteria.map((criterion) => (
                  <CriterionCard key={criterion.id} criterion={criterion} />
                ))}
              </div>
            </div>

            {/* Rewrite Proposal for Vision */}
            <RewriteCard
              type="vision"
              originalText={companyData.vision}
              optimizedText={auditReport.visionAudit.optimizedRewrite}
              score={auditReport.visionAudit.score}
              strengths={auditReport.visionAudit.strengths}
              weaknesses={auditReport.visionAudit.weaknesses}
              onApply={(rewritten) => updateField('vision', rewritten)}
            />
          </div>
        )}

        {/* TAB 4: MATRIZ DOFA & ESTRATEGIAS (NUEVO) */}
        {activeTab === 'dofa' && (
          <DofaAuditView companyData={companyData} />
        )}

        {/* TAB 5: ENFOQUE POR SECTOR / INDUSTRIA (NUEVO) */}
        {activeTab === 'industry' && (
          <IndustrySelector
            currentSector={companyData.sector || 'tech'}
            onSelectSector={handleSelectSector}
            onLoadSampleCompany={handleLoadSampleCompany}
          />
        )}

        {/* TAB 6: ALINEACIÓN & FINANZAS */}
        {activeTab === 'coherence' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-500/30 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Coherencia Cruzada & Modelo a 12 Meses
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Alineación entre Promesas Estratégicas y Viabilidad Operativa
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {auditReport.coherenceAudit.alignmentSummary}
                </p>
              </div>
              <div className="shrink-0">
                <ScoreMeter
                  score={auditReport.coherenceAudit.score}
                  category={auditReport.coherenceAudit.category}
                  size={110}
                  label="Índice Coherencia"
                />
              </div>
            </div>

            {/* Observations and Checkpoints */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Segmento de Clientes</span>
                  {auditReport.coherenceAudit.audienceMatch ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Coherente
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      Revisar
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Verifica que los perfiles descritos en la Misión coincidan con el público objetivo definido en el estudio de mercado.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Horizonte Temporal</span>
                  {auditReport.coherenceAudit.temporalFeasibility ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Factible
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                      Inconsistente
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {auditReport.coherenceAudit.gapYears
                    ? `Horizonte proyectado a ${auditReport.coherenceAudit.gapYears} años desde la actualidad.`
                    : 'Sin año meta detectado en la redacción.'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Propuesta de Valor</span>
                  {auditReport.coherenceAudit.valuePropAlignment ? (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      Alineada
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                      Parcial
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sincronización entre la ventaja competitiva declarada y los servicios monetizables en el plan de ingresos.
                </p>
              </div>
            </div>

            {/* Checkpoints list */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Observaciones Estratégicas Cruzadas
              </h4>
              <ul className="space-y-2.5">
                {auditReport.coherenceAudit.observations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 7: ESTÁNDARES DEL FORMATO */}
        {activeTab === 'normative' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpenCheck className="w-4 h-4" /> Metodología Oficial del Formato de Plan de Negocio
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Guía Institucional para la Formulación del Capítulo Organizacional (5.0)
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-3xl">
                Esta sección sintetiza los requerimientos exigidos por la plantilla oficial para garantizar que el plan de negocio sea aprobado ante evaluadores, convocatorias e inversionistas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Misión Standard */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Estándar de la Misión (Sección 5.1)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La misión es la razón de ser de la empresa, su propósito y da sentido y guía a las actividades operativas. Toda misión debe contestar obligatoriamente:
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400 font-mono">1. ¿Qué?</span>
                    <span>La necesidad específica que satisface o el problema concreto que resuelve en el mercado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400 font-mono">2. ¿Quién?</span>
                    <span>Los clientes a los cuales se pretende llegar (perfiles delimitados, evitando &ldquo;todo el mundo&rdquo;).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-cyan-400 font-mono">3. ¿Cómo?</span>
                    <span>La forma, mecanismo técnico, plataforma o proceso en que se satisfarán dichas necesidades.</span>
                  </li>
                </ul>
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                  Debe ser amplia en línea de productos, motivadora para el equipo y congruente con los valores.
                </div>
              </div>

              {/* Box 2: Visión Standard */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">
                    Estándar de la Visión (Sección 5.2)
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La visión describe la posición futura que alcanzará la organización. Toda visión debe contemplar:
                </p>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400 font-mono">1. Horizonte Temporal</span>
                    <span>Año meta explícito (ej. Para el año 2030, 2040...).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400 font-mono">2. Posicionamiento</span>
                    <span>Ser la organización o plataforma líder y referente de la industria.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400 font-mono">3. Alcance Geográfico</span>
                    <span>Delimitación territorial clara (ciudad, región Caribe, territorio nacional, etc.).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400 font-mono">4. Distingos de Vanguardia</span>
                    <span>Atributos de calidad, actualización continua y tecnología avanzada.</span>
                  </li>
                </ul>
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                  Ejemplo de referencia: &ldquo;Para el año 2040, ser la plataforma digital líder en gestión de calendario tributario...&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            AuditPlan Pro • Sistema de Auditoría y Verificación de Planes de Negocio Multi-Sector
          </div>
          <div className="flex items-center gap-4">
            <span>Next.js 15 & React 19</span>
            <span>•</span>
            <span className="text-indigo-400">Totalmente Independiente</span>
          </div>
        </div>
      </footer>

      {/* Print / PDF Modal */}
      <PrintReportModal
        report={auditReport}
        companyData={companyData}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Universal Formulation Assistant Modal */}
      <UniversalBusinessAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onApplyGeneratedCompany={handleApplyGeneratedCompany}
      />
    </div>
  );
}
