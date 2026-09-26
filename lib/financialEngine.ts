import { IndustrySector } from './types';

// ==========================================
// INTERFACES DEL MOTOR FINANCIERO Y COSTOS
// ==========================================

export type PricingMethod = 'margin_on_sales' | 'markup_on_cost' | 'target_price';
export type TaxType = 'none' | 'iva_19' | 'iva_5' | 'inc_8' | 'custom';
export type CostCategory = 'materia_prima' | 'mano_de_obra' | 'cif_variable' | 'empaque_logistica' | 'costo_fijo';

export interface CostItem {
  id: string;
  name: string;
  category: CostCategory;
  unit: string;
  unitCost: number;
  quantityPerProduct: number;
  subtotal: number;
}

export interface DirectLaborConfig {
  hoursPerUnit: number;
  hourlyRate: number;
  benefitsFactor: number; // Ej. 1.52 para 52% factor prestacional (Colombia)
  effectiveHourlyRate: number;
  totalLaborCostPerUnit: number;
}

export interface FixedCostItem {
  id: string;
  name: string;
  monthlyAmount: number;
  category: 'arriendo' | 'nomina_admin' | 'servicios' | 'software' | 'marketing' | 'depreciacion' | 'otros';
}

export interface ProductCostModel {
  id: string;
  productName: string;
  sku: string;
  sector: IndustrySector;
  expectedMonthlyVolume: number;
  
  // Desglose de Costos Variables
  variableItems: CostItem[];
  rawMaterialCost: number; // MPD
  laborConfig: DirectLaborConfig; // MOD
  variableCifCost: number; // CIFv
  packagingLogisticsCost: number; // Empaques y flete directo
  
  // Costos Calculados
  primeCost: number; // Costo Primo = MPD + MOD
  conversionCost: number; // Costo Conversión = MOD + CIF
  totalVariableCostPerUnit: number; // CVU
  allocatedFixedCostPerUnit: number; // CFU
  totalCostPerUnit: number; // CTU = CVU + CFU

  // Estrategia de Precios
  pricingMethod: PricingMethod;
  desiredMarginPercent: number; // Margen bruto deseado sobre precio (ej. 40%)
  desiredMarkupPercent: number; // Markup deseado sobre costo (ej. 66.6%)
  targetMarketPrice: number; // Precio objetivo de mercado

  // Precios Resultantes
  calculatedNetSalePrice: number; // PV antes de impuestos
  taxType: TaxType;
  taxPercent: number;
  taxAmount: number;
  calculatedFinalSalePrice: number; // PV con impuestos al consumidor

  // Indicadores de Rentabilidad
  contributionMarginUnit: number; // MCU = PV neto - CVU
  contributionMarginRatio: number; // RMC % = MCU / PV neto * 100
  effectiveGrossMarginPercent: number; // Margen real = (PV - CVU) / PV
  effectiveMarkupPercent: number; // Markup real = (PV - CVU) / CVU
  salesMixPercent?: number; // % de participación en el portafolio
}

export interface FinancialBreakEvenResult {
  totalMonthlyFixedCosts: number;
  fixedCostsItems: FixedCostItem[];
  
  // Punto de equilibrio del producto principal
  breakEvenUnits: number;
  breakEvenRevenue: number;
  breakEvenDaysPerMonth: number; // Asumiendo 30 días
  
  // Proyecciones mensuales al volumen esperado
  plannedMonthlyVolume: number;
  plannedMonthlyRevenue: number;
  plannedMonthlyVariableCosts: number;
  plannedMonthlyGrossProfit: number;
  plannedMonthlyEbitda: number;
  netMarginPercent: number;

  // Margen de Seguridad
  marginOfSafetyUnits: number;
  marginOfSafetyPercent: number;
  marginOfSafetyStatus: 'critico' | 'ajustado' | 'saludable' | 'excelente';
}

export interface FinancialSensitivityScenario {
  id: string;
  name: string;
  description: string;
  costChangePercent: number; // % cambio en CVU
  priceChangePercent: number; // % cambio en PV
  volumeChangePercent: number; // % cambio en volumen de ventas
  resultingUnitCost: number;
  resultingNetPrice: number;
  resultingContributionMargin: number;
  resultingBreakEvenUnits: number;
  resultingMonthlyRevenue: number;
  resultingMonthlyEbitda: number;
  status: 'ganancia' | 'equilibrio' | 'perdida';
}

export interface MultiProductBreakEvenResult {
  products: {
    id: string;
    productName: string;
    salesMixPercent: number;
    unitPrice: number;
    unitCost: number;
    contributionMargin: number;
    contributionMarginRatio: number;
    allocatedBreakEvenUnits: number;
    allocatedBreakEvenRevenue: number;
  }[];
  weightedContributionMarginRatio: number;
  totalBreakEvenRevenue: number;
  totalPlannedRevenue: number;
  totalFixedCosts: number;
}

