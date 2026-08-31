import type { Metadata } from "next";
import Menu from "../components/shared/Menu";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Panel Principal",
  description: "Accedé a tu panel docente con accesos rápidos a cursos, agenda, planificaciones y horarios.",
  alternates: { canonical: "/home" },
  robots: { index: false, follow: true },
};

export default function Home() {
  return (
    <div className="bg-surface-bg flex flex-col min-h-screen">
      <Navbar />
      <Menu />
      <Footer />
    </div>
  );
}