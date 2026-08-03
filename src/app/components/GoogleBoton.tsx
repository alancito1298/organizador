"use client";

import { useEffect, useRef, useState } from "react";
import { setToken } from "../../lib/token";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

declare global {
  interface Window {
    google?: any;
  }
}

type GoogleButtonProps = {
  onClick?: () => void;
  loading?: boolean;
};

export default function GoogleButton({
  onClick,
  loading: loadingProp = false,
}: GoogleButtonProps) {
  const hiddenContainerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID");
      setReady(true); // no bloquear el botón: al click va a avisar el error
      return;
    }

    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const init = () => {
      if (cancelled || !hiddenContainerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(hiddenContainerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
        });
      } catch (error) {
        console.error("Error inicializando Google Identity Services:", error);
      } finally {
        setReady(true); // el botón nunca queda bloqueado, haya funcionado o no
      }
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          init();
        }
      }, 200);

      // si a los 8s el SDK de Google no cargó (bloqueado, sin red, etc.), no dejar el botón colgado
      timeout = setTimeout(() => {
        clearInterval(interval);
        if (!cancelled && !window.google?.accounts?.id) {
          console.error("Google Identity Services no cargó a tiempo");
          setReady(true);
        }
      }, 8000);
    }

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setLoading(true);
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
    } catch (error) {
      alert("Error al iniciar sesión con Google");
      console.error(error);
      setLoading(false);
    }
  };

  const handleClick = () => {
    onClick?.();
    const realButton = hiddenContainerRef.current?.querySelector<HTMLElement>(
      'div[role="button"]'
    );
    if (!realButton) {
      alert("No se pudo cargar el inicio de sesión de Google. Revisá tu conexión o probá de nuevo en unos segundos.");
      return;
    }
    realButton.click();
  };

  const isLoading = loading || loadingProp;

  return (
    <div className="relative w-full">
      {/* Botón real de Google, oculto: recibe el click reenviado desde el botón visible */}
      <div
        ref={hiddenContainerRef}
        className="absolute inset-0 opacity-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading || !ready}
        className="
          w-full flex items-center justify-center gap-3
          rounded-lg border border-slate-300
          bg-white text-slate-700
          py-2 px-4 text-sm font-medium
          hover:bg-slate-50 transition
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {/* GOOGLE ICON */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 2.6 29.8 0 24 0 14.6 0 6.6 5.4 2.8 13.2l7.3 5.7C12 13 17.6 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.1 24.6c0-1.7-.2-3.4-.6-5H24v9.4h12.5c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.6z"
          />
          <path
            fill="#FBBC05"
            d="M10.1 28.9c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.3-5.7C1 16.1 0 20 0 24s1 7.9 2.8 11.7l7.3-5.8z"
          />
          <path
            fill="#34A853"
            d="M24 48c5.8 0 10.9-1.9 14.5-5.1l-7-5.4c-1.9 1.3-4.3 2-7.5 2-6.4 0-12-3.5-14.8-8.6l-7.3 5.8C6.6 42.6 14.6 48 24 48z"
          />
        </svg>

        <span>
          {isLoading ? "Conectando..." : "Continuar con Google"}
        </span>
      </button>
    </div>
  );
}