export interface ExcelFinancialAuditResult {
  sheetsAnalyzed: string[];
  detectedProductsCount: number;
  extractedProducts: {
    product: string;
    unitCost: number;
    salePrice: number;
    grossMarginPercent: number;
    sourceSheet: string;
  }[];
  mathIntegrityIssues: {
    severity: 'error' | 'warning' | 'info';
    title: string;
    message: string;
    sheet?: string;
  }[];
  detectedFixedCosts?: number;
  estimatedBreakEvenUnits?: number;
  estimatedBreakEvenRevenue?: number;
  averagePortfolioMargin?: number;
  summaryStatus: 'optimo' | 'con_observaciones' | 'incompleto';
}

// ==========================================
// FUNCIONES MATEMÁTICAS PURAS DE COSTEO
// ==========================================

export function calculateDirectLabor(config: {
  hoursPerUnit: number;
  hourlyRate: number;
  benefitsFactor: number;
}): DirectLaborConfig {
  const effectiveHourlyRate = config.hourlyRate * config.benefitsFactor;
  const totalLaborCostPerUnit = config.hoursPerUnit * effectiveHourlyRate;
  return {
    hoursPerUnit: config.hoursPerUnit,
    hourlyRate: config.hourlyRate,
    benefitsFactor: config.benefitsFactor,
    effectiveHourlyRate,
    totalLaborCostPerUnit
  };
}

export function calculateSalePriceFromMargin(unitCost: number, marginPercent: number): number {
  if (marginPercent >= 100) return unitCost * 10; // Protección contra división por cero
  const marginDecimal = Math.max(0, Math.min(99.9, marginPercent)) / 100;
  return unitCost / (1 - marginDecimal);
}

export function calculateSalePriceFromMarkup(unitCost: number, markupPercent: number): number {
  const markupDecimal = Math.max(0, markupPercent) / 100;
  return unitCost * (1 + markupDecimal);
}

export function marginToMarkup(marginPercent: number): number {
  if (marginPercent >= 100) return 999;
  const m = marginPercent / 100;
  return (m / (1 - m)) * 100;
}

export function markupToMargin(markupPercent: number): number {
  const k = markupPercent / 100;
  return (k / (1 + k)) * 100;
}

export function getTaxRate(taxType: TaxType, customRate = 0): number {
  switch (taxType) {
    case 'iva_19': return 0.19;
    case 'iva_5': return 0.05;
    case 'inc_8': return 0.08;
    case 'custom': return customRate / 100;
    case 'none':
    default: return 0;
  }
}

