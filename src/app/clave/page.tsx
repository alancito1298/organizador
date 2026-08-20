import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "../reset-password/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  description: "Ingresá tu nueva clave de acceso para recuperar tu cuenta docente.",
  alternates: { canonical: "/clave" },
  robots: { index: false, follow: true },
};

export default function ClavePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

