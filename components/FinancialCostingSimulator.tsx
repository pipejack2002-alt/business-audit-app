'use client';

import React, { useState, useMemo } from 'react';
import { IndustrySector } from '../lib/types';
import {
  ProductCostModel,
  PricingMethod,
  TaxType,
  CostItem,
  FixedCostItem,
  calculateProductModel,
  calculateBreakEven,
  generateSensitivityScenarios,
  calculateMultiProductBreakEven,
  getSectorCostingDefaults,
  ExcelFinancialAuditResult
} from '../lib/financialEngine';
import { INDUSTRY_SECTORS } from '../lib/industryBenchmarks';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Layers,
  Scale,
  Percent,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  currentSector: IndustrySector;
  excelAudit?: ExcelFinancialAuditResult;
  onApplyModelToReport?: (model: ProductCostModel) => void;
}

export default function FinancialCostingSimulator({
  currentSector,
  excelAudit
}: Props) {
  // Estado del sector seleccionado en el simulador
  const [sector, setSector] = useState<IndustrySector>(currentSector || 'tech');
  
  // Cargar configuración inicial según el sector
  const initialDefaults = useMemo(() => getSectorCostingDefaults(sector), [sector]);

  // Estados interactivos
  const [productName, setProductName] = useState<string>(initialDefaults.productName);
  const [expectedVolume, setExpectedVolume] = useState<number>(initialDefaults.expectedMonthlyVolume);
  const [variableItems, setVariableItems] = useState<CostItem[]>(initialDefaults.variableItems);
  const [hoursPerUnit, setHoursPerUnit] = useState<number>(initialDefaults.laborConfig.hoursPerUnit);
  const [hourlyRate, setHourlyRate] = useState<number>(initialDefaults.laborConfig.hourlyRate);
  const [benefitsFactor, setBenefitsFactor] = useState<number>(initialDefaults.laborConfig.benefitsFactor);
  const [fixedCostsItems, setFixedCostsItems] = useState<FixedCostItem[]>(initialDefaults.fixedCostsItems);
  
  // Estados de precios
  const [pricingMethod, setPricingMethod] = useState<PricingMethod>(initialDefaults.pricingMethod);
  const [desiredMarginPercent, setDesiredMarginPercent] = useState<number>(initialDefaults.desiredMarginPercent);
  const [desiredMarkupPercent, setDesiredMarkupPercent] = useState<number>(initialDefaults.desiredMarkupPercent);
  const [targetMarketPrice, setTargetMarketPrice] = useState<number>(0);
  const [taxType, setTaxType] = useState<TaxType>(initialDefaults.taxType);
  const [customTaxRate, setCustomTaxRate] = useState<number>(0);

  // Estados visuales
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'unit_cost' | 'pricing' | 'break_even' | 'sensitivity' | 'portfolio' | 'excel_audit'>('unit_cost');

  // Cambiar sector y recargar defaults
  const handleSectorChange = (newSector: IndustrySector) => {
    setSector(newSector);
    const defaults = getSectorCostingDefaults(newSector);
    setProductName(defaults.productName);
    setExpectedVolume(defaults.expectedMonthlyVolume);
    setVariableItems(defaults.variableItems);
    setHoursPerUnit(defaults.laborConfig.hoursPerUnit);
    setHourlyRate(defaults.laborConfig.hourlyRate);
    setBenefitsFactor(defaults.laborConfig.benefitsFactor);
    setFixedCostsItems(defaults.fixedCostsItems);
    setPricingMethod(defaults.pricingMethod);
    setDesiredMarginPercent(defaults.desiredMarginPercent);
    setDesiredMarkupPercent(defaults.desiredMarkupPercent);
    setTaxType(defaults.taxType);
  };

  // Calcular modelo en tiempo real
  const totalFixedCosts = useMemo(() => {
    return fixedCostsItems.reduce((acc, item) => acc + (Number(item.monthlyAmount) || 0), 0);
  }, [fixedCostsItems]);

  const productModel = useMemo(() => {
    return calculateProductModel({
      productName,
      sector,
      expectedMonthlyVolume: Number(expectedVolume) || 1,
      variableItems,
      laborConfig: {
        hoursPerUnit: Number(hoursPerUnit) || 0,
        hourlyRate: Number(hourlyRate) || 0,
        benefitsFactor: Number(benefitsFactor) || 1
      },
      totalMonthlyFixedCosts: totalFixedCosts,
      pricingMethod,
      desiredMarginPercent: Number(desiredMarginPercent) || 0,
      desiredMarkupPercent: Number(desiredMarkupPercent) || 0,
      targetMarketPrice: Number(targetMarketPrice) || 0,
      taxType,
      customTaxRate: Number(customTaxRate) || 0
    });
  }, [
    productName,
    sector,
    expectedVolume,
    variableItems,
    hoursPerUnit,
    hourlyRate,
    benefitsFactor,
    totalFixedCosts,
    pricingMethod,
    desiredMarginPercent,
    desiredMarkupPercent,
    targetMarketPrice,
    taxType,
    customTaxRate
  ]);

  // Calcular Punto de Equilibrio
  const breakEven = useMemo(() => {
    return calculateBreakEven(productModel, fixedCostsItems);
  }, [productModel, fixedCostsItems]);

  // Calcular Análisis de Sensibilidad
  const sensitivityScenarios = useMemo(() => {
    return generateSensitivityScenarios(productModel, breakEven);
  }, [productModel, breakEven]);

  // Portafolio Multiproducto simulado
  const multiProductResult = useMemo(() => {
    // Generamos un portafolio de ejemplo con 2 líneas complementarias
    const complementary1 = calculateProductModel({
      productName: `${productName} (Edición Estándar)`,
      sector,
      expectedMonthlyVolume: Math.round(productModel.expectedMonthlyVolume * 1.5),
      variableItems: productModel.variableItems.map(i => ({ ...i, unitCost: i.unitCost * 0.75 })),
      laborConfig: productModel.laborConfig,
      totalMonthlyFixedCosts: totalFixedCosts,
      pricingMethod: 'margin_on_sales',
      desiredMarginPercent: 35,
      desiredMarkupPercent: 53.8,
      taxType,
      salesMixPercent: 60
    });

    const complementary2 = {
      ...productModel,
      productName: `${productName} (Línea Premium / Enterprise)`,
      salesMixPercent: 40
    };

    return calculateMultiProductBreakEven([complementary1, complementary2], totalFixedCosts);
  }, [productModel, sector, totalFixedCosts, productName, taxType]);

  // Manejo de ítems de costos variables
  const handleAddVariableItem = () => {
    const newItem: CostItem = {
      id: `v-${Date.now()}`,
      name: 'Nuevo Insumo / Componente',
      category: 'materia_prima',
      unit: 'Unidad',
      unitCost: 1000,
      quantityPerProduct: 1,
      subtotal: 1000
    };
    setVariableItems(prev => [...prev, newItem]);
  };

  const handleUpdateVariableItem = (id: string, field: keyof CostItem, value: string | number) => {
    setVariableItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'unitCost' || field === 'quantityPerProduct') {
          updated.subtotal = (Number(updated.unitCost) || 0) * (Number(updated.quantityPerProduct) || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleDeleteVariableItem = (id: string) => {
    setVariableItems(prev => prev.filter(item => item.id !== id));
  };

  // Manejo de partidas de costos fijos
  const handleAddFixedCost = () => {
    const newItem: FixedCostItem = {
      id: `f-${Date.now()}`,
      name: 'Nuevo Gasto Fijo Operacional',
      monthlyAmount: 500000,
      category: 'otros'
    };
    setFixedCostsItems(prev => [...prev, newItem]);
  };

  const handleUpdateFixedCost = (id: string, field: keyof FixedCostItem, value: string | number) => {
    setFixedCostsItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleDeleteFixedCost = (id: string) => {
    setFixedCostsItems(prev => prev.filter(item => item.id !== id));
  };

  // Formateador de moneda en pesos colombianos o moneda estándar
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Copiar resumen ejecutivo para el plan de negocios
  const handleCopySummary = () => {
    const text = `=== ESTRUCTURA DE COSTOS Y PRECIO DE VENTA (ESTUDIO FINANCIERO) ===
Producto / Servicio: ${productModel.productName}
Sector: ${productModel.sector.toUpperCase()}
Volumen Esperado: ${productModel.expectedMonthlyVolume.toLocaleString()} unidades/mes

1. ESTRUCTURA DE COSTO UNITARIO:
- Materia Prima Directa (MPD): ${formatCurrency(productModel.rawMaterialCost)}
- Mano de Obra Directa (MOD): ${formatCurrency(productModel.laborConfig.totalLaborCostPerUnit)} (${productModel.laborConfig.hoursPerUnit}h a ${formatCurrency(productModel.laborConfig.effectiveHourlyRate)}/h con 52% prestacional)
- Costos Indirectos Fabricación (CIFv): ${formatCurrency(productModel.variableCifCost)}
- Empaque y Logística Directa: ${formatCurrency(productModel.packagingLogisticsCost)}
=> COSTO PRIMO (MPD + MOD): ${formatCurrency(productModel.primeCost)}
=> COSTO VARIABLE UNITARIO (CVU): ${formatCurrency(productModel.totalVariableCostPerUnit)}
=> COSTO FIJO ASIGNADO UNITARIO (CFU): ${formatCurrency(productModel.allocatedFixedCostPerUnit)}
=> COSTO TOTAL UNITARIO (CTU): ${formatCurrency(productModel.totalCostPerUnit)}

2. MECANISMO DE FIJACIÓN DE PRECIO:
- Método: ${productModel.pricingMethod === 'margin_on_sales' ? 'Margen Bruto sobre Ventas' : productModel.pricingMethod === 'markup_on_cost' ? 'Markup sobre Costo' : 'Precio de Mercado'}
- Margen Bruto Efectivo: ${productModel.effectiveGrossMarginPercent}%
- Markup Efectivo: ${productModel.effectiveMarkupPercent}%
=> PRECIO DE VENTA NETO (Sin Impuestos): ${formatCurrency(productModel.calculatedNetSalePrice)}
- Impuesto (${productModel.taxType.toUpperCase()} ${productModel.taxPercent}%): ${formatCurrency(productModel.taxAmount)}
=> PRECIO FINAL AL CONSUMIDOR: ${formatCurrency(productModel.calculatedFinalSalePrice)}

3. MARGEN DE CONTRIBUCIÓN & PUNTO DE EQUILIBRIO:
- Margen de Contribución Unitario (MCU): ${formatCurrency(productModel.contributionMarginUnit)}
- Razón de Contribución: ${productModel.contributionMarginRatio}%
- Costos Fijos Totales Mensuales: ${formatCurrency(breakEven.totalMonthlyFixedCosts)}
=> PUNTO DE EQUILIBRIO EN UNIDADES: ${breakEven.breakEvenUnits.toLocaleString()} unidades/mes
=> PUNTO DE EQUILIBRIO EN INGRESOS: ${formatCurrency(breakEven.breakEvenRevenue)}/mes
=> TIEMPO DE COBERTURA: ${breakEven.breakEvenDaysPerMonth} días del mes
=> MARGEN DE SEGURIDAD: ${breakEven.marginOfSafetyPercent}% (${breakEven.marginOfSafetyUnits.toLocaleString()} unidades) [${breakEven.marginOfSafetyStatus.toUpperCase()}]
=> EBITDA MENSUAL PROYECTADO: ${formatCurrency(breakEven.plannedMonthlyEbitda)}/mes`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/70 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                Ingeniería Financiera
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Guía Institucional 2025 & NIIF Pymes
              </span>
              {excelAudit && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel Conectado ({excelAudit.extractedProducts.length} productos detectados)
                </span>
              )}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Motor de Costo de Ventas, Precios & Punto de Equilibrio</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Mecanismos matemáticos para la formulación del <strong className="text-white">Capítulo 9 (Estudio Financiero)</strong>,{' '}
              <strong className="text-white">Capítulo 3 (Políticas de Precio)</strong> y <strong className="text-white">Capítulo 4 (Costos de Producción)</strong>.
              Calcula Costo Primo, Costo Variable Unitario, Margen de Contribución, Markup y Punto de Equilibrio en tiempo real.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleCopySummary}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSummary ? '¡Copiado al Portapapeles!' : 'Copiar Resumen para el Plan'}</span>
            </button>
          </div>
        </div>

        {/* Sector Preset Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Cargar Plantilla por Sector:
          </span>
          {INDUSTRY_SECTORS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSectorChange(s.id)}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                sector === s.id
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 border border-indigo-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{s.badge}</span>
              <span>{s.name.split('/')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Visual Cards (Top Level Results) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Costo Variable Unitario */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo Variable (CVU)</span>
          <div className="text-lg font-black text-amber-400">{formatCurrency(productModel.totalVariableCostPerUnit)}</div>
          <div className="text-[11px] text-slate-400">Costo Primo: {formatCurrency(productModel.primeCost)}</div>
        </div>

        {/* Card 2: Costo Total Unitario */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo Total Unit. (CTU)</span>
          <div className="text-lg font-black text-slate-200">{formatCurrency(productModel.totalCostPerUnit)}</div>
          <div className="text-[11px] text-slate-400">Fijo asig: {formatCurrency(productModel.allocatedFixedCostPerUnit)}</div>
        </div>

        {/* Card 3: Precio de Venta Neto */}
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Precio de Venta Neto</span>
          <div className="text-lg font-black text-indigo-400">{formatCurrency(productModel.calculatedNetSalePrice)}</div>
          <div className="text-[11px] text-indigo-300/80">Con Imp: {formatCurrency(productModel.calculatedFinalSalePrice)}</div>
        </div>

        {/* Card 4: Margen de Contribución */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Margen Contrib. (MCU)</span>
          <div className="text-lg font-black text-emerald-400">{formatCurrency(productModel.contributionMarginUnit)}</div>
          <div className="text-[11px] text-emerald-300/80">Razón: {productModel.contributionMarginRatio}% del PV</div>
        </div>

        {/* Card 5: Punto de Equilibrio */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Punto de Equilibrio</span>
          <div className="text-lg font-black text-cyan-400">{breakEven.breakEvenUnits.toLocaleString()} und/mes</div>
          <div className="text-[11px] text-cyan-300/80">{formatCurrency(breakEven.breakEvenRevenue)}/mes</div>
        </div>

        {/* Card 6: Margen de Seguridad */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-lg backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Margen de Seguridad</span>
          <div className={`text-lg font-black ${
            breakEven.marginOfSafetyStatus === 'excelente' ? 'text-emerald-400' :
            breakEven.marginOfSafetyStatus === 'saludable' ? 'text-cyan-400' :
            breakEven.marginOfSafetyStatus === 'ajustado' ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {breakEven.marginOfSafetyPercent}%
          </div>
          <div className="text-[11px] text-slate-400 uppercase font-semibold">{breakEven.marginOfSafetyStatus}</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('unit_cost')}
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeSubTab === 'unit_cost'
              ? 'border-amber-400 text-amber-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>1. Estructura de Costo Unitario & Materias Primas</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pricing')}
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeSubTab === 'pricing'
              ? 'border-indigo-400 text-indigo-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <DollarSign className="w-4 h-4 text-indigo-400" />
          <span>2. Fijación de Precios & Margen Bruto</span>
        </button>

        <button
          onClick={() => setActiveSubTab('break_even')}
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeSubTab === 'break_even'
              ? 'border-cyan-400 text-cyan-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>3. Punto de Equilibrio & Gastos Fijos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sensitivity')}
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeSubTab === 'sensitivity'
              ? 'border-emerald-400 text-emerald-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>4. Análisis de Sensibilidad (Stress Test)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('portfolio')}
          type="button"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
            activeSubTab === 'portfolio'
              ? 'border-purple-400 text-purple-300 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span>5. Portafolio Multiproducto (Mix Ponderado)</span>
        </button>

        {excelAudit && (
          <button
            onClick={() => setActiveSubTab('excel_audit')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeSubTab === 'excel_audit'
                ? 'border-emerald-400 text-emerald-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Auditoría Excel ({excelAudit.extractedProducts.length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: ESTRUCTURA DE COSTOS */}
      {activeSubTab === 'unit_cost' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 shadow-xl backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Desglose de Costos Directos Variables por Unidad de Producto</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Materias primas, mano de obra directa y costos indirectos variables (CIFv) consumidos en la elaboración o entrega.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Producto:</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-64"
                    placeholder="Nombre del bien o servicio"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Volumen Mensual:</label>
                  <input
                    type="number"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(Math.max(1, Number(e.target.value)))}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-24"
                    placeholder="Und/mes"
                  />
                </div>
              </div>
            </div>

            {/* Variable Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Concepto / Insumo</th>
                    <th className="py-2.5 px-3">Categoría de Costo</th>
                    <th className="py-2.5 px-3">Unidad Medida</th>
                    <th className="py-2.5 px-3 text-right">Costo Unit. Insumo</th>
                    <th className="py-2.5 px-3 text-right">Cant. por Producto</th>
                    <th className="py-2.5 px-3 text-right">Subtotal por Producto</th>
                    <th className="py-2.5 px-3 text-center w-12">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {variableItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateVariableItem(item.id, 'name', e.target.value)}
                          className="bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-200 w-full focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateVariableItem(item.id, 'category', e.target.value)}
                          className="bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="materia_prima">Materia Prima Directa (MPD)</option>
                          <option value="cif_variable">Costos Indirectos Variables (CIFv)</option>
                          <option value="empaque_logistica">Empaque y Flete Directo</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateVariableItem(item.id, 'unit', e.target.value)}
                          className="bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-300 w-24 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => handleUpdateVariableItem(item.id, 'unitCost', Number(e.target.value))}
                          className="bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-200 text-right w-24 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={item.quantityPerProduct}
                          onChange={(e) => handleUpdateVariableItem(item.id, 'quantityPerProduct', Number(e.target.value))}
                          className="bg-slate-950/70 border border-slate-800/80 rounded px-2 py-1 text-xs text-slate-200 text-right w-20 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-amber-400 font-mono">
                        {formatCurrency(item.subtotal)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleDeleteVariableItem(item.id)}
                          type="button"
                          className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleAddVariableItem}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Insumo o Costo Directo</span>
              </button>

              <div className="text-right text-xs text-slate-400">
                <span>Subtotal Insumos Variables: </span>
                <strong className="text-white font-mono text-sm ml-1">
                  {formatCurrency(productModel.rawMaterialCost + productModel.variableCifCost + productModel.packagingLogisticsCost)}
                </strong>
              </div>
            </div>

            {/* Direct Labor Configuration Box */}
            <div className="mt-6 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    MOD
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Mano de Obra Directa (MOD) con Factor Prestacional Institucional
                  </h4>
                </div>
                <span className="text-[11px] text-indigo-300 font-mono">
                  Total MOD/Unidad: <strong className="text-white">{formatCurrency(productModel.laborConfig.totalLaborCostPerUnit)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    Horas Invertidas por Unidad
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={hoursPerUnit}
                    onChange={(e) => setHoursPerUnit(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Ej: 0.5 h = 30 minutos por unidad
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    Tarifa Base por Hora
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Salario ordinario mensual / 230 horas
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    Factor Prestacional de Ley
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={benefitsFactor}
                    onChange={(e) => setBenefitsFactor(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    1.52 = 52% (Cesantías, prima, salud, pensión, ARL)
                  </span>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-lg p-2.5 flex flex-col justify-center">
                  <span className="text-[10px] text-indigo-300 uppercase font-bold">Tarifa Horaria Real Cargada</span>
                  <div className="text-base font-black text-white font-mono">
                    {formatCurrency(productModel.laborConfig.effectiveHourlyRate)}/h
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Costo real que asume la empresa
                  </span>
                </div>
              </div>
            </div>

            {/* Sumario de Costos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo Primo (MPD + MOD)</span>
                <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                  {formatCurrency(productModel.primeCost)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Base fundamental exigida en rúbricas de manufactura y producción.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo Variable Total (CVU)</span>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  {formatCurrency(productModel.totalVariableCostPerUnit)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Costo directo mínimo necesario para fabricar o proveer 1 unidad.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo Total Absorbente (CTU)</span>
                <div className="text-base font-bold text-indigo-400 font-mono mt-0.5">
                  {formatCurrency(productModel.totalCostPerUnit)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Incluye amortización de costos fijos ({formatCurrency(productModel.allocatedFixedCostPerUnit)}/u).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIJACIÓN DE PRECIOS */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-6 shadow-xl backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  <span>Mecanismos de Determinación de Precios de Venta (Capítulo 3.0 & 9.0)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Elija la estrategia de costeo: Margen Bruto sobre Ventas, Markup sobre el Costo o Precio de Mercado.
                </p>
              </div>

              {/* Selector de Método de Precios */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPricingMethod('margin_on_sales')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pricingMethod === 'margin_on_sales'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Margen s/ Venta %
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMethod('markup_on_cost')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pricingMethod === 'markup_on_cost'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Markup s/ Costo %
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMethod('target_price')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    pricingMethod === 'target_price'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Precio de Mercado
                </button>
              </div>
            </div>

            {/* Configuración según método elegido */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {pricingMethod === 'margin_on_sales' && (
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">
                        Margen Bruto de Utilidad Deseado:
                      </label>
                      <span className="text-base font-black text-indigo-400 font-mono">
                        {desiredMarginPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="90"
                      step="1"
                      value={desiredMarginPercent}
                      onChange={(e) => setDesiredMarginPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>5% (Comercio masivo)</span>
                      <span>40% (Promedio industrial)</span>
                      <span>85% (SaaS / Software)</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                      <strong>Fórmula Financiera Oficial:</strong>
                      <br />
                      <code className="text-indigo-300 font-mono">
                        Precio Neto = Costo Variable Unitario / (1 - Margen%)
                      </code>
                      <br />
                      <span className="text-slate-400 mt-1 block">
                        Equivale a un <strong>Markup del {productModel.effectiveMarkupPercent}%</strong> sobre el costo.
                      </span>
                    </div>
                  </div>
                )}

                {pricingMethod === 'markup_on_cost' && (
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200">
                        Markup Deseado sobre el Costo:
                      </label>
                      <span className="text-base font-black text-indigo-400 font-mono">
                        {desiredMarkupPercent}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="5"
                      value={desiredMarkupPercent}
                      onChange={(e) => setDesiredMarkupPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>10% (Retail básico)</span>
                      <span>80% (Moda / Calzado)</span>
                      <span>250% (Gastronomía)</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                      <strong>Fórmula de Recargo Comercial:</strong>
                      <br />
                      <code className="text-indigo-300 font-mono">
                        Precio Neto = Costo Variable Unitario * (1 + Markup%)
                      </code>
                      <br />
                      <span className="text-slate-400 mt-1 block">
                        Genera un <strong>Margen Bruto de Utilidad del {productModel.effectiveGrossMarginPercent}%</strong> sobre la venta.
                      </span>
                    </div>
                  </div>
                )}

                {pricingMethod === 'target_price' && (
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-indigo-500/20">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1">
                        Precio de Venta Objetivo del Mercado (Competencia)
                      </label>
                      <input
                        type="number"
                        value={targetMarketPrice || productModel.calculatedNetSalePrice}
                        onChange={(e) => setTargetMarketPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm font-bold text-indigo-400 focus:outline-none focus:border-indigo-500"
                        placeholder="Ej. 75000"
                      />
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                      <strong>Ingeniería de Costo Objetivo (Target Costing):</strong>
                      <br />
                      Margen resultante con su costo actual: <strong className="text-emerald-400 font-mono">{productModel.effectiveGrossMarginPercent}%</strong>.
                      {productModel.effectiveGrossMarginPercent < 15 && (
                        <span className="text-rose-400 block mt-1">
                          ⚠️ Alerta: El precio fijado está muy cerca del costo variable. Riegos de insolvencia operativa.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Impuestos Indirectos (IVA / INC) */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">
                    Tratamiento Tributario (Impuestos Indirectos al Consumo)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'Sin Impuesto (0%)' },
                      { id: 'iva_19', label: 'IVA General (19%)' },
                      { id: 'iva_5', label: 'IVA Reducido (5%)' },
                      { id: 'inc_8', label: 'INC Bares/Rest. (8%)' }
                    ].map((tax) => (
                      <button
                        key={tax.id}
                        type="button"
                        onClick={() => setTaxType(tax.id as TaxType)}
                        className={`p-2 rounded-lg text-xs font-semibold text-center transition cursor-pointer border ${
                          taxType === tax.id
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {tax.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tarjeta de Resumen de Facturación */}
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-950/80 p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    Cascada de Precios & Utilidad Unitaria
                  </h4>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Costo Variable Unitario (CVU)</span>
                      <span className="font-mono text-slate-200 font-bold">{formatCurrency(productModel.totalVariableCostPerUnit)}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Margen de Contribución Unitario (MCU)</span>
                      <span className="font-mono text-emerald-400 font-bold">+{formatCurrency(productModel.contributionMarginUnit)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 bg-indigo-950/40 px-2 rounded-lg">
                      <span className="font-bold text-white">PRECIO DE VENTA NETO (Sin Impuestos)</span>
                      <span className="font-mono text-base font-black text-indigo-300">{formatCurrency(productModel.calculatedNetSalePrice)}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Impuesto {productModel.taxType.toUpperCase()} ({productModel.taxPercent}%)</span>
                      <span className="font-mono text-slate-300">+{formatCurrency(productModel.taxAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2.5 bg-slate-900 border border-slate-800 px-3 rounded-lg shadow-inner">
                      <div>
                        <span className="font-bold text-white block">PRECIO FINAL AL PÚBLICO</span>
                        <span className="text-[10px] text-slate-400">Con factura o documento equivalente</span>
                      </div>
                      <span className="font-mono text-lg font-black text-emerald-400">{formatCurrency(productModel.calculatedFinalSalePrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Razón de Contribución: <strong className="text-white">{productModel.contributionMarginRatio}%</strong></span>
                  <span>Markup Efectivo: <strong className="text-white">{productModel.effectiveMarkupPercent}%</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUNTO DE EQUILIBRIO */}
      {activeSubTab === 'break_even' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-6 shadow-xl backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>Punto de Equilibrio Operativo & Estructura de Gastos Fijos</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calcula el umbral mínimo de unidades y ventas requeridas para no generar pérdidas (Beneficio Operativo = 0).
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Gastos Fijos Mensuales:</span>
                <span className="text-base font-black text-cyan-400 font-mono">{formatCurrency(totalFixedCosts)}</span>
              </div>
            </div>

            {/* Break-Even Visual Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-cyan-300 uppercase">Unidades de Equilibrio</span>
                <div className="text-2xl font-black text-white font-mono">
                  {breakEven.breakEvenUnits.toLocaleString()} <span className="text-xs text-slate-400 font-normal">und/mes</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Frente a la meta de {breakEven.plannedMonthlyVolume.toLocaleString()} und ({Math.round((breakEven.breakEvenUnits / breakEven.plannedMonthlyVolume) * 100)}% de la capacidad planeada).
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-indigo-300 uppercase">Ventas de Equilibrio en Dinero</span>
                <div className="text-2xl font-black text-indigo-300 font-mono">
                  {formatCurrency(breakEven.breakEvenRevenue)} <span className="text-xs text-slate-400 font-normal">/mes</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Ingresos netos exactos para cubrir costos variables y el 100% de los gastos fijos.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-300 uppercase">Días para el Equilibrio</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  Día {breakEven.breakEvenDaysPerMonth} <span className="text-xs text-slate-400 font-normal">del mes</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Los {30 - breakEven.breakEvenDaysPerMonth} días restantes del mes generan utilidad operativa neta (EBITDA).
                </p>
              </div>
            </div>

            {/* Fixed Costs Breakdown Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Presupuesto Detallado de Gastos Fijos Mensuales
                </h4>
                <button
                  type="button"
                  onClick={handleAddFixedCost}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 transition cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Agregar Gasto Fijo</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Partida de Gasto Fijo</th>
                      <th className="py-2 px-3">Clasificación Contable</th>
                      <th className="py-2 px-3 text-right">Monto Mensual ($)</th>
                      <th className="py-2 px-3 text-center w-12">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {fixedCostsItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateFixedCost(item.id, 'name', e.target.value)}
                            className="bg-slate-950/70 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-full focus:outline-none focus:border-cyan-500"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={item.category}
                            onChange={(e) => handleUpdateFixedCost(item.id, 'category', e.target.value)}
                            className="bg-slate-950/70 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="nomina_admin">Nómina Administrativa</option>
                            <option value="arriendo">Arrendamiento de Instalaciones</option>
                            <option value="servicios">Servicios Públicos / Conectividad</option>
                            <option value="software">Software & Plataformas</option>
                            <option value="marketing">Publicidad y Mercadeo Fijo</option>
                            <option value="depreciacion">Mantenimiento / Amortización</option>
                            <option value="otros">Otros Gastos Fijos</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <input
                            type="number"
                            value={item.monthlyAmount}
                            onChange={(e) => handleUpdateFixedCost(item.id, 'monthlyAmount', Number(e.target.value))}
                            className="bg-slate-950/70 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 text-right w-36 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleDeleteFixedCost(item.id)}
                            type="button"
                            className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* P&L Snapshot at Expected Volume */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Estado de Resultados Operacional Proyectado (Mes Típico al 100% de la Meta)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Ventas Netas Totales</span>
                  <div className="text-sm font-black text-white font-mono mt-0.5">
                    {formatCurrency(breakEven.plannedMonthlyRevenue)}
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Costo Total de Ventas (CMV)</span>
                  <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                    -{formatCurrency(breakEven.plannedMonthlyVariableCosts)}
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Gastos Fijos Totales</span>
                  <div className="text-sm font-black text-rose-400 font-mono mt-0.5">
                    -{formatCurrency(breakEven.totalMonthlyFixedCosts)}
                  </div>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold">EBITDA Operativo Mensual</span>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    {formatCurrency(breakEven.plannedMonthlyEbitda)}
                  </div>
                  <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                    Margen Neto: {breakEven.netMarginPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANÁLISIS DE SENSIBILIDAD */}
      {activeSubTab === 'sensitivity' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 shadow-xl backdrop-blur">
            <div className="border-b border-slate-800/80 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Análisis de Sensibilidad Multivariado (Stress Testing Financiero)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulación del impacto en el Punto de Equilibrio y EBITDA ante fluctuaciones en precios, costos de insumos y volumen de mercado.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Escenario de Estrés</th>
                    <th className="py-2.5 px-3 text-center">Δ Costos</th>
                    <th className="py-2.5 px-3 text-center">Δ Precio</th>
                    <th className="py-2.5 px-3 text-center">Δ Volumen</th>
                    <th className="py-2.5 px-3 text-right">Nuevo CVU</th>
                    <th className="py-2.5 px-3 text-right">Nuevo Precio</th>
                    <th className="py-2.5 px-3 text-right">Pto. Equilibrio</th>
                    <th className="py-2.5 px-3 text-right">EBITDA Mensual</th>
                    <th className="py-2.5 px-3 text-center">Viabilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {sensitivityScenarios.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-sans">
                        <strong className="text-white block">{sc.name}</strong>
                        <span className="text-[10px] text-slate-400">{sc.description}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sc.costChangePercent > 0 ? 'bg-rose-500/20 text-rose-300' :
                          sc.costChangePercent < 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sc.costChangePercent > 0 ? `+${sc.costChangePercent}%` : `${sc.costChangePercent}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sc.priceChangePercent < 0 ? 'bg-rose-500/20 text-rose-300' :
                          sc.priceChangePercent > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sc.priceChangePercent > 0 ? `+${sc.priceChangePercent}%` : `${sc.priceChangePercent}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sc.volumeChangePercent < 0 ? 'bg-rose-500/20 text-rose-300' :
                          sc.volumeChangePercent > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {sc.volumeChangePercent > 0 ? `+${sc.volumeChangePercent}%` : `${sc.volumeChangePercent}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {formatCurrency(sc.resultingUnitCost)}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">
                        {formatCurrency(sc.resultingNetPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-cyan-400">
                        {sc.resultingBreakEvenUnits.toLocaleString()} und
                      </td>
                      <td className={`py-3 px-3 text-right font-black ${
                        sc.resultingMonthlyEbitda >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {formatCurrency(sc.resultingMonthlyEbitda)}
                      </td>
                      <td className="py-3 px-3 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          sc.status === 'ganancia' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          sc.status === 'equilibrio' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {sc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Criterio Evaluador Institucional:</strong> Un plan de negocios viable debe demostrar que soporta
                un incremento mínimo del 10% en costos de materias primas o una contracción del 15% en ventas sin que el EBITDA caiga en cifras negativas.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PORTAFOLIO MULTIPRODUCTO */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 shadow-xl backdrop-blur">
            <div className="border-b border-slate-800/80 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Punto de Equilibrio Ponderado (Mezcla de Ventas Multiproducto)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribución del punto de equilibrio entre múltiples líneas de producto según su porcentaje de participación en ventas (% Mix).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
                <span className="text-xs font-bold text-purple-300 uppercase">Razón de Contribución Ponderada</span>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {multiProductResult.weightedContributionMarginRatio}%
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Margen promedio real obtenido por cada $100 vendidos en el portafolio combinado.
                </p>
              </div>

              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                <span className="text-xs font-bold text-indigo-300 uppercase">Ingreso de Equilibrio del Portafolio</span>
                <div className="text-2xl font-black text-indigo-300 font-mono mt-1">
                  {formatCurrency(multiProductResult.totalBreakEvenRevenue)}/mes
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Venta global mensual requerida entre todos los productos para cubrir {formatCurrency(multiProductResult.totalFixedCosts)} de costos fijos.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Producto / Línea</th>
                    <th className="py-2.5 px-3 text-center">% Mix Ventas</th>
                    <th className="py-2.5 px-3 text-right">Precio Neto</th>
                    <th className="py-2.5 px-3 text-right">Costo Variable</th>
                    <th className="py-2.5 px-3 text-right">Margen Contrib.</th>
                    <th className="py-2.5 px-3 text-right">Unidades Equilibrio</th>
                    <th className="py-2.5 px-3 text-right">Ventas Equilibrio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {multiProductResult.products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-sans font-bold text-white">
                        {p.productName}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                          {p.salesMixPercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right text-amber-400">
                        {formatCurrency(p.unitCost)}
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(p.contributionMargin)}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-cyan-400">
                        {p.allocatedBreakEvenUnits.toLocaleString()} und
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {formatCurrency(p.allocatedBreakEvenRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDITORÍA EXCEL (.XLSX) */}
      {activeSubTab === 'excel_audit' && excelAudit && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-5 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Auditoría Matemática y Numérica del Modelo Excel Cargado</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verificación de fórmulas de precios, márgenes de utilidad y coherencia presupuestal en las hojas analizadas.
                </p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                excelAudit.summaryStatus === 'optimo' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                excelAudit.summaryStatus === 'con_observaciones' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                Estado: {excelAudit.summaryStatus.replace('_', ' ')}
              </span>
            </div>

            {/* Inconsistencias de Fórmulas o Costos */}
            {excelAudit.mathIntegrityIssues.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Hallazgos y Observaciones Numéricas Detectadas:
                </h4>
                <div className="space-y-2">
                  {excelAudit.mathIntegrityIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                        issue.severity === 'error' ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' :
                        issue.severity === 'warning' ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' :
                        'bg-slate-950/40 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {issue.severity === 'error' ? <ShieldAlert className="w-4 h-4 text-rose-400" /> :
                         issue.severity === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-400" /> :
                         <Info className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div>
                        <strong className="block font-bold">{issue.title}</strong>
                        <p className="mt-0.5 text-[11px] opacity-90">{issue.message}</p>
                        {issue.sheet && (
                          <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            Hoja: {issue.sheet}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>No se detectaron rupturas de fórmulas (#REF!, #DIV/0!) ni precios inferiores al costo en el Excel.</span>
              </div>
            )}

            {/* Extracted Products from Excel */}
            {excelAudit.extractedProducts.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  Precios y Costos Unitarios Extraídos de las Hojas de Cálculo:
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2 px-3">Producto / Ítem Detectado</th>
                        <th className="py-2 px-3">Hoja de Origen</th>
                        <th className="py-2 px-3 text-right">Costo Unitario</th>
                        <th className="py-2 px-3 text-right">Precio de Venta</th>
                        <th className="py-2 px-3 text-right">Margen Bruto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {excelAudit.extractedProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3 font-sans font-bold text-white">{p.product}</td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans">{p.sourceSheet}</td>
                          <td className="py-2.5 px-3 text-right text-amber-400">{formatCurrency(p.unitCost)}</td>
                          <td className="py-2.5 px-3 text-right text-indigo-300 font-bold">{formatCurrency(p.salePrice)}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.grossMarginPercent < 0 ? 'bg-rose-500/20 text-rose-400' :
                              p.grossMarginPercent < 15 ? 'bg-amber-500/20 text-amber-400' :
                              'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {p.grossMarginPercent}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
