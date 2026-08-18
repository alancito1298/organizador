import type { Metadata } from "next";
import AlumnosClient from "./AlumnosClient";

export type { Alumno } from "./AlumnosClient";

export const metadata: Metadata = {
  title: "Listado de Alumnos",
  description: "Administración, datos de contacto y perfil individual de los estudiantes del curso.",
  robots: { index: false, follow: true },
};

export default function AlumnosPage() {
  return <AlumnosClient />;
}