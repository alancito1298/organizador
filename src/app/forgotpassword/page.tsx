'use client';

import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await fetch(`${API}/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      setEnviado(true);
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">

        <h1 className="text-2xl font-bold text-violet-900 mb-2 text-center">
          Recuperar contraseña
        </h1>

        {!enviado ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-6">
              Ingresá tu email y te enviaremos un link para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-violet-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-violet-400"
              />

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition disabled:opacity-60"
              >
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-violet-900 font-semibold mb-2">Revisá tu email</p>
            <p className="text-sm text-gray-500 mb-6">
              Si el email está registrado, recibirás un link para restablecer tu contraseña en los próximos minutos.
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/login" className="text-violet-600 text-sm hover:underline">
            Volver al login
          </Link>
        </div>

      </div>
    </div>
  );
}