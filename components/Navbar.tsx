'use client';

import React from 'react';
import { PRESET_CASES } from '../lib/presetCases';
import { ShieldCheck, Printer, PlusCircle, Sparkles, Wand2 } from 'lucide-react';

interface NavbarProps {
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenPrintModal: () => void;
  onResetNew: () => void;
  onOpenAssistant: () => void;
}

export default function Navbar({
  activePresetId,
  onSelectPreset,
  onOpenPrintModal,
  onResetNew,
  onOpenAssistant
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 p-1">
              <img src="/favicon.svg" alt="AuditPlan Pro" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  AuditPlan <span className="text-indigo-400">Pro</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Multi-Sector Enterprise
                </span>
                <a
                  href="https://businessaudit.tributoapp.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full hover:bg-emerald-900/60 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  businessaudit.tributoapp.me
                </a>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                Auditoría Estratégica Integral y Diagnóstico de Avance
              </p>
            </div>
          </div>

          {/* Preset Selector & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Presets dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="preset-select" className="text-xs text-slate-400 hidden xl:block">
                Cargar caso:
              </label>
              <select
                id="preset-select"
                value={activePresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer max-w-[130px] sm:max-w-[170px]"
              >
                {PRESET_CASES.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Asistente Universal Button */}
            <button
              onClick={onOpenAssistant}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/60 shadow-sm transition-all cursor-pointer"
              title="Asistente para formular cualquier empresa en 3 pasos"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Asistente de Formulación</span>
              <span className="md:hidden">Asistente</span>
            </button>

            {/* Limpiar Formulario Button */}
            <button
              onClick={onResetNew}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
              title="Iniciar auditoría en blanco para cualquier empresa"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Limpiar</span>
            </button>

            {/* Print / PDF Report Button */}
            <button
              onClick={onOpenPrintModal}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar / Imprimir</span>
              <span className="sm:hidden">Reporte</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
