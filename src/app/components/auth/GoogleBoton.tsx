"use client";

import { useEffect, useRef, useState } from "react";
import { setToken } from "../../../lib/token";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleButtonProps = {
  loading?: boolean;
};

export default function GoogleButton({ loading: loadingProp = false }: GoogleButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) throw new Error("No se pudo iniciar sesión con Google");

      const data = await res.json();
      setToken(data.access_token);

      window.location.replace(data.isNewUser ? "/planes" : "/home");
    } catch (err) {
      setError("Error al iniciar sesión con Google. Probá de nuevo.");
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      setError("Google Sign-In no está configurado.");
      return;
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const render = () => {
      if (cancelled || !containerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        const width = Math.min(containerRef.current.offsetWidth || 300, 400);

        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width,
        });
      } catch (err) {
        console.error("Error inicializando Google Identity Services:", err);
        setError("No se pudo cargar el inicio de sesión de Google.");
      }
    };

    if (window.google?.accounts?.id) {
      render();
    } else {
      interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          render();
        }
      }, 200);

      timeout = setTimeout(() => {
        clearInterval(interval);
        if (!cancelled && !window.google?.accounts?.id) {
          console.error("Google Identity Services no cargó a tiempo");
          setError("No se pudo cargar el inicio de sesión de Google.");
        }
      }, 8000);
    }

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const isLoading = loading || loadingProp;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        className={`w-full flex justify-center ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
      />
      {isLoading && (
        <p className="text-xs text-slate-500">Conectando...</p>
      )}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
