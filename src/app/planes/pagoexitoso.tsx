'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PagoExitoso() {
  const router  = useRouter();
  const [segundos, setSegundos] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.replace('/');
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-violet-900 mb-2">¡Pago exitoso!</h1>
        <p className="text-violet-600 mb-2">
          Tu suscripción fue activada correctamente.
        </p>
        <p className="text-sm text-violet-400 mb-6">
          En unos segundos tu cuenta quedará activa. Si no se activa de inmediato,
          esperá unos minutos ya que MercadoPago puede demorar en confirmar el pago.
        </p>
        <p className="text-violet-500 text-sm">
          Redirigiendo en <span className="font-bold text-violet-700">{segundos}</span> segundos...
        </p>
        <button
          onClick={() => router.replace('/')}
          className="mt-4 bg-violet-600 text-white px-6 py-2 rounded-xl hover:bg-violet-700 transition font-medium"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}