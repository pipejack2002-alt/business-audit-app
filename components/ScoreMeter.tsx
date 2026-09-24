'use client';

import React from 'react';
import { AuditScoreCategory } from '../lib/types';

interface ScoreMeterProps {
  score: number;
  category: AuditScoreCategory;
  size?: number;
  label?: string;
  sublabel?: string;
  showLabel?: boolean;
}

export default function ScoreMeter({
  score,
  category,
  size = 130,
  label = 'Puntuación',
  sublabel,
  showLabel = true
}: ScoreMeterProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const colorConfig = {
    excelente: {
      stroke: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.25)',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'Excelente',
      sub: 'Alineado y Aprobado'
    },
    bueno: {
      stroke: '#3b82f6', // blue-500
      glow: 'rgba(59, 130, 246, 0.25)',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      text: 'Bueno',
      sub: 'Ajustes Menores'
    },
    regular: {
      stroke: '#f59e0b', // amber-500
      glow: 'rgba(245, 158, 11, 0.25)',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'Regular',
      sub: 'Requiere Ajustes'
    },
    critico: {
      stroke: '#f43f5e', // rose-500
      glow: 'rgba(244, 63, 94, 0.25)',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      text: 'Crítico',
      sub: 'Faltantes Graves'
    }
  }[category];

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${colorConfig.glow})`,
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {safeScore}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300">{label}</span>
          <span
            className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colorConfig.badgeBg}`}
          >
            {colorConfig.text}
          </span>
          {sublabel && (
            <span className="text-[11px] text-slate-400 mt-0.5">{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
