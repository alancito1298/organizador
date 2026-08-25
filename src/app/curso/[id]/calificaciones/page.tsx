import type { Metadata } from "next";
import BottomNav from "@/app/components/shared/BottomNav";
import ListaCalificaciones from "@/app/components/calificaciones/ListaCalficaciones";
import Footer from "@/app/components/shared/Footer";

export const metadata: Metadata = {
  title: "Calificaciones y Notas",
  description: "Registro, carga y seguimiento de notas de exámenes, trabajos prácticos y promedios por trimestre.",
  robots: { index: false, follow: true },
};

export default function CalificacionesPage() {
  return (
    <div className="bg-surface-container-low min-h-screen pb-24">
      <ListaCalificaciones />
      <Footer />
      <BottomNav />
    </div>
  );
}
