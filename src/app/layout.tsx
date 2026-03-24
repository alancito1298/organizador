import type { Metadata } from "next";
import { Inter, Roboto_Mono, Bebas_Neue, Atma, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // opcional
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const atma = Atma({
  weight: "700", 
  subsets: ["latin"],
  variable: "--font-atma",
});


const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono", // opcional
});

export const metadata: Metadata = {
  title: "Organizador",
  description: "App de organización",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head><link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#6d28d9" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Organizador" /></head>
      <body className={`${inter.className} ${mono.variable} min-h-screen  bg-amber-950` }>
        {children}
      </body>
    </html>
  );
}