'use client';

import React from 'react';
import { RubricCriterion } from '../lib/types';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface CriterionCardProps {
  criterion: RubricCriterion;
}

export default function CriterionCard({ criterion }: CriterionCardProps) {
  const isPassed = criterion.status === 'passed';
  const isWarning = criterion.status === 'warning';

  const badgeConfig = isPassed
    ? {
        border: 'border-emerald-500/30 bg-emerald-950/20',
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        text: 'Cumple Criterio'
      }
    : isWarning
    ? {
        border: 'border-amber-500/30 bg-amber-950/20',
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
        text: 'Ajuste Recomendado'
      }
    : {
        border: 'border-rose-500/30 bg-rose-950/20',
        badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        icon: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
        text: 'Faltante / Crítico'
      };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 hover:shadow-lg ${badgeConfig.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {badgeConfig.icon}
          <h4 className="text-sm font-semibold text-white tracking-wide">
            {criterion.name}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            {criterion.score} / 100
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeConfig.badge}`}
          >
            {badgeConfig.text}
          </span>
        </div>
      </div>

      {/* Detected text tags */}
      {criterion.detectedText && (
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400">Términos detectados:</span>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
            {criterion.detectedText}
          </span>
        </div>
      )}

      {/* Diagnostic feedback */}
      <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
        {criterion.feedback}
      </p>

      {/* Actionable recommendation */}
      {criterion.suggestion && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-start gap-2 text-[12px] text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
          <span>
            <strong className="text-indigo-200">Recomendación técnica:</strong>{' '}
            {criterion.suggestion}
          </span>
        </div>
      )}
    </div>
  );
}
