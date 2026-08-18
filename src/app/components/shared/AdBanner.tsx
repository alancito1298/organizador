'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ExternalLink } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

// Banners promocionales / patrocinados de respaldo
const DEMO_ADS = [
  {
    id: 1,
    badge: 'PATROCINADO',
    titulo: '🎓 Diplomatura en Innovación Educativa 2026',
    subtitulo: 'Becas del 50% y puntaje docente homologado para todas las provincias.',
    linkText: 'Ver información',
    url: 'https://www.organizadordocente.com',
    tagColor: 'bg-amber-400 text-amber-950',
  },
  {
    id: 2,
    badge: 'PATROCINADO',
    titulo: '📚 Editorial Pedagógica — Pack de Secuencias Didácticas',
    subtitulo: 'Descargá más de 100 secuencias e itinerarios listos para el aula.',
    linkText: 'Descargar pack',
    url: 'https://www.organizadordocente.com',
    tagColor: 'bg-emerald-400 text-emerald-950',
  },
  {
    id: 3,
    badge: 'PROMO DOCENTE',
    titulo: '🤖 Asistente de IA para Crear Evaluaciones y Rúbricas',
    subtitulo: 'Ahorrá horas de trabajo generando materiales pedagógicos en 1 clic.',
    linkText: 'Probar gratis',
    url: 'https://www.organizadordocente.com',
    tagColor: 'bg-cyan-400 text-cyan-950',
  },
];

export default function AdBanner() {
  const [mostrarAd, setMostrarAd] = useState(true);
  const [adIndex, setAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const isRealAdSense = ADSENSE_CLIENT_ID && ADSENSE_CLIENT_ID !== 'ca-pub-XXXXXXXXXXXXXXXX';

  useEffect(() => {
    if (sessionStorage.getItem('ad_banner_dismissed') === '1') return;

    verificarSuscripcion();

    if (!isRealAdSense) {
      const timer = setInterval(() => {
        setAdIndex((prev) => (prev + 1) % DEMO_ADS.length);
      }, 8000);

      return () => clearInterval(timer);
    }
  }, [isRealAdSense]);

  useEffect(() => {
    if (mostrarAd && isRealAdSense && !dismissed) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, [mostrarAd, isRealAdSense, dismissed]);

  const verificarSuscripcion = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMostrarAd(true);
      return;
    }

    try {
      const cache = sessionStorage.getItem('user_plan_tipo');
      if (cache === 'pago') {
        setMostrarAd(false);
        return;
      }

      const res = await fetch(`${API}/suscripciones/estado`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setMostrarAd(true);
        return;
      }

      const data = await res.json();
      
      if (data && data.estado === 'activa' && data.periodo !== 'gratis') {
        sessionStorage.setItem('user_plan_tipo', 'pago');
        setMostrarAd(false);
      } else {
        sessionStorage.setItem('user_plan_tipo', 'gratis');
        setMostrarAd(true);
      }
    } catch (err) {
      setMostrarAd(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('ad_banner_dismissed', '1');
  };

  if (!mostrarAd || dismissed) return null;

  const currentAd = DEMO_ADS[adIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 animate-fade-in">
      {isRealAdSense ? (
        // CONTENEDOR OFICIAL DE GOOGLE ADSENSE
        <div className="relative bg-white/90 backdrop-blur rounded-xl p-2 shadow-xl border border-violet-300 flex flex-col items-center">
          <div className="w-full flex justify-between items-center px-2 mb-1">
            <span className="text-[9px] uppercase font-bold text-gray-400">Anuncio</span>
            <Link href="/planes" className="text-[10px] text-violet-700 font-bold hover:underline flex items-center gap-1">
              <Sparkles size={10} /> Quitar anuncios
            </Link>
          </div>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '50px' }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        // BANNER DE RESPALDO PATROCINADO / PROMO
        <div className="relative bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 text-white rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-xl border border-violet-500/30 flex flex-row items-center justify-between gap-2 h-12 sm:h-14">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shrink-0 ${currentAd.tagColor}`}>
              {currentAd.badge}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                {currentAd.titulo}
              </h4>
              <p className="text-[10px] sm:text-xs text-violet-200 opacity-80 truncate hidden md:block">
                • {currentAd.subtitulo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={currentAd.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-1 bg-violet-800/80 hover:bg-violet-700 text-violet-100 rounded-lg transition border border-violet-500/40"
            >
              {currentAd.linkText} <ExternalLink size={11} />
            </a>

            <Link
              href="/planes"
              className="flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-1 bg-yellow-400 hover:bg-yellow-300 text-violet-950 rounded-lg transition shadow uppercase tracking-wider shrink-0 whitespace-nowrap"
            >
              <Sparkles size={11} /> Quitar ads
            </Link>

            <button
              onClick={handleDismiss}
              title="Cerrar anuncio"
              className="p-1 text-violet-300 hover:text-white hover:bg-violet-800/50 rounded transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
