'use client';

import React from 'react';
import { BusinessAuditReport } from '../lib/types';
import { ListChecks, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ActionPlanTableProps {
  actionPlan: BusinessAuditReport['actionPlan'];
}

export default function ActionPlanTable({ actionPlan }: ActionPlanTableProps) {
  const getPriorityStyle = (priority: 'Alta' | 'Media' | 'Baja') => {
    switch (priority) {
      case 'Alta':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Media':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Baja':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <ListChecks className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Plan de Acción Priorizado & Matriz de Ajustes
          </h3>
          <p className="text-xs text-slate-400">
            Hoja de ruta sugerida para elevar la solidez del documento ante comités evaluadores
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3 pl-2">Prioridad</th>
              <th className="pb-3">Sección</th>
              <th className="pb-3">Acción Concreta Sugerida</th>
              <th className="pb-3 pr-2">Impacto en el Plan de Negocio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {actionPlan.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 pl-2 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="py-3 whitespace-nowrap font-medium text-slate-200">
                  {item.section}
                </td>
                <td className="py-3 pr-4 leading-relaxed font-normal text-slate-200">
                  {item.item}
                </td>
                <td className="py-3 pr-2 text-slate-400 leading-relaxed">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {item.impact}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
