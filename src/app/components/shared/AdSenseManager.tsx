"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}

/**
 * Controla la visualización de Google AdSense mediante código:
 * - En la Landing Page ('/'): pausa las solicitudes (pauseAdRequests = 1) para que no haya anuncios.
 * - En la Appweb ('/home', '/cursos', etc.): permite los anuncios automáticos (pauseAdRequests = 0).
 */
export default function AdSenseManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.adsbygoogle = window.adsbygoogle || [];

    if (pathname === "/") {
      // Portada limpia sin anuncios
      window.adsbygoogle.pauseAdRequests = 1;
    } else {
      // Appweb con anuncios habilitados
      window.adsbygoogle.pauseAdRequests = 0;
    }
  }, [pathname]);

  return null;
}

