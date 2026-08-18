'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X, ExternalLink } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

// Banners patrocinados/educativos rotativos
const SPONSOR_ADS = [
  {
    id: 1,
    titulo: '📚 Capacitación Docente con Puntaje',
    subtitulo: 'Cursos homologados para sumar puntaje en tu provincia.',
    linkText: 'Conocer más',
    url: 'https://www.organizadordocente.com',
  },
  {
    id: 2,
    titulo: '🤖 Herramientas de IA para el Aula',
    subtitulo: 'Generá rúbricas y actividades en segundos con Inteligencia Artificial.',
    linkText: 'Descubrir',
    url: 'https://www.organizadordocente.com',
  },
  {
    id: 3,
    titulo: '📖 Materiales y Recursos Didácticos',
    subtitulo: 'Secuencias didácticas listas para usar en todos los niveles.',
    linkText: 'Ver recursos',
    url: 'https://www.organizadordocente.com',
  },
];

export default function AdBanner() {
  const [mostrarAd, setMostrarAd] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Si ya fue descartado en esta sesión, no mostrar
    if (sessionStorage.getItem('ad_banner_dismissed') === '1') return;

    verificarSuscripcion();

    // Rotar anuncio cada 15 segundos
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % SPONSOR_ADS.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const verificarSuscripcion = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Revisar caché en sessionStorage primero
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
      
      // Si el plan es pago y activo, NO mostrar publicidad
      if (data && data.estado === 'activa' && data.periodo !== 'gratis') {
        sessionStorage.setItem('user_plan_tipo', 'pago');
        setMostrarAd(false);
      } else {
        sessionStorage.setItem('user_plan_tipo', 'gratis');
        setMostrarAd(true);
      }
    } catch (err) {
      // Ante error por red, se muestra el banner por defecto
      setMostrarAd(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('ad_banner_dismissed', '1');
  };

  if (!mostrarAd || dismissed) return null;

  const currentAd = SPONSOR_ADS[adIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-4 animate-fade-in">
      <div className="relative bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-violet-700/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* ETIQUETA SUPERIOR Y ANUNCIO */}
        <div className="flex items-start gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-violet-800/60 rounded-xl text-yellow-400 shrink-0 hidden sm:block">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/40 text-yellow-300 border border-yellow-400/20">
                PATROCINADO
              </span>
              <span className="text-[10px] text-violet-300 font-light">
                Plan Gratuito
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
              {currentAd.titulo}
            </h4>
            <p className="text-xs text-violet-200 mt-0.5 line-clamp-1">
              {currentAd.subtitulo}
            </p>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-violet-800/80 hover:bg-violet-700 text-violet-100 rounded-xl transition border border-violet-600/40"
          >
            {currentAd.linkText} <ExternalLink size={13} />
          </a>

          <Link
            href="/planes"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-violet-950 rounded-xl transition shadow uppercase tracking-wider"
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
