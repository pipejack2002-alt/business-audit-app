import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { runComprehensiveDocumentAudit, DocumentAnalysisInput } from '@/lib/documentAuditEngine';

async function getLocalTributoReport() {
  const repoBasePath = path.join(process.cwd(), 'data', 'sample-docs');
  const localBasePath = 'C:\\Apps\\tributoappsas-next';

  const findFile = (fileName: string) => {
    const p1 = path.join(repoBasePath, fileName);
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(localBasePath, fileName);
    if (fs.existsSync(p2)) return p2;
    return null;
  };

  const docxPath = findFile('Plan modelo de negocio 2025 - DILIGENCIADO.docx');
  const ideaPath = findFile('Plantilla de identificacion de ideas de negocios - DILIGENCIADA.docx');
  const xlsxPath = findFile('TributoApp PlanNegocio2026 Proyeccion 12 meses.xlsx');

  const analysisInput: Required<DocumentAnalysisInput> = {
    extractedTexts: [],
    excelSheets: []
  };

  if (docxPath && fs.existsSync(docxPath)) {
    const docxBuf = fs.readFileSync(docxPath);
    const docxRes = await mammoth.extractRawText({ buffer: docxBuf });
    analysisInput.extractedTexts.push({
      fileName: 'Plan modelo de negocio 2025 - DILIGENCIADO.docx',
      text: docxRes.value
    });
  }

  if (ideaPath && fs.existsSync(ideaPath)) {
    const ideaBuf = fs.readFileSync(ideaPath);
    const ideaRes = await mammoth.extractRawText({ buffer: ideaBuf });
    analysisInput.extractedTexts.push({
      fileName: 'Plantilla de identificacion de ideas de negocios - DILIGENCIADA.docx',
      text: ideaRes.value
    });
  }

  if (xlsxPath && fs.existsSync(xlsxPath)) {
    const xlsxBuf = fs.readFileSync(xlsxPath);
    const wb = XLSX.read(xlsxBuf, { type: 'buffer' });
    analysisInput.excelSheets.push({
      fileName: 'TributoApp PlanNegocio2026 Proyeccion 12 meses.xlsx',
      sheetNames: wb.SheetNames
    });
  }

  return runComprehensiveDocumentAudit(analysisInput);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get('loadLocalTributo') === 'true') {
      const report = await getLocalTributoReport();
      return NextResponse.json({ success: true, report });
    }
    return NextResponse.json({ message: 'API de Auditoría de Documentos activa' });
  } catch (error: any) {
    console.error('Error en GET /api/analyze-documents:', error);
    return NextResponse.json({ error: error?.message || 'Error en auditoría' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Modo 1: Carga directa de los archivos del proyecto local TributoApp
    if (contentType.includes('application/json')) {
      let body: any = {};
      try {
        body = await req.json();
      } catch (e) {
        body = {};
      }
      if (body.loadLocalTributo) {
        const report = await getLocalTributoReport();
        return NextResponse.json({ success: true, report });
      }
    }

    // Modo 2: Carga mediante Drag & Drop (FormData multipart)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files = formData.getAll('files') as File[];

      if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No se recibieron archivos para analizar.' }, { status: 400 });
      }

      const analysisInput: Required<DocumentAnalysisInput> = {
        extractedTexts: [],
        excelSheets: []
      };

      for (const file of files) {
        const fileName = file.name;
        const arrayBuf = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        if (fileName.endsWith('.docx')) {
          try {
            const mammothRes = await mammoth.extractRawText({ buffer });
            analysisInput.extractedTexts.push({
              fileName,
              text: mammothRes.value
            });
          } catch (e: any) {
            console.error(`Error procesando docx ${fileName}:`, e);
          }
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
          try {
            const wb = XLSX.read(buffer, { type: 'buffer' });
            analysisInput.excelSheets.push({
              fileName,
              sheetNames: wb.SheetNames
            });
          } catch (e: any) {
            console.error(`Error procesando excel ${fileName}:`, e);
          }
        } else {
          // Archivo de texto plano o fallback
          const text = buffer.toString('utf-8');
          analysisInput.extractedTexts.push({
            fileName,
            text
          });
        }
      }

      const report = runComprehensiveDocumentAudit(analysisInput);
      return NextResponse.json({ success: true, report });
    }

    return NextResponse.json({ error: 'Tipo de contenido no soportado' }, { status: 400 });
  } catch (error: any) {
    console.error('Error en POST /api/analyze-documents:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al procesar los documentos' },
      { status: 500 }
    );
  }
}
