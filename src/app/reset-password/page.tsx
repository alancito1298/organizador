import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

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