'use client';

import React from 'react';
import {
  INDUSTRY_SECTORS,
  getIndustryConfig
} from '../lib/industryBenchmarks';
import { IndustrySector, CompanyInputData } from '../lib/types';
import {
  Cpu,
  ShoppingBag,
  Briefcase,
  Factory,
  Sprout,
  UtensilsCrossed,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';

interface IndustrySelectorProps {
  currentSector: IndustrySector;
  onSelectSector: (sector: IndustrySector) => void;
  onLoadSampleCompany: (company: CompanyInputData) => void;
}

export default function IndustrySelector({
  currentSector,
  onSelectSector,
  onLoadSampleCompany
}: IndustrySelectorProps) {
  const activeConfig = getIndustryConfig(currentSector);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Factory':
        return <Factory className="w-5 h-5" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Adaptabilidad Multi-Mercado & Enfoque por Industria</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">
          Configuración Sectorial para Cualquier Tipo de Empresa
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          Cada sector económico tiene exigencias técnicas distintas ante evaluadores, bancos y comités de inversión. Selecciona la industria de tu negocio para que el auditor aplique las rúbricas, fórmulas y verificaciones específicas de tu mercado.
        </p>
      </div>

      {/* Grid of 6 Industry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRY_SECTORS.map((sector) => {
          const isSelected = currentSector === sector.id;

          return (
            <div
              key={sector.id}
              onClick={() => onSelectSector(sector.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-xl shadow-indigo-950/50 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {getIcon(sector.iconName)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {sector.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{sector.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                {/* Sample business types tag list */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {sector.sampleBusinessTypes.slice(0, 2).map((sample, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 truncate max-w-full"
                    >
                      • {sample}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons inside card */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSector(sector.id);
                    onLoadSampleCompany(sector.sampleCompany);
                  }}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Cargar Ejemplo Real</span>
                </button>

                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    isSelected ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Activo</span>
                    </>
                  ) : (
                    <span>Seleccionar</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive on Selected Industry: What evaluators look for */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              {getIcon(activeConfig.iconName)}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Rúbrica Específica para: {activeConfig.name}
              </h3>
              <p className="text-xs text-slate-400">
                Puntos críticos que auditan los comités e inversionistas en esta industria
              </p>
            </div>
          </div>

          <button
            onClick={() => onLoadSampleCompany(activeConfig.sampleCompany)}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Usar Caso Modelo de {activeConfig.sampleCompany.companyName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Critical Evaluation Checkpoints for this sector */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Puntos Clave Exigidos para la Aprobación Institucional en este Sector:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeConfig.keyEvaluationPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Formulation Formulas for this sector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Misión Formula */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Fórmula Oficial de Misión para {activeConfig.badge}
            </span>
            <blockquote className="text-xs text-slate-200 italic leading-relaxed bg-slate-950/60 p-3 rounded-lg border-l-2 border-cyan-400">
              &ldquo;{activeConfig.misionFormula}&rdquo;
            </blockquote>
            <p className="text-[10px] text-slate-400">
              Garantiza responder simultáneamente: ¿Qué?, ¿Quién? y ¿Cómo?.
            </p>
          </div>

          {/* Visión Formula */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Fórmula Oficial de Visión para {activeConfig.badge}
            </span>
            <blockquote className="text-xs text-slate-200 italic leading-relaxed bg-slate-950/60 p-3 rounded-lg border-l-2 border-indigo-400">
              &ldquo;{activeConfig.visionFormula}&rdquo;
            </blockquote>
            <p className="text-[10px] text-slate-400">
              Garantiza: Año meta explícito, posicionamiento líder y delimitación territorial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
