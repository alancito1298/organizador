import type { Metadata } from "next";
import ListaCursos from "@/app/components/cursos/Cursos";
import BottomNav from "../components/shared/BottomNav";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Mis Cursos",
  description: "Administrá todos tus cursos, escuelas, años y materias escolares en un solo lugar.",
  alternates: { canonical: "/menu-cursos" },
  robots: { index: false, follow: true },
};

export default function MenuCursos() {
  return (
    <>
      <ListaCursos />
      <Footer />
      <BottomNav />
    </>
  );
}