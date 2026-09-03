import type { Metadata } from "next";
import Header from "../components/shared/Header";
import FormRegistro from "../components/auth/FormRegistro";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Creá tu cuenta gratis | Organizador Docente",
  description:
    "Registrate gratis en Organizador Docente y empezá a organizar tu agenda, planificaciones, cursos, asistencia y calificaciones.",
  alternates: { canonical: "/registro" },
};

export default function Registro() {
  return (
    <div className="min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased selection:bg-accent-violet/20">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-28 sm:py-36">
        <FormRegistro />
      </main>
      <Footer />
    </div>
  );
}