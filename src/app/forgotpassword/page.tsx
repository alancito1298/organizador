import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Recuperá el acceso a tu cuenta de Organizador Docente de forma rápida y segura.",
  alternates: { canonical: "/forgotpassword" },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}