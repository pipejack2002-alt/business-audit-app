import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auditor Estratégico de Planes de Negocio | Validación Misión y Visión",
  description: "Plataforma de auditoría, scoring diagnóstico y optimización de declaraciones de Misión y Visión para Planes de Negocio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
