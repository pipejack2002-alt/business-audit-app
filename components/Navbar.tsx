'use client';

import React from 'react';
import { PRESET_CASES } from '../lib/presetCases';
import { Printer, PlusCircle, Sparkles, Wand2, ChevronDown, FolderOpen } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-3 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-cyan-500/40 overflow-hidden flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0 p-1">
              <img src="/favicon.svg" alt="AuditPlan Pro" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  AuditPlan <span className="text-indigo-400">Pro</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block max-w-[200px] md:max-w-xs lg:max-w-md">
                Auditoría Estratégica Integral y Diagnóstico de Avance
              </p>
            </div>
          </div>

          {/* Preset Selector & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Presets dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <label htmlFor="preset-select" className="text-xs text-slate-400 hidden xl:flex items-center gap-1 font-medium">
                <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Caso:</span>
              </label>
              <div className="relative">
                <select
                  id="preset-select"
                  value={activePresetId}
                  onChange={(e) => onSelectPreset(e.target.value)}
                  className="bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-medium rounded-xl pl-3 pr-8 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer w-48 sm:w-60 md:w-64 appearance-none shadow-inner"
                >
                  {PRESET_CASES.map((preset) => (
                    <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-200 py-1">
                      {preset.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Asistente Universal Button */}
            <button
              onClick={onOpenAssistant}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:text-white bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-700/60 shadow-sm transition-all cursor-pointer shrink-0"
              title="Asistente para formular cualquier empresa en 3 pasos"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden md:inline">Asistente</span>
            </button>

            {/* Limpiar Formulario Button */}
            <button
              onClick={onResetNew}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer shrink-0"
              title="Iniciar auditoría en blanco para cualquier empresa"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Limpiar</span>
            </button>

            {/* Print / PDF Report Button */}
            <button
              onClick={onOpenPrintModal}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Exportar / Imprimir</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
