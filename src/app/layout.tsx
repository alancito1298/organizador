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
      <body className={`${inter.className} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}