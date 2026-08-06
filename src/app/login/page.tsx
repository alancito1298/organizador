import type { Metadata } from "next";
import LoginForm from "../components/auth/FormInicio";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Iniciá sesión en Organizador Docente para acceder a tus cursos, agenda y planificaciones.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function Login() {
  return (
    
    <div className="block pb-10 flex-col bg-white items-center justify-items-center min-h-screen bg-brand-primary   ">
    <Header></Header>
    <LoginForm ></LoginForm>
    <Footer></Footer>
   
    </div>
  );
}
