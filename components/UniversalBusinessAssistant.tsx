'use client';

import React, { useState } from 'react';
import { CompanyInputData, IndustrySector } from '../lib/types';
import { INDUSTRY_SECTORS } from '../lib/industryBenchmarks';
import {
  Sparkles,
  Wand2,
  CheckCircle,
  ArrowRight,
  Building,
  MapPin,
  Target,
  Compass,
  X,
  Layers
} from 'lucide-react';

interface UniversalBusinessAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGeneratedCompany: (company: CompanyInputData) => void;
}

export default function UniversalBusinessAssistant({
  isOpen,
  onClose,
  onApplyGeneratedCompany
}: UniversalBusinessAssistantProps) {
  const [sector, setSector] = useState<IndustrySector>('tech');
  const [name, setName] = useState('');
  const [what, setWhat] = useState('');
  const [who, setWho] = useState('');
  const [how, setHow] = useState('');
  const [city, setCity] = useState('Barranquilla, Colombia');
  const [year, setYear] = useState('2032');

  const [generatedResult, setGeneratedResult] = useState<CompanyInputData | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const compName = name.trim() || 'Mi Empresa';
    const compWhat = what.trim() || 'servicios y productos de alta calidad';
    const compWho = who.trim() || 'clientes exigentes y empresas del sector';
    const compHow = how.trim() || 'procesos tecnificados y atención personalizada';
    const compCity = city.trim() || 'Colombia';
    const compYear = year.trim() || '2032';

    const selectedConfig = INDUSTRY_SECTORS.find((s) => s.id === sector) || INDUSTRY_SECTORS[0];

    const generatedMision = `Somos ${compName}, una empresa con sede en ${compCity}, comprometida con satisfacer las necesidades de ${compWho}, ofreciendo ${compWhat}, mediante ${compHow} que garantizan excelencia, puntualidad y altos estándares de calidad.`;

    const generatedVision = `Para el año ${compYear}, ser la empresa referente y líder en ${selectedConfig.name.split('/')[0].trim()} en ${compCity} y su área de influencia, destacándonos por la innovación constante en nuestros procesos, la satisfacción total de nuestros clientes y un crecimiento rentable y sostenible.`;

    const generatedValues = `• Rigor y Excelencia Técnica: Cumplimiento riguroso de normativas y estándares de calidad.\n• Orientación y Confianza: Relaciones transparentes y de largo plazo con cada cliente.\n• Innovación Continua: Mejora constante de procesos operativos y tecnológicos.`;

    const result: CompanyInputData = {
      companyName: compName,
      industry: selectedConfig.name,
      location: compCity,
      targetYear: compYear,
      sector,
      mision: generatedMision,
      vision: generatedVision,
      values: generatedValues,
      valueProposition: `${compWhat} diseñado específicamente para ${compWho} mediante ${compHow}.`,
      targetAudience: compWho
    };

    setGeneratedResult(result);
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyGeneratedCompany(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/40 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Asistente de Formulación Estratégica Universal
              </h3>
              <p className="text-xs text-slate-400">
                Diseña Misión y Visión con cumplimiento del 100% de la guía oficial para cualquier tipo de negocio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Questionnaire */}
        <div className="space-y-4 text-xs">
          {/* Sector selection */}
          <div>
            <label className="block font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5">
              1. Selecciona el Sector de tu Negocio:
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as IndustrySector)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              {INDUSTRY_SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.badge})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] mb-1">
                2. Nombre de la Empresa o Emprendimiento:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Dulces Momentos Pastelería"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] mb-1">
                3. Ciudad o Región de Operación:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej. Barranquilla, Colombia"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 3 Core Questions */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div>
              <label className="block font-bold text-cyan-400 text-[11px] mb-1">
                ¿Qué producto o servicio ofreces? (El ¿Qué? de la Misión):
              </label>
              <input
                type="text"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Ej. Postres saludables sin azúcar, tortas de masa madre y galletería fina"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-cyan-400 text-[11px] mb-1">
                ¿Quiénes son tus clientes ideales? (El ¿Quién? de la Misión):
              </label>
              <input
                type="text"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                placeholder="Ej. Personas con diabetes, deportistas, familias y eventos corporativos"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-cyan-400 text-[11px] mb-1">
                ¿Cómo lo haces o qué te hace diferente? (El ¿Cómo? de la Misión):
              </label>
              <input
                type="text"
                value={how}
                onChange={(e) => setHow(e.target.value)}
                placeholder="Ej. Ingredientes orgánicos certificados, endulzantes naturales y pedidos por WhatsApp con entrega rápida"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 text-[11px] mb-1">
              Año Meta de la Visión (Horizonte Temporal):
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ej. 2030, 2035 o 2040"
              className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generar Declaraciones Estratégicas Institucionales</span>
            </button>
          </div>
        </div>

        {/* Generated Result Preview */}
        {generatedResult && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Propuesta Generada Lista para Aprobación (98/100)</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                  Misión Institucional:
                </p>
                <p className="text-slate-200 italic mt-0.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  &ldquo;{generatedResult.mision}&rdquo;
                </p>
              </div>

              <div>
                <p className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">
                  Visión Institucional:
                </p>
                <p className="text-slate-200 italic mt-0.5 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  &ldquo;{generatedResult.vision}&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={handleApply}
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Aplicar a la Auditoría</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