export function calculateProductModel(params: {
  productName: string;
  sku?: string;
  sector: IndustrySector;
  expectedMonthlyVolume: number;
  variableItems: CostItem[];
  laborConfig: {
    hoursPerUnit: number;
    hourlyRate: number;
    benefitsFactor: number;
  };
  totalMonthlyFixedCosts: number;
  pricingMethod: PricingMethod;
  desiredMarginPercent: number;
  desiredMarkupPercent: number;
  targetMarketPrice?: number;
  taxType: TaxType;
  customTaxRate?: number;
  salesMixPercent?: number;
}): ProductCostModel {
  const {
    productName,
    sku = 'SKU-001',
    sector,
    expectedMonthlyVolume = 100,
    variableItems,
    laborConfig: rawLaborConfig,
    totalMonthlyFixedCosts,
    pricingMethod,
    desiredMarginPercent,
    desiredMarkupPercent,
    targetMarketPrice = 0,
    taxType,
    customTaxRate = 0,
    salesMixPercent = 100
  } = params;

  // 1. Desglose de costos variables
  let rawMaterialCost = 0;
  let variableCifCost = 0;
  let packagingLogisticsCost = 0;

  for (const item of variableItems) {
    const subtotal = item.unitCost * item.quantityPerProduct;
    item.subtotal = subtotal;
    if (item.category === 'materia_prima') rawMaterialCost += subtotal;
    else if (item.category === 'cif_variable') variableCifCost += subtotal;
    else if (item.category === 'empaque_logistica') packagingLogisticsCost += subtotal;
  }

  // 2. Mano de Obra Directa
  const laborConfig = calculateDirectLabor(rawLaborConfig);
  const directLaborCost = laborConfig.totalLaborCostPerUnit;

  // 3. Totales de Costo
  const primeCost = rawMaterialCost + directLaborCost;
  const conversionCost = directLaborCost + variableCifCost;
  const totalVariableCostPerUnit = rawMaterialCost + directLaborCost + variableCifCost + packagingLogisticsCost;
  const allocatedFixedCostPerUnit = expectedMonthlyVolume > 0 
    ? (totalMonthlyFixedCosts * (salesMixPercent / 100)) / expectedMonthlyVolume 
    : 0;
  const totalCostPerUnit = totalVariableCostPerUnit + allocatedFixedCostPerUnit;

  // 4. Determinación de Precio Neto
  let calculatedNetSalePrice = 0;

  if (pricingMethod === 'margin_on_sales') {
    calculatedNetSalePrice = calculateSalePriceFromMargin(totalVariableCostPerUnit, desiredMarginPercent);
  } else if (pricingMethod === 'markup_on_cost') {
    calculatedNetSalePrice = calculateSalePriceFromMarkup(totalVariableCostPerUnit, desiredMarkupPercent);
  } else if (pricingMethod === 'target_price') {
    calculatedNetSalePrice = targetMarketPrice > 0 ? targetMarketPrice : totalVariableCostPerUnit * 1.5;
  }

  // Redondear a números limpios (ej. 2 decimales o entero más cercano si es COP)
  calculatedNetSalePrice = Math.round(calculatedNetSalePrice * 100) / 100;

  // 5. Impuestos (IVA / INC)
  const taxRate = getTaxRate(taxType, customTaxRate);
  const taxPercent = taxRate * 100;
  const taxAmount = Math.round(calculatedNetSalePrice * taxRate * 100) / 100;
  const calculatedFinalSalePrice = Math.round((calculatedNetSalePrice + taxAmount) * 100) / 100;

  // 6. Márgenes y Ratios
  const contributionMarginUnit = Math.round((calculatedNetSalePrice - totalVariableCostPerUnit) * 100) / 100;
  const contributionMarginRatio = calculatedNetSalePrice > 0 
    ? Math.round((contributionMarginUnit / calculatedNetSalePrice) * 10000) / 100 
    : 0;
  const effectiveGrossMarginPercent = contributionMarginRatio;
  const effectiveMarkupPercent = totalVariableCostPerUnit > 0 
    ? Math.round((contributionMarginUnit / totalVariableCostPerUnit) * 10000) / 100 
    : 0;

  return {
    id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productName,
    sku,
    sector,
    expectedMonthlyVolume,
    variableItems,
    rawMaterialCost,
    laborConfig,
    variableCifCost,
    packagingLogisticsCost,
    primeCost,
    conversionCost,
    totalVariableCostPerUnit,
    allocatedFixedCostPerUnit,
    totalCostPerUnit,
    pricingMethod,
    desiredMarginPercent,
    desiredMarkupPercent,
    targetMarketPrice,
    calculatedNetSalePrice,
    taxType,
    taxPercent,
    taxAmount,
    calculatedFinalSalePrice,
    contributionMarginUnit,
    contributionMarginRatio,
    effectiveGrossMarginPercent,
    effectiveMarkupPercent,
    salesMixPercent
  };
}

export function calculateBreakEven(
  product: ProductCostModel,
  fixedCostsItems: FixedCostItem[]
): FinancialBreakEvenResult {
  const totalMonthlyFixedCosts = fixedCostsItems.reduce((acc, item) => acc + item.monthlyAmount, 0);
  const mcu = product.contributionMarginUnit;
  const rmc = product.contributionMarginRatio / 100;

  let breakEvenUnits = 0;
  let breakEvenRevenue = 0;

  if (mcu > 0) {
    breakEvenUnits = Math.ceil(totalMonthlyFixedCosts / mcu);
    breakEvenRevenue = Math.round(breakEvenUnits * product.calculatedNetSalePrice);
  }

  const plannedMonthlyVolume = product.expectedMonthlyVolume;
  const plannedMonthlyRevenue = Math.round(plannedMonthlyVolume * product.calculatedNetSalePrice);
  const plannedMonthlyVariableCosts = Math.round(plannedMonthlyVolume * product.totalVariableCostPerUnit);
  const plannedMonthlyGrossProfit = plannedMonthlyRevenue - plannedMonthlyVariableCosts;
  const plannedMonthlyEbitda = plannedMonthlyGrossProfit - totalMonthlyFixedCosts;
  const netMarginPercent = plannedMonthlyRevenue > 0 
    ? Math.round((plannedMonthlyEbitda / plannedMonthlyRevenue) * 10000) / 100 
    : 0;

  const breakEvenDaysPerMonth = plannedMonthlyVolume > 0 && breakEvenUnits > 0
    ? Math.min(30, Math.round((breakEvenUnits / (plannedMonthlyVolume / 30)) * 10) / 10)
    : 30;

  const marginOfSafetyUnits = plannedMonthlyVolume - breakEvenUnits;
  const marginOfSafetyPercent = plannedMonthlyVolume > 0 
    ? Math.round((marginOfSafetyUnits / plannedMonthlyVolume) * 10000) / 100 
    : 0;

  let marginOfSafetyStatus: 'critico' | 'ajustado' | 'saludable' | 'excelente' = 'critico';
  if (marginOfSafetyPercent >= 40) marginOfSafetyStatus = 'excelente';
  else if (marginOfSafetyPercent >= 20) marginOfSafetyStatus = 'saludable';
  else if (marginOfSafetyPercent >= 5) marginOfSafetyStatus = 'ajustado';
  else marginOfSafetyStatus = 'critico';

  return {
    totalMonthlyFixedCosts,
    fixedCostsItems,
    breakEvenUnits,
    breakEvenRevenue,
    breakEvenDaysPerMonth,
    plannedMonthlyVolume,
    plannedMonthlyRevenue,
    plannedMonthlyVariableCosts,
    plannedMonthlyGrossProfit,
    plannedMonthlyEbitda,
    netMarginPercent,
    marginOfSafetyUnits,
    marginOfSafetyPercent,
    marginOfSafetyStatus
  };
}

