import type { Metadata } from "next";
import BottomNav from "../components/shared/BottomNav";
import Agenda from "../components/agenda/Agenda";

export const metadata: Metadata = {
  title: "Agenda y Calendario",
  description: "Organizá tus eventos, entregas y fechas importantes de tus clases en la agenda docente.",
  alternates: { canonical: "/agenda" },
  robots: { index: false, follow: true },
};

export default function AgendaPage() {
  return (
    <div>
      <Agenda />
      <BottomNav />
    </div>
  );
}