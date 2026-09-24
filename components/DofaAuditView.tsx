'use client';

import React, { useState } from 'react';
import { CompanyInputData } from '../lib/types';
import { generateStrategicDofa } from '../lib/dofaEngine';
import {
  ShieldCheck,
  AlertTriangle,
  Compass,
  Zap,
  Target,
  Copy,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface DofaAuditViewProps {
  companyData: CompanyInputData;
}

export default function DofaAuditView({ companyData }: DofaAuditViewProps) {
  const dofa = generateStrategicDofa(companyData);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getImpactBadge = (impact: 'Alta' | 'Media' | 'Baja') => {
    switch (impact) {
      case 'Alta':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
            Impacto Alto
          </span>
        );
      case 'Media':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Impacto Medio
          </span>
        );
      case 'Baja':
        return (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-300 border border-slate-500/20">
            Impacto Bajo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Capítulo 5.6 de la Metodología Oficial de Plan de Negocio</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">
          Matriz DOFA / FODA Estratégica & Cruce de Acciones
        </h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          &ldquo;Se realizará una matriz DOFA en la cual se mostrarán las diferentes estrategias a seguir logrando de esta manera un fortalecimiento.&rdquo; Evaluamos las variables internas (Fortalezas y Debilidades) y externas del entorno (Oportunidades y Amenazas) para generar la hoja de ruta estratégica aprobatoria.
        </p>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: FORTALEZAS (F) */}
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                F
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-400">Fortalezas Internas</h3>
                <p className="text-[11px] text-slate-400">Ventajas y capacidades distintivas</p>
              </div>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  dofa.strengths.map((s) => `• ${s.text}`).join('\n'),
                  'strengths'
                )
              }
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Copiar Fortalezas"
            >
              {copiedSection === 'strengths' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-2">
            {dofa.strengths.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-slate-200 leading-relaxed">{item.text}</span>
                </div>
                <div className="shrink-0">{getImpactBadge(item.impact)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 2: DEBILIDADES (D) */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
                D
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-400">Debilidades Internas</h3>
                <p className="text-[11px] text-slate-400">Aspectos a robustecer internamente</p>
              </div>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  dofa.weaknesses.map((w) => `• ${w.text}`).join('\n'),
                  'weaknesses'
                )
              }
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Copiar Debilidades"
            >
              {copiedSection === 'weaknesses' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-2">
            {dofa.weaknesses.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠</span>
                  <span className="text-slate-200 leading-relaxed">{item.text}</span>
                </div>
                <div className="shrink-0">{getImpactBadge(item.impact)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 3: OPORTUNIDADES (O) */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
                O
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-400">Oportunidades del Entorno</h3>
                <p className="text-[11px] text-slate-400">Tendencias y mercado favorable</p>
              </div>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  dofa.opportunities.map((o) => `• ${o.text}`).join('\n'),
                  'opportunities'
                )
              }
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Copiar Oportunidades"
            >
              {copiedSection === 'opportunities' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-2">
            {dofa.opportunities.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0 mt-0.5">✦</span>
                  <span className="text-slate-200 leading-relaxed">{item.text}</span>
                </div>
                <div className="shrink-0">{getImpactBadge(item.impact)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quadrant 4: AMENAZAS (A) */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold font-mono">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-400">Amenazas del Entorno</h3>
                <p className="text-[11px] text-slate-400">Riesgos regulatorios y competitivos</p>
              </div>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  dofa.threats.map((a) => `• ${a.text}`).join('\n'),
                  'threats'
                )
              }
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              title="Copiar Amenazas"
            >
              {copiedSection === 'threats' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="space-y-2">
            {dofa.threats.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span className="text-slate-200 leading-relaxed">{item.text}</span>
                </div>
                <div className="shrink-0">{getImpactBadge(item.impact)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matriz de Cruce Estratégico (FO, DO, FA, DA) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-base font-bold text-white">
              Matriz de Estrategias Cruzadas (FO, DO, FA, DA)
            </h3>
            <p className="text-xs text-slate-400">
              Directrices tácticas derivadas del cruce entre variables internas y externas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dofa.crossStrategies.map((cross) => (
            <div
              key={cross.type}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      cross.type === 'FO'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : cross.type === 'DO'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : cross.type === 'FA'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {cross.type}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200">{cross.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 italic">{cross.subtitle}</p>

                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {cross.strategies.map((strat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0 mt-0.5">✦</span>
                      <span className="leading-relaxed">{strat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