export function generateSensitivityScenarios(
  product: ProductCostModel,
  breakEven: FinancialBreakEvenResult
): FinancialSensitivityScenario[] {
  const baseCost = product.totalVariableCostPerUnit;
  const basePrice = product.calculatedNetSalePrice;
  const baseVolume = product.expectedMonthlyVolume;
  const fixedCosts = breakEven.totalMonthlyFixedCosts;

  const createScenario = (
    id: string,
    name: string,
    description: string,
    costChg: number,
    priceChg: number,
    volChg: number
  ): FinancialSensitivityScenario => {
    const resultingUnitCost = Math.round(baseCost * (1 + costChg / 100) * 100) / 100;
    const resultingNetPrice = Math.round(basePrice * (1 + priceChg / 100) * 100) / 100;
    const resultingVolume = Math.round(baseVolume * (1 + volChg / 100));
    const resultingContributionMargin = Math.round((resultingNetPrice - resultingUnitCost) * 100) / 100;
    
    let resultingBreakEvenUnits = 0;
    if (resultingContributionMargin > 0) {
      resultingBreakEvenUnits = Math.ceil(fixedCosts / resultingContributionMargin);
    }
    
    const resultingMonthlyRevenue = Math.round(resultingVolume * resultingNetPrice);
    const resultingMonthlyVariable = Math.round(resultingVolume * resultingUnitCost);
    const resultingMonthlyEbitda = resultingMonthlyRevenue - resultingMonthlyVariable - fixedCosts;

    let status: 'ganancia' | 'equilibrio' | 'perdida' = 'ganancia';
    if (resultingMonthlyEbitda < 0) status = 'perdida';
    else if (resultingMonthlyEbitda === 0 || Math.abs(resultingMonthlyEbitda) < fixedCosts * 0.05) status = 'equilibrio';

    return {
      id,
      name,
      description,
      costChangePercent: costChg,
      priceChangePercent: priceChg,
      volumeChangePercent: volChg,
      resultingUnitCost,
      resultingNetPrice,
      resultingContributionMargin,
      resultingBreakEvenUnits,
      resultingMonthlyRevenue,
      resultingMonthlyEbitda,
      status
    };
  };

  return [
    createScenario(
      'base',
      'Escenario Base (Plan Actual)',
      'Condiciones proyectadas según la formulación estándar.',
      0, 0, 0
    ),
    createScenario(
      'pesimista_costos',
      'Estrés de Insumos (+12% Costos)',
      'Alza imprevista en materias primas o fletes sin capacidad de transferir al precio.',
      12, 0, -5
    ),
    createScenario(
      'guerra_precios',
      'Presión Competitiva (-10% Precio)',
      'Descuento obligado por competencia agresiva manteniendo costos constantes.',
      0, -10, 5
    ),
    createScenario(
      'optimista_escala',
      'Economías de Escala (+20% Ventas, -5% Costo)',
      'Crecimiento acelerado con poder de negociación de compras por volumen.',
      -5, 0, 20
    ),
    createScenario(
      'recesion',
      'Escenario Crítico (-20% Ventas, +8% Costos)',
      'Contracción de demanda con inflación simultánea en insumos.',
      8, -3, -20
    )
  ];
}

// ==========================================
// PORTAFOLIO MULTIPRODUCTO
// ==========================================

