import type { Metadata } from "next";
import BottomNav from "../../../components/shared/BottomNav";
import ListaCalificaciones from "../../../components/calificaciones/ListaCalficaciones";

export const metadata: Metadata = {
  title: "Calificaciones y Notas",
  description: "Registro, carga y seguimiento de notas de exámenes, trabajos prácticos y promedios por trimestre.",
  robots: { index: false, follow: true },
};

export default function CalificacionesPage() {
  return (
    <div className="bg-fuchsia-200 h-full">
      <ListaCalificaciones />
      <BottomNav />
    </div>
  );
}