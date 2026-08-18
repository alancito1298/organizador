import type { Metadata } from "next";
import BottomNav from "../../../components/shared/BottomNav";
import ListaAsistencias from "../../../components/asistencias/ListaAsistencias";

export const metadata: Metadata = {
  title: "Control de Asistencia",
  description: "Toma de asistencia escolar y registro de conceptos por fecha y trimestre.",
  robots: { index: false, follow: true },
};

export default function AsistenciasPage() {
  return (
    <div className="bg-fuchsia-200 h-full">
      <ListaAsistencias />
      <BottomNav />
    </div>
  );
}