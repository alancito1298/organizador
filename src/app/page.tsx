import type { Metadata } from "next";
import Inicio from "./components/landing/Inicio";

export const metadata: Metadata = {
  title: "Planificaciones, agenda y gestión de cursos para docentes",
  description:
    "Organizá tu agenda docente, tus planificaciones de clase, cursos, asistencia y calificaciones en un solo lugar. Exportá todo a Excel con un click. Empezá gratis.",
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Organizador Docente",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "App para docentes: agenda y planificaciones de clase, gestión de cursos, asistencia y calificaciones en un solo lugar.",
  url: "https://www.organizadordocente.com",
  offers: {
    "@type": "Offer",
    price: "3999",
    priceCurrency: "ARS",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Inicio />
    </>
  );
}
