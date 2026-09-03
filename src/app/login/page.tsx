import type { Metadata } from "next";
import LoginForm from "../components/auth/FormInicio";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

export const metadata: Metadata = {
  title: "Iniciar sesión | Organizador Docente",
  description: "Iniciá sesión en Organizador Docente para acceder a tus cursos, agenda y planificaciones.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function Login() {
  return (
    <div className="min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased selection:bg-accent-violet/20">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-28 sm:py-36">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
