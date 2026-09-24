'use client';

import React, { useState } from 'react';
import {
  DocumentAuditReport,
  AreaAuditResult
} from '../lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Compass,
  Target,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface ProjectAreaAuditViewProps {
  report: DocumentAuditReport;
  onApplyExtractedData: (data: any) => void;
  onNavigateTab?: (tab: 'dashboard' | 'mision' | 'vision' | 'dofa' | 'industry' | 'coherence') => void;
}

export default function ProjectAreaAuditView({
  report,
  onApplyExtractedData,
  onNavigateTab
}: ProjectAreaAuditViewProps) {
  const [expandedAreaId, setExpandedAreaId] = useState<string | null>(report.areas[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'documental' | 'presupuestal'>('all');
  const [copiedMission, setCopiedMission] = useState(false);
  const [copiedVision, setCopiedVision] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedAreaId((prev) => (prev === id ? null : id));
  };

  const filteredAreas = report.areas.filter((area) => {
    if (filterCategory === 'all') return true;
    return area.category === filterCategory;
  });

  const getStatusBadge = (status: AreaAuditResult['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conforme / Completo
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Avance Parcial / Mejorable
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Pendiente / Sin Formular
          </span>
        );
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const handleCopy = (text: string, type: 'mission' | 'vision') => {
    navigator.clipboard.writeText(text);
    if (type === 'mission') {
      setCopiedMission(true);
      setTimeout(() => setCopiedMission(false), 2000);
    } else {
      setCopiedVision(true);
      setTimeout(() => setCopiedVision(false), 2000);
    }
  };

  const strategic = report.strategicIdentityAudit;

  return (
    <div className="space-y-6">
      {/* Top Score & Progress Executive Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Auditoría Integral de Avance del Proyecto
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {report.timestamp}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {report.projectName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Evaluación inteligente de documentos diligenciados o en avance frente a los 9 capítulos de la guía institucional y la proyección financiera en Excel.
            </p>
          </div>

          {/* Quick Action to import into Mission / Vision editor */}
          {report.extractedCompanyData && (
            <button
              onClick={() => onApplyExtractedData(report.extractedCompanyData)}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Sincronizar Datos Extraídos con la App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Intelligent Market & Sector Detection Card */}
        {report.detectedMarket && (
          <div className="p-4 rounded-xl bg-indigo-950/50 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-md shadow-cyan-500/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                    Análisis Inteligente de Mercado & Sector Identificado:
                  </span>
                  <span className="text-xs font-black text-white px-2.5 py-0.5 rounded-lg bg-slate-900 border border-cyan-500/40 shadow-sm">
                    {report.detectedMarket.sectorName}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Confianza {report.detectedMarket.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.detectedMarket.reason}
                </p>
                <p className="text-[11px] text-cyan-300 font-medium">
                  ✦ Los criterios de Misión, Visión, la matriz DOFA y las verificaciones de los 9 capítulos se han calibrado automáticamente con los estándares de esta industria.
                </p>
              </div>
            </div>

            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('industry')}
                type="button"
                className="self-start md:self-center px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Ver Benchmarks del Sector</span>
              </button>
            )}
          </div>
        )}

        {/* Global Progress Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Progress */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Avance Global del Proyecto</p>
              <p className="text-2xl font-extrabold text-white mt-1">
                {report.overallProgress}%
              </p>
              <p className="text-[11px] text-indigo-400 font-semibold mt-0.5">
                {report.overallProgress >= 80 ? 'Nivel Sobresaliente' : report.overallProgress >= 50 ? 'En Buen Avance' : 'Fase Inicial'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Documental Progress */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Avance Documental (Word)</p>
              <p className="text-2xl font-extrabold text-white mt-1">
                {report.documentalProgress}%
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                8 Capítulos Narrativos
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Financial Progress */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Avance Financiero (Excel)</p>
              <p className="text-2xl font-extrabold text-white mt-1">
                {report.financialProgress}%
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                Proyección 12 Meses
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Module Counts */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-xs text-slate-400 font-medium mb-1.5">Estado de Módulos (9 Totales)</p>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-emerald-400">✓ {report.completedModulesCount} Conformes</span>
              <span className="text-amber-400">⚠ {report.partialModulesCount} Parciales</span>
              {report.missingModulesCount > 0 && (
                <span className="text-rose-400">✕ {report.missingModulesCount} Faltantes</span>
              )}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2.5 flex">
              <div
                style={{ width: `${(report.completedModulesCount / 9) * 100}%` }}
                className="bg-emerald-500 h-full"
              />
              <div
                style={{ width: `${(report.partialModulesCount / 9) * 100}%` }}
                className="bg-amber-500 h-full"
              />
              <div
                style={{ width: `${(report.missingModulesCount / 9) * 100}%` }}
                className="bg-rose-500 h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL STRATEGIC IDENTITY DIAGNOSIS CARD: MISIÓN & VISIÓN */}
      {strategic && (
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Diagnóstico Inteligente de la Misión y Visión Extraídas</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Fórmula Institucional
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auditoría automática de los 4 pilares obligatorios de la Misión (¿Quiénes?, ¿Qué?, ¿Para quién?, ¿Cómo?) y los 3 requisitos de la Visión.
                </p>
              </div>
            </div>

            {/* Quick Tab Switchers */}
            <div className="flex items-center gap-2">
              {onNavigateTab && (
                <>
                  <button
                    onClick={() => onNavigateTab('mision')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Pestaña Misión</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('vision')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Pestaña Visión</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('dofa')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Matriz DOFA</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: MISIÓN AUDIT */}
            <div className="rounded-xl border border-indigo-500/30 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Auditoría de la Misión</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    strategic.misionScore >= 85
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : strategic.misionScore >= 70
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {strategic.misionScore}/100 • {strategic.misionCategory.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Extracted Text */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Texto Extraído del Documento:
                </p>
                <blockquote className="p-3 rounded-lg bg-slate-900 border-l-2 border-indigo-500 text-xs text-slate-200 italic leading-relaxed">
                  {strategic.misionText ? `“${strategic.misionText}”` : 'No se detectó el texto de la Misión en el documento cargado.'}
                </blockquote>
              </div>

              {/* 4 Pillars Checklist */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Verificación de los 4 Pilares Institucionales:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Pillar 1 */}
                  <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                    strategic.misionQuestions.quienesSomos.found
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    {strategic.misionQuestions.quienesSomos.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">{strategic.misionQuestions.quienesSomos.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{strategic.misionQuestions.quienesSomos.detail}</p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                    strategic.misionQuestions.queHacemos.found
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    {strategic.misionQuestions.queHacemos.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">{strategic.misionQuestions.queHacemos.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{strategic.misionQuestions.queHacemos.detail}</p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                    strategic.misionQuestions.paraQuien.found
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    {strategic.misionQuestions.paraQuien.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">{strategic.misionQuestions.paraQuien.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{strategic.misionQuestions.paraQuien.detail}</p>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                    strategic.misionQuestions.comoDiferenciador.found
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    {strategic.misionQuestions.comoDiferenciador.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-[11px]">{strategic.misionQuestions.comoDiferenciador.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{strategic.misionQuestions.comoDiferenciador.detail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Optimized Mission Recommendation */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Redacción Optimizada Institucional (100% Conforme):
                  </span>
                  <button
                    onClick={() => handleCopy(strategic.aiOptimizedMission, 'mission')}
                    type="button"
                    className="text-[11px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedMission ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMission ? 'Copiada' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {strategic.aiOptimizedMission}
                </p>
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => onApplyExtractedData({ mision: strategic.aiOptimizedMission })}
                    type="button"
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    Usar esta Misión en el Proyecto Activo →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: VISIÓN AUDIT */}
            <div className="rounded-xl border border-purple-500/30 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Auditoría de la Visión</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    strategic.visionScore >= 85
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : strategic.visionScore >= 70
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {strategic.visionScore}/100 • {strategic.visionCategory.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Extracted Text */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Texto Extraído del Documento:
                </p>
                <blockquote className="p-3 rounded-lg bg-slate-900 border-l-2 border-purple-500 text-xs text-slate-200 italic leading-relaxed">
                  {strategic.visionText ? `“${strategic.visionText}”` : 'No se detectó el texto de la Visión en el documento cargado.'}
                </blockquote>
              </div>

              {/* Vision Checklist Badges */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                  Verificación de Criterios Exigidos por la Guía:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Criterion 1: Year */}
                  <div className={`p-2.5 rounded-lg border text-center ${
                    strategic.visionChecklist.hasTargetYear
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Horizonte Temporal</p>
                    <p className="font-extrabold text-xs mt-0.5">
                      {strategic.visionChecklist.hasTargetYear ? `✓ Año ${strategic.visionChecklist.targetYear}` : '✕ Falta Año'}
                    </p>
                  </div>

                  {/* Criterion 2: Leadership */}
                  <div className={`p-2.5 rounded-lg border text-center ${
                    strategic.visionChecklist.hasLeadership
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Posición Líder</p>
                    <p className="font-extrabold text-xs mt-0.5">
                      {strategic.visionChecklist.hasLeadership ? '✓ Liderazgo Declarado' : '✕ Sin Posicionamiento'}
                    </p>
                  </div>

                  {/* Criterion 3: Territory */}
                  <div className={`p-2.5 rounded-lg border text-center ${
                    strategic.visionChecklist.hasTerritorialScope
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Alcance Territorial</p>
                    <p className="font-extrabold text-xs mt-0.5">
                      {strategic.visionChecklist.hasTerritorialScope ? '✓ Delimitado' : '✕ No Delimitado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI-Optimized Vision Recommendation */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Redacción Optimizada Institucional (100% Conforme):
                  </span>
                  <button
                    onClick={() => handleCopy(strategic.aiOptimizedVision, 'vision')}
                    type="button"
                    className="text-[11px] px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedVision ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVision ? 'Copiada' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {strategic.aiOptimizedVision}
                </p>
                <div className="pt-1 flex items-center justify-end">
                  <button
                    onClick={() => onApplyExtractedData({ vision: strategic.aiOptimizedVision })}
                    type="button"
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Usar esta Visión en el Proyecto Activo →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Spreadsheet Highlights Card (if present) */}
      {report.financialHighlights && (
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Análisis de la Estructura Presupuestal en Excel</span>
            </div>
            <span className="text-xs text-emerald-300 font-medium bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {report.financialHighlights.sheetsDetected.length} Hojas Verificadas
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Hojas clave detectadas en la proyección financiera:
          </p>

          <div className="flex flex-wrap gap-2">
            {report.financialHighlights.sheetsDetected.map((sheet, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300"
              >
                📄 {sheet}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <p className="text-slate-400">Flujo de Caja Mensual</p>
              <p className="text-emerald-400 font-bold mt-0.5">
                {report.financialHighlights.hasCashFlowSheet ? '✓ Presente (12 Meses)' : '✕ No detectado'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <p className="text-slate-400">Punto de Equilibrio</p>
              <p className="text-emerald-400 font-bold mt-0.5">
                {report.financialHighlights.hasBreakEvenSheet ? '✓ Calculado' : '✕ No detectado'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <p className="text-slate-400">Presupuesto de Nómina</p>
              <p className="text-emerald-400 font-bold mt-0.5">
                {report.financialHighlights.hasPayrollSheet ? '✓ Detallado con prestaciones' : '✕ No detectado'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <p className="text-slate-400">Inversión y Capital</p>
              <p className="text-emerald-400 font-bold mt-0.5">
                {report.financialHighlights.hasInvestmentSheet ? '✓ Parametrizado' : '✕ No detectado'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Area List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Diagnóstico y Recomendaciones de Mejora por Capítulo (9 Módulos)
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              type="button"
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos (9)
            </button>
            <button
              onClick={() => setFilterCategory('documental')}
              type="button"
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'documental'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Documental (8)
            </button>
            <button
              onClick={() => setFilterCategory('presupuestal')}
              type="button"
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                filterCategory === 'presupuestal'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Presupuestal (1)
            </button>
          </div>
        </div>

        {/* Areas Accordion Cards */}
        <div className="space-y-3">
          {filteredAreas.map((area) => {
            const isExpanded = expandedAreaId === area.id;

            return (
              <div
                key={area.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleExpand(area.id)}
                  type="button"
                  className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 shrink-0">
                      {area.moduleCode}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{area.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {area.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          style={{ width: `${area.progress}%` }}
                          className={`h-full ${getProgressBarColor(area.progress)}`}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300 min-w-8 text-right">
                        {area.progress}%
                      </span>
                    </div>

                    {getStatusBadge(area.status)}

                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4">
                    {/* Strengths: "Esta parte está bien" */}
                    {area.strengths.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Puntos Fuertes Detectados (Esta parte está bien):</span>
                        </div>
                        <ul className="space-y-1 pl-6 list-disc text-xs text-slate-300">
                          {area.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements: "Qué podemos mejorar" */}
                    {area.improvements.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Qué Podemos Mejorar / Recomendaciones para Completar el Avance:</span>
                        </div>
                        <ul className="space-y-1 pl-6 list-disc text-xs text-slate-300">
                          {area.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Guide Requirements */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Requisitos Exigidos por la Guía Oficial Institucional:</span>
                      </div>
                      <ul className="space-y-1 pl-6 list-disc text-xs text-slate-400">
                        {area.guideRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Extracted Snippet from the User's document */}
                    {area.extractedSnippet && (
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                          Fragmento Identificado en tus Documentos:
                        </p>
                        <blockquote className="p-3 rounded-lg bg-slate-900/90 border-l-2 border-indigo-500 text-slate-300 italic text-[11px] font-sans">
                          “{area.extractedSnippet}...”
                        </blockquote>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
