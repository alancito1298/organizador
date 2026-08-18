'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ExternalLink, Megaphone } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

// Anuncios de prueba / demostración para el Plan Gratis
const DEMO_ADS = [
  {
    id: 1,
    badge: 'ANUNCIO DEMO',
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

  useEffect(() => {
    // Si fue descartado en esta sesión específica, no mostrar
    if (sessionStorage.getItem('ad_banner_dismissed') === '1') return;

    verificarSuscripcion();

    // Rotar anuncio de prueba cada 8 segundos
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % DEMO_ADS.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

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
      
      // Ocultar publicidad únicamente si posee suscripción de pago activa
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
    <div className="w-full max-w-5xl mx-auto px-3 my-4 animate-fade-in">
      <div className="relative bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* ICONO Y ANUNCIO DE PRUEBA */}
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <div className="p-3 bg-violet-800/70 rounded-xl text-yellow-400 shrink-0 hidden sm:flex items-center justify-center">
            <Megaphone size={24} className="animate-bounce" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full ${currentAd.tagColor}`}>
                {currentAd.badge}
              </span>
              <span className="text-[11px] text-violet-300 font-medium">
                Visualización Plan Gratuito
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
              {currentAd.titulo}
            </h4>
            <p className="text-xs text-violet-200 mt-1 opacity-90 leading-relaxed">
              {currentAd.subtitulo}
            </p>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-violet-800/80 hover:bg-violet-700 text-violet-100 rounded-xl transition border border-violet-500/40"
          >
            {currentAd.linkText} <ExternalLink size={13} />
          </a>

          <Link
            href="/planes"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-violet-950 rounded-xl transition shadow uppercase tracking-wider shrink-0"
          >
            <Sparkles size={13} /> Quitar anuncios
          </Link>

          <button
            onClick={handleDismiss}
            title="Cerrar anuncio"
            className="p-1.5 text-violet-300 hover:text-white hover:bg-violet-800/50 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
