import type { Metadata } from "next";
import BottomNav from "../components/shared/BottomNav";
import Horario from "../components/horario/Horario";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";

export const metadata: Metadata = {
  title: "Horarios de Clase",
  description: "Consultá y organizá tu grilla semanal de horarios escolares por día y materia.",
  alternates: { canonical: "/horario" },
  robots: { index: false, follow: true },
};

export default function HorariosPage() {
  return (
    <div>
      <Navbar />
      <Horario />
      <BottomNav />
      <Footer />
    </div>
  );
}