import type { Metadata } from "next";
import ResetPasswordForm from "../reset-password/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  description: "Ingresá tu nueva clave de acceso para recuperar tu cuenta docente.",
  alternates: { canonical: "/clave" },
  robots: { index: false, follow: true },
};

export default function ClavePage() {
  return <ResetPasswordForm />;
}
