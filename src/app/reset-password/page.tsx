import type { Metadata } from "next";
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
  title: "Restablecer Contraseña",
  description: "Ingresá tu nueva contraseña para ingresar a Organizador Docente.",
  alternates: { canonical: "/reset-password" },
  robots: { index: false, follow: true },
};

export default function Page() {
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