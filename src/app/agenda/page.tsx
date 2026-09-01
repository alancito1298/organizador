import type { Metadata } from "next";
import Navbar from "../components/shared/Navbar";
import BottomNav from "../components/shared/BottomNav";
import Agenda from "../components/agenda/Agenda";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Agenda y Calendario",
  description: "Organizá tus eventos, entregas y fechas importantes de tus clases en la agenda docente.",
  alternates: { canonical: "/agenda" },
  robots: { index: false, follow: true },
};

export default function AgendaPage() {
  return (
    <div>
      <Navbar />
      <Agenda />
      <Footer />
      <BottomNav />
    </div>
  );
}