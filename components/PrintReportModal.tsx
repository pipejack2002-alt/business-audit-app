'use client';

import React, { useMemo } from 'react';
import { BusinessAuditReport, CompanyInputData } from '../lib/types';
import { generateStrategicDofa } from '../lib/dofaEngine';
import { getSectorCostingDefaults, calculateProductModel, calculateBreakEven } from '../lib/financialEngine';
import { Printer, X, ShieldCheck } from 'lucide-react';

interface PrintReportModalProps {
  report: BusinessAuditReport;
  companyData?: CompanyInputData;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintReportModal({
  report,
  companyData,
  isOpen,
  onClose
}: PrintReportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentCompany: CompanyInputData = companyData || {
    companyName: report.companyName,
    industry: report.industry,
    location: report.location,
    targetYear: report.targetYear,
    mision: report.misionAudit.originalText,
    vision: report.visionAudit.originalText,
    valueProposition: '',
    targetAudience: ''
  };

  const dofa = generateStrategicDofa(currentCompany);

  const sectorDefaults = useMemo(() => getSectorCostingDefaults(currentCompany.sector || 'tech'), [currentCompany.sector]);
  const productCostModel = useMemo(() => {
    const totalFixed = sectorDefaults.fixedCostsItems.reduce((acc, item) => acc + item.monthlyAmount, 0);
    return calculateProductModel({
      productName: sectorDefaults.productName,
      sector: currentCompany.sector || 'tech',
      expectedMonthlyVolume: sectorDefaults.expectedMonthlyVolume,
      variableItems: sectorDefaults.variableItems,
      laborConfig: sectorDefaults.laborConfig,
      totalMonthlyFixedCosts: totalFixed,
      pricingMethod: sectorDefaults.pricingMethod,
      desiredMarginPercent: sectorDefaults.desiredMarginPercent,
      desiredMarkupPercent: sectorDefaults.desiredMarkupPercent,
      taxType: sectorDefaults.taxType
    });
  }, [sectorDefaults, currentCompany.sector]);

  const breakEvenModel = useMemo(() => {
    return calculateBreakEven(productCostModel, sectorDefaults.fixedCostsItems);
  }, [productCostModel, sectorDefaults.fixedCostsItems]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Top bar (hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm tracking-wide">
              Vista Previa de Informe Ejecutivo de Auditoría y Matriz DOFA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 font-mono">
                  DICTAMEN DE AUDITORÍA ESTRATÉGICA • FORMATO OFICIAL DE PLAN DE NEGOCIOS
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {report.companyName}
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  {report.industry} • {report.location} • Año Meta: {report.targetYear}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="inline-block border-2 border-indigo-700 rounded-xl px-4 py-2 bg-indigo-50/50">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600 block">
                    Puntaje Global
                  </span>
                  <span className="text-3xl font-black text-indigo-700 font-mono">
                    {report.overallScore}
                  </span>
                  <span className="text-xs font-bold text-slate-500"> / 100</span>
                  <span className="block text-[11px] font-bold text-indigo-900 uppercase">
                    {report.overallCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-2 mb-2">
              1. Dictamen Ejecutivo del Evaluador
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {report.executiveSummary}
            </p>
          </div>

          {/* Section 2: Misión Audit */}
          <div className="mb-6">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Auditoría de la Misión (Sección 5.1 del Formato)
              </h3>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                Puntaje: {report.misionAudit.score}/100
              </span>
            </div>

            {/* Original statement */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Redacción Evaluada:
              </span>
              <p className="text-xs text-slate-800 italic">
                &ldquo;{report.misionAudit.originalText || '(Sin redacción ingresada)'}&rdquo;
              </p>
            </div>

            {/* Criteria breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {report.misionAudit.criteria.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded p-2.5 bg-white text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{c.name}</span>
                    <span className="font-mono text-indigo-700">{c.score}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{c.feedback}</p>
                </div>
              ))}
            </div>

            {/* Suggested rewrite */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">
                Propuesta de Mejora Sugerida (Estándar Plan de Negocios):
              </span>
              <p className="text-xs text-indigo-950 font-medium">
                &ldquo;{report.misionAudit.optimizedRewrite}&rdquo;
              </p>
            </div>
          </div>

          {/* Section 3: Visión Audit */}
          <div className="mb-6">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Auditoría de la Visión (Sección 5.2 del Formato)
              </h3>
              <span className="text-xs font-bold text-indigo-700 font-mono">
                Puntaje: {report.visionAudit.score}/100
              </span>
            </div>

            {/* Original statement */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Redacción Evaluada:
              </span>
              <p className="text-xs text-slate-800 italic">
                &ldquo;{report.visionAudit.originalText || '(Sin redacción ingresada)'}&rdquo;
              </p>
            </div>

            {/* Criteria breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {report.visionAudit.criteria.map((c) => (
                <div key={c.id} className="border border-slate-200 rounded p-2.5 bg-white text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{c.name}</span>
                    <span className="font-mono text-indigo-700">{c.score}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{c.feedback}</p>
                </div>
              ))}
            </div>

            {/* Suggested rewrite */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
              <span className="text-[10px] font-bold text-indigo-800 uppercase block mb-1">
                Propuesta de Mejora Sugerida (Estándar Plan de Negocios):
              </span>
              <p className="text-xs text-indigo-950 font-medium">
                &ldquo;{report.visionAudit.optimizedRewrite}&rdquo;
              </p>
            </div>
          </div>

          {/* Section 4: Matriz DOFA / FODA Estratégica (Capítulo 5.6) */}
          <div className="mb-6">
            <div className="border-b border-slate-300 pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Matriz DOFA Estratégica (Sección 5.6 del Formato)
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="border border-emerald-300 bg-emerald-50/50 rounded-lg p-3">
                <span className="font-bold text-emerald-800 block mb-1">Fortalezas (F)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                  {dofa.strengths.slice(0, 3).map((f) => (
                    <li key={f.id}>{f.text}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-amber-300 bg-amber-50/50 rounded-lg p-3">
                <span className="font-bold text-amber-800 block mb-1">Debilidades (D)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                  {dofa.weaknesses.slice(0, 3).map((d) => (
                    <li key={d.id}>{d.text}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-cyan-300 bg-cyan-50/50 rounded-lg p-3">
                <span className="font-bold text-cyan-800 block mb-1">Oportunidades (O)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                  {dofa.opportunities.slice(0, 3).map((o) => (
                    <li key={o.id}>{o.text}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-rose-300 bg-rose-50/50 rounded-lg p-3">
                <span className="font-bold text-rose-800 block mb-1">Amenazas (A)</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                  {dofa.threats.slice(0, 3).map((a) => (
                    <li key={a.id}>{a.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Cost of Sales, Pricing & Break-Even Engineering */}
          <div className="mb-6">
            <div className="border-b border-slate-300 pb-2 mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Ingeniería de Costo de Ventas, Precios & Punto de Equilibrio (Cap. 3, 4 y 9)
              </h3>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Sector: {(currentCompany.sector || 'tech').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
              <div className="border border-slate-200 rounded p-2 bg-slate-50">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Costo Variable (CVU)</span>
                <span className="font-mono font-bold text-slate-900">{formatCOP(productCostModel.totalVariableCostPerUnit)}</span>
                <span className="text-[10px] text-slate-600 block mt-0.5">Primo: {formatCOP(productCostModel.primeCost)}</span>
              </div>
              <div className="border border-indigo-200 rounded p-2 bg-indigo-50/50">
                <span className="text-[10px] text-indigo-700 uppercase font-bold block">Precio de Venta Neto</span>
                <span className="font-mono font-bold text-indigo-900">{formatCOP(productCostModel.calculatedNetSalePrice)}</span>
                <span className="text-[10px] text-indigo-700 block mt-0.5">Margen: {productCostModel.effectiveGrossMarginPercent}%</span>
              </div>
              <div className="border border-emerald-200 rounded p-2 bg-emerald-50/50">
                <span className="text-[10px] text-emerald-700 uppercase font-bold block">Margen Contrib. (MCU)</span>
                <span className="font-mono font-bold text-emerald-900">{formatCOP(productCostModel.contributionMarginUnit)}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Razón: {productCostModel.contributionMarginRatio}%</span>
              </div>
              <div className="border border-cyan-200 rounded p-2 bg-cyan-50/50">
                <span className="text-[10px] text-cyan-700 uppercase font-bold block">Punto de Equilibrio</span>
                <span className="font-mono font-bold text-cyan-900">{breakEvenModel.breakEvenUnits.toLocaleString()} und/mes</span>
                <span className="text-[10px] text-cyan-700 block mt-0.5">{formatCOP(breakEvenModel.breakEvenRevenue)}/mes</span>
              </div>
            </div>

            <table className="w-full text-left text-[11px] border border-slate-200">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[9px]">
                <tr>
                  <th className="p-1.5">Concepto Técnico</th>
                  <th className="p-1.5">Fórmula Institucional</th>
                  <th className="p-1.5 text-right">Valor Parametrizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="p-1.5 font-semibold">Costo Primo Directo</td>
                  <td className="p-1.5 font-mono text-slate-500 text-[10px]">Materia Prima Directa (MPD) + Mano de Obra Directa (MOD)</td>
                  <td className="p-1.5 text-right font-mono font-bold">{formatCOP(productCostModel.primeCost)}</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold">Costo Total Unitario Absorbente (CTU)</td>
                  <td className="p-1.5 font-mono text-slate-500 text-[10px]">CVU + (Costos Fijos Mensuales / Volumen Planeado)</td>
                  <td className="p-1.5 text-right font-mono font-bold">{formatCOP(productCostModel.totalCostPerUnit)}</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold">Precio Final al Consumidor</td>
                  <td className="p-1.5 font-mono text-slate-500 text-[10px]">Precio Neto * (1 + {productCostModel.taxType.toUpperCase()} {productCostModel.taxPercent}%)</td>
                  <td className="p-1.5 text-right font-mono font-bold text-indigo-900">{formatCOP(productCostModel.calculatedFinalSalePrice)}</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-semibold">EBITDA Mensual al Volumen Meta</td>
                  <td className="p-1.5 font-mono text-slate-500 text-[10px]">Ventas Proyectadas - Costo de Ventas - Gastos Fijos</td>
                  <td className="p-1.5 text-right font-mono font-bold text-emerald-800">{formatCOP(breakEvenModel.plannedMonthlyEbitda)}/mes</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 6: Action Plan Table */}
          <div className="mb-6">
            <div className="border-b border-slate-300 pb-2 mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                6. Plan de Ajustes Priorizado
              </h3>
            </div>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2">Prioridad</th>
                  <th className="p-2">Sección</th>
                  <th className="p-2">Acción Requerida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {report.actionPlan.map((act, i) => (
                  <tr key={i}>
                    <td className="p-2 font-bold">{act.priority}</td>
                    <td className="p-2">{act.section}</td>
                    <td className="p-2">{act.item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="border-t border-slate-300 pt-4 text-center text-[10px] text-slate-500">
            AuditPlan Pro • Sistema de Auditoría y Verificación de Modelos de Negocio • Generado conforme al formato institucional de Planeación Estratégica.
          </div>
        </div>
      </div>
    </div>
  );
}
