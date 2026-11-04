"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isPremiumSubscription } from "@/utils/suscripcion";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}

/**
 * Controla la visualización de Google AdSense mediante código:
 * - En la Landing Page ('/'): pausa las solicitudes (pauseAdRequests = 1) para mantenerla limpia.
 * - En usuarios PREMIUM (Plan Plus activo o trial): desactiva y bloquea el 100% de los anuncios de AdSense.
 * - En usuarios GRATIS dentro de la Appweb ('/home', '/cursos', etc.): permite anuncios automáticos.
 */
export default function AdSenseManager() {
  const pathname = usePathname();
  const [esPremium, setEsPremium] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("user_is_premium") === "true";
    }
    return false;
  });

  // Verificar estado de suscripción cuando hay sesión iniciada
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      setEsPremium(false);
      sessionStorage.setItem("user_is_premium", "false");
      return;
    }

    let isMounted = true;
    const comprobar = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${API}/suscripciones/estado`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok && isMounted) {
          const data = await res.json();
          const premium = isPremiumSubscription(data);
          setEsPremium(premium);
          sessionStorage.setItem("user_is_premium", premium ? "true" : "false");
        }
      } catch {
        // En caso de error de red o timeout se mantiene el valor en caché
      }
    };

    comprobar();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Aplicar pausa a AdSense y reglas de bloqueo
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.adsbygoogle = window.adsbygoogle || [];

    const debePausar = pathname === "/" || esPremium;

    if (debePausar) {
      // Bloquear solicitudes de anuncios en AdSense
      window.adsbygoogle.pauseAdRequests = 1;
    } else {
      // Permitir anuncios en usuarios del plan gratuito dentro de la appweb
      window.adsbygoogle.pauseAdRequests = 0;
    }
  }, [pathname, esPremium]);

  // Si el usuario es premium o está en la landing, inyectamos estilos para ocultar
  // cualquier contenedor residual, banner o auto-placement de AdSense
  const debeOcultar = pathname === "/" || esPremium;

  if (!debeOcultar) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          ins.adsbygoogle,
          .google-auto-placed,
          [id^="aswift_"],
          iframe[name^="google_ads_"] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            max-height: 0 !important;
            pointer-events: none !important;
            opacity: 0 !important;
          }
        `,
      }}
    />
  );
}
