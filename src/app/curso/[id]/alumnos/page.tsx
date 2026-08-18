import type { Metadata } from "next";
import AlumnosClient from "@/app/sub-menu-curso/[id]/alumnos/AlumnosClient";

export const metadata: Metadata = {
  title: "Listado de Alumnos",
  description: "Administración de estudiantes, asistencia y conceptos pedagógicos del curso.",
  robots: { index: false, follow: true },
};

export default function AlumnosPage() {
  return <AlumnosClient />;
}