export function calculateMultiProductBreakEven(
  products: ProductCostModel[],
  totalFixedCosts: number
): MultiProductBreakEvenResult {
  if (products.length === 0) {
    return {
      products: [],
      weightedContributionMarginRatio: 0,
      totalBreakEvenRevenue: 0,
      totalPlannedRevenue: 0,
      totalFixedCosts
    };
  }

  // Normalizar los porcentajes de participación (Mix)
  const totalMix = products.reduce((acc, p) => acc + (p.salesMixPercent || 100 / products.length), 0);
  
  let weightedRmc = 0;
  let totalPlannedRev = 0;

  const intermediate = products.map((p) => {
    const rawMix = p.salesMixPercent || 100 / products.length;
    const sharePercent = totalMix > 0 ? (rawMix / totalMix) * 100 : 100 / products.length;
    const rmc = p.contributionMarginRatio / 100;
    weightedRmc += (sharePercent / 100) * rmc;
    const plannedRev = p.expectedMonthlyVolume * p.calculatedNetSalePrice;
    totalPlannedRev += plannedRev;

    return {
      id: p.id,
      productName: p.productName,
      salesMixPercent: Math.round(sharePercent * 10) / 10,
      unitPrice: p.calculatedNetSalePrice,
      unitCost: p.totalVariableCostPerUnit,
      contributionMargin: p.contributionMarginUnit,
      contributionMarginRatio: p.contributionMarginRatio
    };
  });

  const totalBreakEvenRevenue = weightedRmc > 0 ? Math.round(totalFixedCosts / weightedRmc) : 0;

  const resultProducts = intermediate.map((p) => {
    const allocatedRevenue = Math.round(totalBreakEvenRevenue * (p.salesMixPercent / 100));
    const allocatedUnits = p.unitPrice > 0 ? Math.ceil(allocatedRevenue / p.unitPrice) : 0;
    return {
      ...p,
      allocatedBreakEvenUnits: allocatedUnits,
      allocatedBreakEvenRevenue: allocatedRevenue
    };
  });

  return {
    products: resultProducts,
    weightedContributionMarginRatio: Math.round(weightedRmc * 10000) / 100,
    totalBreakEvenRevenue,
    totalPlannedRevenue: Math.round(totalPlannedRev),
    totalFixedCosts
  };
}

// ==========================================
// PRESETS POR SECTOR ECONÓMICO (BENCHMARKS REALISTAS)
// ==========================================

