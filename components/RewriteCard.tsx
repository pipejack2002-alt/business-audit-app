'use client';

import React, { useState } from 'react';
import { Copy, Check, Wand2, ArrowRight } from 'lucide-react';

interface RewriteCardProps {
  title?: string;
  type?: 'mision' | 'vision' | string;
  originalText: string;
  optimizedText: string;
  score?: number;
  currentScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  onApply?: (text: string) => void;
  onApplyRewrite?: (text: string) => void;
}

export default function RewriteCard({
  title,
  type,
  originalText,
  optimizedText,
  score,
  currentScore,
  onApply,
  onApplyRewrite
}: RewriteCardProps) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const displayTitle =
    title || (type === 'mision' ? 'Misión' : type === 'vision' ? 'Visión' : 'Declaración Estratégica');
  const effectiveScore = score ?? currentScore ?? 95;
  const effectiveApply = onApply || onApplyRewrite || (() => {});

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleApply = () => {
    effectiveApply(optimizedText);
    setApplied(true);
    setTimeout(() => setApplied(false), 2200);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-slate-900/60 to-slate-900/80 p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Propuesta de Mejora Redaccional • {displayTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Generada aplicando la metodología oficial de formulación estratégica
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={handleApply}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Aplicado al Editor!</span>
              </>
            ) : (
              <>
                <span>Aplicar al Formulario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Original Draft text */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Redacción Actual en el Avance:</span>
            <span className="font-mono text-slate-500">
              {originalText ? originalText.split(/\s+/).filter(Boolean).length : 0} palabras
            </span>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            &ldquo;{originalText || '(Sin texto ingresado)'}&rdquo;
          </p>
        </div>

        {/* Optimized Rewrite */}
        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 relative">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 mb-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Versión Optimizada para Aprobación Institucional:
            </span>
            <span className="text-emerald-400 font-bold font-mono">
              Calificación estimada: 95-98/100
            </span>
          </div>
          <p className="text-xs text-slate-100 font-medium leading-relaxed">
            &ldquo;{optimizedText}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
