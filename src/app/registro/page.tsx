import type { Metadata } from "next";
import Header from "../components/Header";
import FormRegistro from "../components/FormRegistro";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Creá tu cuenta gratis",
  description:
    "Registrate gratis en Organizador Docente y empezá a organizar tu agenda, planificaciones, cursos, asistencia y calificaciones.",
  alternates: { canonical: "/registro" },
};

export default function Registro() {
  return (
    <div>
      <Header></Header>
      <FormRegistro></FormRegistro>
      <Footer></Footer>
    </div>
  );
}