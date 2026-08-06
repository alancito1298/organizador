"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pendingPagePath = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const query = searchParams.toString();
    const page_path = query ? `${pathname}?${query}` : pathname;

    const sendPageView = () => {
      window.gtag!("event", "page_view", {
        page_path,
        send_to: GA_MEASUREMENT_ID,
      });
    };

    if (window.gtag) {
      sendPageView();
      return;
    }

    // el script de gtag.js puede no haber cargado todavia (afterInteractive es async):
    // esperamos a que este listo en vez de perder el pageview en silencio.
    pendingPagePath.current = page_path;
    const interval = setInterval(() => {
      if (window.gtag && pendingPagePath.current === page_path) {
        clearInterval(interval);
        sendPageView();
      }
    }, 200);

    const timeout = setTimeout(() => clearInterval(interval), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, searchParams]);

  return null;
}
