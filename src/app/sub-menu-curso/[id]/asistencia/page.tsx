import type { Metadata } from "next";
import Navbar from "@/app/components/shared/Navbar";
import BottomNav from "../../../components/shared/BottomNav";
import ListaAsistencias from "../../../components/asistencias/ListaAsistencias";
import Footer from "../../../components/shared/Footer";

export const metadata: Metadata = {
  title: "Control de Asistencia",
  description: "Toma de asistencia escolar y registro de conceptos por fecha y trimestre.",
  robots: { index: false, follow: true },
};

export default function AsistenciasPage() {
  return (
    <div className="bg-surface-container-low min-h-screen pb-24">
      <Navbar />
      <ListaAsistencias />
      <Footer />
      <BottomNav />
    </div>
  );
}