import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://businessaudit.tributoapp.me"),
  title: "AuditPlan Pro | Auditoría Empresarial Integral & Diagnóstico de Negocios",
  description: "Plataforma inteligente de auditoría modular de planes de negocio, validación institucional de Misión y Visión (4 pilares), matriz DOFA cruzada y diagnóstico de 9 capítulos.",
  keywords: [
    "auditoría empresarial",
    "plan de negocios",
    "misión y visión",
    "matriz dofa",
    "tributoapp",
    "fondo emprender",
    "diagnóstico empresarial",
    "modelo financiero excel"
  ],
  authors: [{ name: "AuditPlan Pro Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "AuditPlan Pro | Auditoría Empresarial Integral",
    description: "Evaluación modular con scoring en tiempo real, detección automática de mercado y calibración de 9 capítulos institucionales.",
    url: "https://businessaudit.tributoapp.me",
    siteName: "AuditPlan Pro",
    images: [
      {
        url: "/images/audit-hero-analytics.jpg",
        width: 1200,
        height: 630,
        alt: "AuditPlan Pro Dashboard"
      }
    ],
    locale: "es_CO",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AuditPlan Pro | Auditoría Empresarial Integral",
    description: "Evaluación modular con scoring en tiempo real y detección automática de mercado.",
    images: ["/images/audit-hero-analytics.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#090d16" />
      </head>
      <body className="antialiased bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
