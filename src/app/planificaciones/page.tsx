import type { Metadata } from "next";
import ListaPlanificaciones from "../components/planificaciones/ListaPlanificacion";
import BottomNav from "../components/shared/BottomNav";

export const metadata: Metadata = {
  title: "Planificaciones y Recursos",
  description: "Gestión de planificaciones anuales, unidades didácticas, bibliografía y documentos para tus cursos.",
  alternates: { canonical: "/planificaciones" },
  robots: { index: false, follow: true },
};

export default function PlanificacionesPage() {
  return (
    <>
      <ListaPlanificaciones />
      <BottomNav />
    </>
  );
}