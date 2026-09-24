import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { runComprehensiveDocumentAudit, DocumentAnalysisInput } from '@/lib/documentAuditEngine';

export async function GET() {
  return NextResponse.json({
    active: true,
    message: 'API de Auditoría de Documentos activa. Permite auditar archivos .docx y .xlsx subidos por el usuario.'
  });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Carga mediante Drag & Drop (FormData multipart)
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

    return NextResponse.json({ error: 'Tipo de contenido no soportado. Debe ser multipart/form-data' }, { status: 400 });
  } catch (error: any) {
    console.error('Error en POST /api/analyze-documents:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno al procesar los documentos' },
      { status: 500 }
    );
  }
}
