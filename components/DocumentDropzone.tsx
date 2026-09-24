'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderOpen,
  Sparkles,
  X,
  FileCheck,
  Download
} from 'lucide-react';
import { DocumentAuditReport } from '../lib/types';

interface DocumentDropzoneProps {
  onAuditComplete: (report: DocumentAuditReport) => void;
  onApplyExtractedData: (data: any) => void;
}

export default function DocumentDropzone({
  onAuditComplete,
  onApplyExtractedData
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
      setErrorMsg(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      setErrorMsg(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzeSelectedFiles = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg('Por favor selecciona o arrastra al menos un archivo (.docx, .xlsx o .txt).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/analyze-documents', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar los documentos');
      }

      const sectorLabel = data.report.detectedMarket?.sectorName || 'Sector Identificado';
      const misionScore = data.report.strategicIdentityAudit?.misionScore;
      const misionScoreMsg = misionScore !== undefined ? ` • Calificación Misión: ${misionScore}/100` : '';
      setSuccessMsg(`¡Auditoría inteligente completada! Mercado detectado: ${sectorLabel}${misionScoreMsg}. Se calibraron los 9 capítulos y la matriz DOFA.`);
      onAuditComplete(data.report);
      if (data.report.extractedCompanyData) {
        onApplyExtractedData({
          ...data.report.extractedCompanyData,
          sector: data.report.detectedMarket?.sector
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error al analizar los documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadLocalTributo = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/analyze-documents?loadLocalTributo=true');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al cargar los documentos de TributoApp');
      }

      const sectorLabel = data.report.detectedMarket?.sectorName || 'Tecnología, SaaS & Software';
      const misionScore = data.report.strategicIdentityAudit?.misionScore;
      const misionScoreMsg = misionScore !== undefined ? ` • Misión: ${misionScore}/100` : '';
      setSuccessMsg(`¡Documentos de TributoApp auditados con éxito! Mercado: ${sectorLabel}${misionScoreMsg}.`);
      onAuditComplete(data.report);
      if (data.report.extractedCompanyData) {
        onApplyExtractedData({
          ...data.report.extractedCompanyData,
          sector: data.report.detectedMarket?.sector || 'tech'
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al cargar los archivos locales de TributoApp.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
      {/* Illustrative Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl h-44 sm:h-56 group">
        <img
          src="/images/audit-hero-analytics.jpg"
          alt="Auditoría Integral de Planes de Negocio"
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20 flex flex-col justify-end p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/90 border border-cyan-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              Auditoría Inteligente Conforme a la Guía Oficial 2025
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white mt-1.5">
            Ingesta y Diagnóstico Automatizado de Documentos
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed hidden sm:block">
            Sube tu plan de negocios en Word (.docx) y tu proyección financiera en Excel (.xlsx). El motor identificará tu sector económico, auditará la Misión y Visión con los 4 pilares obligatorios y calibrará los 9 capítulos.
          </p>

          {/* Download sample files chips */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Download className="w-3 h-3 text-indigo-400" /> Plantillas de muestra:
            </span>
            <a
              href="/samples/Plan_modelo_negocio_2025_DILIGENCIADO.docx"
              download
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-[11px] font-medium text-indigo-200 hover:text-white transition-all shadow-sm"
              title="Descargar Plan de Negocio en Word (.docx)"
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>Plan de Negocio (.docx)</span>
            </a>
            <a
              href="/samples/Modelo_Financiero_12M_TributoApp.xlsx"
              download
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-[11px] font-medium text-emerald-200 hover:text-white transition-all shadow-sm"
              title="Descargar Modelo Financiero 12 Meses en Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              <span>Modelo Financiero 12M (.xlsx)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">
              Carga y Auditoría Automática de Documentos
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              Word (.docx) + Excel (.xlsx)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Arrastra tu Plan de Negocio (terminado o en avance parcial) y tu modelo presupuestal en Excel. El sistema identificará inteligentemente el sector de mercado, evaluará la Misión y Visión con los 4 pilares obligatorios y calibrará los 9 capítulos con recomendaciones a la medida.
          </p>
        </div>

        {/* Quick button to load TributoApp documents */}
        <button
          onClick={handleLoadLocalTributo}
          disabled={isLoading}
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-700/50 hover:border-cyan-500 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Auditar Archivos de TributoApp (Word + Excel)</span>
        </button>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-700 hover:border-indigo-500/60 bg-slate-950/60 hover:bg-slate-950/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".docx,.doc,.xlsx,.xls,.txt,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
          <FolderOpen className="w-7 h-7" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-200">
            Haz clic para seleccionar o arrastra tus archivos aquí
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Formatos soportados: <span className="text-indigo-300 font-mono">.docx</span> (Plan de Negocio, Matriz de Ideas), <span className="text-emerald-300 font-mono">.xlsx</span> (Proyecciones financieras 12M, Nómina, Flujo), <span className="text-slate-300 font-mono">.txt</span>
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Archivos preparados para auditar ({selectedFiles.length})
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              type="button"
              className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Quitar todos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {selectedFiles.map((file, idx) => {
              const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
              const isWord = file.name.endsWith('.docx') || file.name.endsWith('.doc');

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    {isExcel ? (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isWord ? (
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    type="button"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleAnalyzeSelectedFiles}
              disabled={isLoading}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando documentos y finanzas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Auditar Documentos Seleccionados</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