export function getSectorCostingDefaults(sector: IndustrySector): {
  productName: string;
  sku: string;
  expectedMonthlyVolume: number;
  variableItems: CostItem[];
  laborConfig: {
    hoursPerUnit: number;
    hourlyRate: number;
    benefitsFactor: number;
  };
  fixedCostsItems: FixedCostItem[];
  pricingMethod: PricingMethod;
  desiredMarginPercent: number;
  desiredMarkupPercent: number;
  taxType: TaxType;
} {
  switch (sector) {
    case 'tech':
      return {
        productName: 'Suscripción SaaS / Licencia Cloud Pro',
        sku: 'TECH-SAAS-01',
        expectedMonthlyVolume: 150,
        variableItems: [
          { id: 'v1', name: 'Infraestructura AWS/Azure (Cómputo & Base de Datos)', category: 'cif_variable', unit: 'Instancia/mes', unitCost: 18000, quantityPerProduct: 1, subtotal: 18000 },
          { id: 'v2', name: 'Comisión Pasarela de Pagos (2.9% + $900)', category: 'cif_variable', unit: 'Transacción', unitCost: 5500, quantityPerProduct: 1, subtotal: 5500 },
          { id: 'v3', name: 'Tokens API IA & Notificaciones SMS/Email', category: 'materia_prima', unit: 'Consumo mensual', unitCost: 4500, quantityPerProduct: 1, subtotal: 4500 }
        ],
        laborConfig: {
          hoursPerUnit: 0.5, // 30 min soporte técnico nivel 1 y onboarding
          hourlyRate: 18000,
          benefitsFactor: 1.52 // Factor prestacional de ley en Colombia
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Nómina Desarrolladores & DevOps Core', monthlyAmount: 8500000, category: 'nomina_admin' },
          { id: 'f2', name: 'Suscripciones Herramientas (GitHub, Slack, Jira)', monthlyAmount: 950000, category: 'software' },
          { id: 'f3', name: 'Pauta Publicitaria Digital (Google Ads / LinkedIn)', monthlyAmount: 1800000, category: 'marketing' },
          { id: 'f4', name: 'Arriendo Oficina / Coworking & Conectividad', monthlyAmount: 1200000, category: 'arriendo' }
        ],
        pricingMethod: 'margin_on_sales',
        desiredMarginPercent: 72, // SaaS opera con márgenes brutos altos (70-85%)
        desiredMarkupPercent: 257,
        taxType: 'iva_19'
      };

    case 'retail':
      return {
        productName: 'Prenda Vestuario / Calzado de Moda Sostenible',
        sku: 'RET-MODA-01',
        expectedMonthlyVolume: 350,
        variableItems: [
          { id: 'v1', name: 'Costo Adquisición / Maquila Prenda', category: 'materia_prima', unit: 'Unidad', unitCost: 42000, quantityPerProduct: 1, subtotal: 42000 },
          { id: 'v2', name: 'Empaque de Lujo Biodegradable & Etiquetas', category: 'empaque_logistica', unit: 'Set', unitCost: 3500, quantityPerProduct: 1, subtotal: 3500 },
          { id: 'v3', name: 'Flete de Distribución / Despacho Urbano', category: 'empaque_logistica', unit: 'Envío', unitCost: 8500, quantityPerProduct: 1, subtotal: 8500 }
        ],
        laborConfig: {
          hoursPerUnit: 0.25, // Control de calidad e inventario
          hourlyRate: 11000,
          benefitsFactor: 1.52
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Canon de Arrendamiento Local / Bodega', monthlyAmount: 3200000, category: 'arriendo' },
          { id: 'f2', name: 'Nómina Asesores Comerciales y Administrador', monthlyAmount: 4200000, category: 'nomina_admin' },
          { id: 'f3', name: 'Servicios Públicos y Conectividad', monthlyAmount: 650000, category: 'servicios' },
          { id: 'f4', name: 'Pauta en Redes y Mantenimiento E-commerce', monthlyAmount: 1100000, category: 'marketing' }
        ],
        pricingMethod: 'markup_on_cost',
        desiredMarginPercent: 44.4,
        desiredMarkupPercent: 80, // Retail aplica markup sobre costo entre 60% y 100%
        taxType: 'iva_19'
      };

    case 'manufacturing':
      return {
        productName: 'Lote Producto Procesado / Snack Gourmet (Pack 10 Unidades)',
        sku: 'MAN-SNACK-01',
        expectedMonthlyVolume: 800,
        variableItems: [
          { id: 'v1', name: 'Materia Prima Directa (Insumos Agrícolas / Ingredientes)', category: 'materia_prima', unit: 'Kg', unitCost: 14000, quantityPerProduct: 1, subtotal: 14000 },
          { id: 'v2', name: 'Empaque Primario Bilaminado con Válvula', category: 'empaque_logistica', unit: 'Bolsa', unitCost: 2200, quantityPerProduct: 1, subtotal: 2200 },
          { id: 'v3', name: 'Gas y Energía Directa de Línea de Producción', category: 'cif_variable', unit: 'Consumo kWh/BTU', unitCost: 1800, quantityPerProduct: 1, subtotal: 1800 }
        ],
        laborConfig: {
          hoursPerUnit: 0.4, // Operario de planta directo
          hourlyRate: 9500,
          benefitsFactor: 1.52
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Arriendo Planta de Producción y Bodega', monthlyAmount: 3800000, category: 'arriendo' },
          { id: 'f2', name: 'Nómina Supervisor de Planta y Control de Calidad', monthlyAmount: 3600000, category: 'nomina_admin' },
          { id: 'f3', name: 'Mantenimiento Preventivo y Calibración de Maquinaria', monthlyAmount: 900000, category: 'depreciacion' },
          { id: 'f4', name: 'Servicios Industriales Fijos y Registro Sanitario Invima', monthlyAmount: 1300000, category: 'servicios' }
        ],
        pricingMethod: 'margin_on_sales',
        desiredMarginPercent: 42,
        desiredMarkupPercent: 72.4,
        taxType: 'iva_5' // Algunos alimentos procesados tienen IVA preferencial o exento
      };

    case 'tourism':
      return {
        productName: 'Menú Degustación Gastronómico de Autor',
        sku: 'GAST-PLATO-01',
        expectedMonthlyVolume: 600,
        variableItems: [
          { id: 'v1', name: 'Costo Alimentos & Proteínas (Food Cost Directo)', category: 'materia_prima', unit: 'Receta estándar', unitCost: 22000, quantityPerProduct: 1, subtotal: 22000 },
          { id: 'v2', name: 'Guarniciones, Salsas y Ensalada de Temporada', category: 'materia_prima', unit: 'Porción', unitCost: 6500, quantityPerProduct: 1, subtotal: 6500 },
          { id: 'v3', name: 'Bebida Artesanal & Maridaje Acompañante', category: 'materia_prima', unit: 'Copa / Botella', unitCost: 5500, quantityPerProduct: 1, subtotal: 5500 }
        ],
        laborConfig: {
          hoursPerUnit: 0.35, // Tiempo chef de partida y ayudante
          hourlyRate: 10500,
          benefitsFactor: 1.52
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Arriendo Restaurante en Zona Comercial', monthlyAmount: 5500000, category: 'arriendo' },
          { id: 'f2', name: 'Nómina Cocina, Meseros y Caja', monthlyAmount: 6800000, category: 'nomina_admin' },
          { id: 'f3', name: 'Gas Natural, Energía y Acueducto Comercial', monthlyAmount: 2100000, category: 'servicios' },
          { id: 'f4', name: 'Música, Licencias Sayco/Acinpro y Marketing Local', monthlyAmount: 850000, category: 'marketing' }
        ],
        pricingMethod: 'margin_on_sales',
        desiredMarginPercent: 68, // Restaurantes manejan 65-72% margen sobre food cost
        desiredMarkupPercent: 212.5,
        taxType: 'inc_8' // Impuesto Nacional al Consumo en restaurantes
      };

    case 'agro':
      return {
        productName: 'Carga de Café Especial Microlote Tostado y Molido (Kg)',
        sku: 'AGRO-CAFE-01',
        expectedMonthlyVolume: 400,
        variableItems: [
          { id: 'v1', name: 'Café Pergamino Seco Seleccionado en Finca', category: 'materia_prima', unit: 'Kg', unitCost: 18000, quantityPerProduct: 1.25, subtotal: 22500 },
          { id: 'v2', name: 'Servicio de Trilla, Tueste y Molienda de Precisión', category: 'cif_variable', unit: 'Kg procesado', unitCost: 6000, quantityPerProduct: 1, subtotal: 6000 },
          { id: 'v3', name: 'Bolsa Hermética con Válvula Desgasificadora', category: 'empaque_logistica', unit: 'Bolsa', unitCost: 3200, quantityPerProduct: 1, subtotal: 3200 }
        ],
        laborConfig: {
          hoursPerUnit: 0.3,
          hourlyRate: 9000,
          benefitsFactor: 1.52
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Arriendo / Mantenimiento Finca e Instalaciones de Beneficio', monthlyAmount: 2500000, category: 'arriendo' },
          { id: 'f2', name: 'Administrador de Finca y Certificaciones de Origen', monthlyAmount: 3200000, category: 'nomina_admin' },
          { id: 'f3', name: 'Combustible y Mantenimiento de Despulpadora/Secadora', monthlyAmount: 800000, category: 'depreciacion' },
          { id: 'f4', name: 'Análisis de Laboratorio y Curva de Catación', monthlyAmount: 600000, category: 'servicios' }
        ],
        pricingMethod: 'margin_on_sales',
        desiredMarginPercent: 38,
        desiredMarkupPercent: 61.3,
        taxType: 'none' // Café en grano/verde o producción primaria exenta de IVA
      };

    case 'services':
    default:
      return {
        productName: 'Paquete de Consultoría Estratégica / Auditoría Integral',
        sku: 'SERV-CONS-01',
        expectedMonthlyVolume: 25,
        variableItems: [
          { id: 'v1', name: 'Material Técnico, Dossier y Entregables Formales', category: 'empaque_logistica', unit: 'Kit', unitCost: 45000, quantityPerProduct: 1, subtotal: 45000 },
          { id: 'v2', name: 'Viáticos y Desplazamientos Directos de Auditoría', category: 'cif_variable', unit: 'Servicio', unitCost: 80000, quantityPerProduct: 1, subtotal: 80000 }
        ],
        laborConfig: {
          hoursPerUnit: 12, // 12 horas profesionales de especialista
          hourlyRate: 45000,
          benefitsFactor: 1.52
        },
        fixedCostsItems: [
          { id: 'f1', name: 'Sede de Consultoría y Salas de Juntas', monthlyAmount: 2800000, category: 'arriendo' },
          { id: 'f2', name: 'Nómina Asistencial y Contador de Planta', monthlyAmount: 3500000, category: 'nomina_admin' },
          { id: 'f3', name: 'Licencias de Software Especializado y Bases Jurídicas', monthlyAmount: 1400000, category: 'software' },
          { id: 'f4', name: 'Seguro de Responsabilidad Civil Profesional', monthlyAmount: 900000, category: 'otros' }
        ],
        pricingMethod: 'margin_on_sales',
        desiredMarginPercent: 48,
        desiredMarkupPercent: 92.3,
        taxType: 'iva_19'
      };
  }
}

