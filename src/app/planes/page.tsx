import type { Metadata } from "next";
import PlanesClient from "./PlanesClient";

export const metadata: Metadata = {
  title: "Planes y precios",
  description:
    "Elegí el plan de Organizador Docente que mejor se adapte a vos: gestión de cursos, asistencia, calificaciones, agenda, horarios y planificaciones. 30 días gratis.",
  alternates: { canonical: "/planes" },
};

export default function PlanesPage() {
  return <PlanesClient />;
}
