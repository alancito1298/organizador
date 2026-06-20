'use client';

import { useState } from 'react';
import {
  useSearchParams,
  useRouter,
} from 'next/navigation';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

export default function ResetPasswordForm() {

  const params =
    useSearchParams();

  const router =
    useRouter();

  const token =
    params.get('token');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError('');

      if (!token) {

        setError(
          'Token inválido'
        );

        return;

      }

      if (
        password !==
        confirmPassword
      ) {

        setError(
          'Las contraseñas no coinciden'
        );

        return;

      }

      if (
        password.length < 6
      ) {

        setError(
          'La contraseña debe tener al menos 6 caracteres'
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await fetch(
            `${API}/auth/reset-password`,
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body:
                JSON.stringify({
                  token,
                  password,
                }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(
            data.message ??
              'Error al actualizar contraseña'
          );

        }

        setSuccess(true);

        setTimeout(() => {

          router.push(
            '/login'
          );

        }, 2500);

      } catch (err: any) {

        setError(
          err.message
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="
    min-h-screen
    bg-violet-100
    flex
    items-center
    justify-center
    p-4
    ">

      <div className="
      bg-white
      rounded-3xl
      shadow-xl
      w-full
      max-w-md
      p-8
      ">

        <h1 className="
        text-3xl
        font-bold
        text-center
        text-violet-900
        mb-2
        ">
          Recuperar contraseña
        </h1>

        <p className="
        text-center
        text-gray-500
        mb-6
        ">
          Ingresá una nueva contraseña
        </p>

        {success ? (

          <div className="
          bg-green-100
          text-green-700
          rounded-xl
          p-4
          text-center
          ">
            ✅ Contraseña actualizada correctamente.
          </div>

        ) : (

          <form
            onSubmit={
              handleSubmit
            }
            className="
            flex
            flex-col
            gap-4
            text-violet-950
            "
          >

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
              border
              rounded-xl
              p-3
              "
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="
              border
              rounded-xl
              p-3
              "
            />

            {error && (

              <div className="
              bg-red-100
              text-red-700
              rounded-xl
              p-3
              text-sm
              ">
                {error}
              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="
              bg-violet-700
              text-white
              rounded-xl
              p-3
              font-bold
              "
            >
              {
                loading
                  ? 'Actualizando...'
                  : 'Actualizar contraseña'
              }
            </button>

          </form>

        )}

      </div>

    </div>

  );

}