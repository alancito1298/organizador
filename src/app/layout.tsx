import type { Metadata } from "next";
import { Suspense } from "react";
import { Mulish, Arima } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "./components/shared/GoogleAnalytics";
import ChatbotIA from "./components/shared/ChatbotIA";
import OfflineIndicator from "./components/shared/OfflineIndicator";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-mulish",
  display: "swap",
});

const arima = Arima({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arima",
  display: "swap",
});

const SITE_URL = "https://www.organizadordocente.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Organizador Docente | Planificaciones, agenda y gestión de cursos",
    template: "%s | Organizador Docente",
  },
  description:
    "App para docentes: organizá tu agenda y planificaciones de clase, cursos, asistencia y calificaciones en un solo lugar. Exportá todo a Excel con un click.",
  keywords: [
    "organizador docente",
    "planificaciones docentes",
    "agenda docente",
    "agenda de clases",
    "gestión de cursos",
    "asistencia escolar",
    "calificaciones online",
    "app para docentes",
  ],
  authors: [{ name: "Organizador Docente" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Organizador Docente",
    title: "Organizador Docente | Planificaciones, agenda y gestión de cursos",
    description:
      "Organizá tu agenda y planificaciones de clase, cursos, asistencia y calificaciones en un solo lugar. Diseñado por docentes.",
    images: [
      {
        url: "/agenda-img.jpeg",
        width: 1200,
        height: 630,
        alt: "Agenda y planificaciones docentes en Organizador Docente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organizador Docente | Planificaciones, agenda y gestión de cursos",
    description:
      "Organizá tu agenda y planificaciones de clase, cursos, asistencia y calificaciones en un solo lugar.",
    images: ["/agenda-img.jpeg"],
  },
  // TODO: pegar acá el meta tag de verificación que te da Google Search Console
  // una vez que des de alta https://www.organizadordocente.com en search.google.com/search-console
  // verification: { google: "TU_CODIGO_DE_VERIFICACION" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@400;500;700;800;900&family=Arima:wght@400;500;600;700;800&family=Mulish:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#6d28d9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Organizador" />
        {ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${mulish.className} ${mulish.variable} ${arima.variable} font-mulish min-h-screen`}>
        <Script src="https://accounts.google.com/gsi/client?hl=es" strategy="afterInteractive" />
        <Script id="sw-dev-cleanup" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (var r of registrations) {
                  r.unregister();
                }
              });
              if ('caches' in window) {
                caches.keys().then(function(keys) {
                  keys.forEach(function(k) { caches.delete(k); });
                });
              }
            }
          `}
        </Script>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
              `}
            </Script>
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
          </>
        )}
        {children}
        <Suspense fallback={null}>
          <ChatbotIA />
        </Suspense>
        <Suspense fallback={null}>
          <OfflineIndicator />
        </Suspense>
      </body>
    </html>
  );
}