import type { WorkBook, WorkSheet } from 'xlsx';

// ==========================================
// PARSEADOR Y AUDITOR FINANCIERO DE EXCEL (.XLSX)
// ==========================================

export function parseAndAuditExcelFinancials(workbook: WorkBook): ExcelFinancialAuditResult {
  const sheetsAnalyzed: string[] = workbook.SheetNames || [];
  const extractedProducts: ExcelFinancialAuditResult['extractedProducts'] = [];
  const mathIntegrityIssues: ExcelFinancialAuditResult['mathIntegrityIssues'] = [];
  
  let detectedFixedCosts = 0;
  let totalMarginAccumulator = 0;
  let marginCount = 0;

  for (const sheetName of sheetsAnalyzed) {
    const upperSheet = sheetName.toUpperCase();
    const ws = workbook.Sheets[sheetName] as WorkSheet | undefined;
    if (!ws) continue;

    // Convertir la hoja a matriz de filas (array of arrays)
    let rows: any[][] = [];
    try {
      // Usamos el parser de celdas
      const range = ws['!ref'];
      if (!range) continue;
      
      // Buscar celdas directamente
      for (const cellAddress in ws) {
        if (cellAddress.startsWith('!')) continue;
        const cell = ws[cellAddress];
        const val = cell.v;
        if (typeof val === 'string' && (val.includes('#REF!') || val.includes('#DIV/0!') || val.includes('#VALUE!'))) {
          mathIntegrityIssues.push({
            severity: 'error',
            title: `Error de fórmula (${val}) en celda ${cellAddress}`,
            message: `Se detectó una ruptura de fórmula en la hoja "${sheetName}". Revise las referencias circulares o celdas borradas.`,
            sheet: sheetName
          });
        }
      }
    } catch {
      // Ignorar errores de lectura menores
    }

    // Análisis semántico de la hoja
    const isCostSheet = upperSheet.includes('COSTO') || upperSheet.includes('PRECIO') || upperSheet.includes('PRODUCTO');
    const isFixedCostSheet = upperSheet.includes('GASTO') || upperSheet.includes('FIJO') || upperSheet.includes('NOMINA') || upperSheet.includes('ADMIN');
    const isBreakEvenSheet = upperSheet.includes('PUNTO') || upperSheet.includes('EQUILIBRIO');

    if (isCostSheet) {
      // Escanear posibles tablas de productos
      try {
        // Obtenemos los valores de texto y números de la hoja
        const keys = Object.keys(ws).filter(k => !k.startsWith('!'));
        let foundCostVal = 0;
        let foundPriceVal = 0;
        let foundProductName = '';

        for (const k of keys) {
          const v = ws[k]?.v;
          if (typeof v === 'string') {
            const up = v.toUpperCase();
            if (up.includes('PRODUCTO') || up.includes('ITEM') || up.includes('DESCRIPCI')) {
              // Cabecera detectada
            } else if (v.length > 3 && v.length < 50 && !foundProductName) {
              foundProductName = v;
            }
          } else if (typeof v === 'number' && v > 500) {
            if (!foundCostVal) {
              foundCostVal = v;
            } else if (!foundPriceVal && v > foundCostVal) {
              foundPriceVal = v;
            }
          }
        }

        if (foundProductName && foundCostVal > 0 && foundPriceVal > 0) {
          const margin = Math.round(((foundPriceVal - foundCostVal) / foundPriceVal) * 1000) / 10;
          extractedProducts.push({
            product: foundProductName,
            unitCost: foundCostVal,
            salePrice: foundPriceVal,
            grossMarginPercent: margin,
            sourceSheet: sheetName
          });
          totalMarginAccumulator += margin;
          marginCount++;

          if (foundPriceVal <= foundCostVal) {
            mathIntegrityIssues.push({
              severity: 'error',
              title: `Precio de venta menor al costo en "${foundProductName}"`,
              message: `El precio ($${foundPriceVal.toLocaleString()}) no cubre el costo unitario ($${foundCostVal.toLocaleString()}), generando margen negativo en la hoja ${sheetName}.`,
              sheet: sheetName
            });
          } else if (margin < 10) {
            mathIntegrityIssues.push({
              severity: 'warning',
              title: `Margen bruto extremadamente ajustado (${margin}%)`,
              message: `El producto "${foundProductName}" tiene un margen inferior al 10%, lo que deja la operación vulnerable a fluctuaciones de costos.`,
              sheet: sheetName
            });
          }
        }
      } catch {
        // Fallback seguro
      }
    }

    if (isFixedCostSheet) {
      // Sumar celdas numéricas significativas que podrían ser gastos
      for (const k in ws) {
        if (k.startsWith('!')) continue;
        const val = ws[k]?.v;
        if (typeof val === 'number' && val > 100000 && val < 50000000) {
          detectedFixedCosts += val;
          break; // Tomar muestra de la fila de total si existe
        }
      }
    }
  }

  // Comprobar si hay hojas obligatorias ausentes
  const hasCostos = sheetsAnalyzed.some(s => s.toUpperCase().includes('COSTO'));
  const hasPrecios = sheetsAnalyzed.some(s => s.toUpperCase().includes('PRECIO') || s.toUpperCase().includes('VENTA'));
  const hasPuntoEq = sheetsAnalyzed.some(s => s.toUpperCase().includes('PUNTO') || s.toUpperCase().includes('EQUILIBRIO'));

  if (!hasCostos) {
    mathIntegrityIssues.push({
      severity: 'warning',
      title: 'No se identificó una hoja explícita de "COSTOS"',
      message: 'Se recomienda nombrar claramente una pestaña como "Costos Unitarios" o "Costo de Producción" para facilitar la trazabilidad presupuestal.'
    });
  }

  if (!hasPuntoEq) {
    mathIntegrityIssues.push({
      severity: 'info',
      title: 'Ausencia de hoja analítica de "PUNTO DE EQUILIBRIO"',
      message: 'El modelo presupuestal se fortalecería notablemente si incluye una pestaña dedicada al cálculo de unidades mínimas de equilibrio.'
    });
  }

  const averagePortfolioMargin = marginCount > 0 
    ? Math.round((totalMarginAccumulator / marginCount) * 10) / 10 
    : undefined;

  let summaryStatus: ExcelFinancialAuditResult['summaryStatus'] = 'optimo';
  if (mathIntegrityIssues.some(i => i.severity === 'error')) {
    summaryStatus = 'incompleto';
  } else if (mathIntegrityIssues.length > 0) {
    summaryStatus = 'con_observaciones';
  }

  return {
    sheetsAnalyzed,
    detectedProductsCount: extractedProducts.length,
    extractedProducts,
    mathIntegrityIssues,
    detectedFixedCosts: detectedFixedCosts > 0 ? detectedFixedCosts : undefined,
    averagePortfolioMargin,
    summaryStatus
  };
}
