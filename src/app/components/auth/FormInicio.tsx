"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GoogleButton from "./GoogleBoton";
import { setToken } from "../../../lib/token";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Email o contraseña incorrectos");
      }

      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
      }

      window.location.replace("/home");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 sm:p-9 border border-white/60 shadow-xl flex flex-col gap-6 font-mulish">
        {/* Header con Isotipo */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="inline-flex p-3 rounded-2xl neumorphic-inset text-accent-violet hover:scale-105 transition-transform mb-1">
            <Image src="/odicono.svg" alt="Organizador Docente" width={38} height={38} priority />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full neumorphic-inset text-[11px] font-extrabold uppercase tracking-wider text-accent-violet">
            <span className="w-2 h-2 rounded-full bg-accent-violet shadow-[0_0_6px_#7c3aed]"></span>
            Espacio Docente
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            ¡Hola de nuevo!
          </h1>
          <p className="text-xs sm:text-sm text-secondary font-medium max-w-xs">
            Ingresá a tu cuenta para gestionar tus cursos, planificaciones y notas.
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Botón de Google */}
        <div className="flex flex-col gap-2">
          <GoogleButton />
          <div className="flex items-center gap-3 my-1">
            <div className="h-px bg-outline-variant/30 flex-1"></div>
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">o con tu email</span>
            <div className="h-px bg-outline-variant/30 flex-1"></div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                mail
              </span>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="docente@ejemplo.com"
                className="w-full py-3 pl-11 pr-4 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-extrabold text-on-surface uppercase tracking-wider">
                Contraseña
              </label>
              <Link href="/recuperar" className="text-[11px] font-bold text-accent-violet hover:underline">
                ¿La olvidaste?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-lg pointer-events-none">
                lock
              </span>
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 pl-11 pr-11 rounded-2xl neumorphic-inset bg-transparent border-none text-sm text-text-main placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent-violet/50 font-medium"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-main p-1 focus:outline-none"
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                <span className="material-symbols-outlined text-lg">
                  {mostrarPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-accent-violet text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-accent-violet/25 hover:bg-accent-violet/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Ingresando...
              </>
            ) : (
              <>
                <span>Ingresar a mis cursos</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Card */}
        <div className="text-center text-xs text-secondary pt-2 border-t border-violet-100/60">
          ¿Todavía no tenés cuenta?{" "}
          <Link href="/registro" className="font-extrabold text-accent-violet hover:underline ml-1">
            Registrate gratis aquí
          </Link>
        </div>
      </div>
    </div>
  );
}