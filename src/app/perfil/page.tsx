import type { Metadata } from "next";
import Navbar from "../components/shared/Navbar";
import BottomNav from "../components/shared/BottomNav";
import PerfilDocente from "../components/perfil/PerfilDocente";

export const metadata: Metadata = {
  title: "Mi Perfil",
  description: "Administrá tus datos personales, contraseña y preferencias de tu cuenta en Organizador Docente.",
  alternates: { canonical: "/perfil" },
  robots: { index: false, follow: true },
};

export default function PerfilPage() {
  return (
    <>
      <Navbar />
      <PerfilDocente />
      <BottomNav />
    </>
  );
}
