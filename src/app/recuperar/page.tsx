import type { Metadata } from "next";
import ForgotPasswordClient from "../forgotpassword/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Recuperar Contraseña",
  description: "Recuperá el acceso a tu cuenta docente ingresando tu correo electrónico.",
  alternates: { canonical: "/recuperar" },
  robots: { index: true, follow: true },
};

export default function RecuperarPage() {
  return <ForgotPasswordClient />;
}
