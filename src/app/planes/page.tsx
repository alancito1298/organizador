'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const PLANES = [
  {
    nombre: 'Básico',
    periodo: 'Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    planMpId: 'd9333165a97b4e60a9b87f27b13c6676',
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    accent: '#a78bfa',
    bg: 'bg-violet-800',
    badge: null,
  },
  {
    nombre: 'Básico',
    periodo: 'Anual',
    precio: '$24.999',
    frecuencia: 'por año',
    planMpId: 'f597ba1d700440b7b40139c8060f78dc',
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    accent: '#fbbf24',
    bg: 'bg-violet-900',
    badge: { text: 'Ahorrás $22.989', color: 'bg-green-400 text-green-950' },
  },
  {
    nombre: 'Plus',
    periodo: 'Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    planMpId: '00418792d857442da35980be23928b2a',
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía', 'Generación de Excel', 'Recordatorios'],
    accent: '#fbbf24',
    bg: 'bg-violet-950',
    badge: { text: '⭐ Más popular', color: 'bg-yellow-400 text-violet-950' },
  },
  {
    nombre: 'Plus',
    periodo: 'Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    planMpId: '055a8d3ffb0f403eb1376ed38adde4ba',
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía', 'Generación de Excel', 'Recordatorios'],
    accent: '#ffffff',
    bg: 'bg-black',
    badge: { text: 'Ahorrás $19.999', color: 'bg-green-400 text-green-950' },
  },
];

export default function PlanesPage() {
  const router = useRouter();
  const [suscripcion, setSuscripcion] = useState<any>(null);
  const [cargando, setCargando]       = useState<string | null>(null);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.replace('/login'); return; }
    fetchSuscripcion();
  }, []);

  const fetchSuscripcion = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res  = await fetch(`${API}/suscripciones/estado`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSuscripcion(data);
    } catch {}
  };

  const handleSuscribirse = async (planMpId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    try {
      const res = await fetch(`${API}/suscripciones/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planMpId }),
      });
  
      const data = await res.json();
  
      // REDIRECCIÓN
      window.location.href = data.checkoutUrl;
  
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-violet-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-violet-900 uppercase tracking-wide mb-2">
            Elegí tu plan
          </h1>
          <p className="text-violet-500 text-sm">
            30 días de prueba gratis · Sin tarjeta requerida al inicio · Cancelá cuando quieras
          </p>
        </div>

        {/* Estado suscripción actual */}
        {suscripcion && (
          <div className="max-w-sm mx-auto mb-8 bg-white border-2 border-violet-300 rounded-2xl p-4 text-center shadow">
            <p className="text-violet-700 font-semibold text-sm uppercase tracking-wide mb-1">
              Tu plan actual
            </p>
            <p className="text-2xl font-bold text-violet-900 capitalize">{suscripcion.estado}</p>
            {suscripcion.fechaFin && (
              <p className="text-xs text-violet-400 mt-1">
                Vence el {new Date(suscripcion.fechaFin).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-sm mx-auto mb-6 bg-red-100 border border-red-300 rounded-xl p-3 text-center text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Grilla de planes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANES.map((plan) => (
            <div
              key={plan.planMpId}
              className={`relative rounded-2xl p-8 flex flex-col gap-4 shadow-xl text-white ${plan.bg} transition-transform hover:-translate-y-1 duration-200`}
            >
              {/* Badge */}
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold uppercase rounded-full px-4 py-1 whitespace-nowrap ${plan.badge.color}`}>
                  {plan.badge.text}
                </span>
              )}

              {/* Nombre y periodo */}
              <div className="mt-2">
                <p className="text-xs uppercase tracking-widest opacity-60 mb-1">{plan.periodo}</p>
                <h2 className="text-3xl font-bold">{plan.nombre}</h2>
              </div>

              {/* Precio */}
              <div>
                <p className="text-5xl font-extralight">{plan.precio}</p>
                <p className="text-xs opacity-50 mt-1">/{plan.frecuencia}</p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-2 border-t border-white/10 pt-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2 opacity-80">
                    <span style={{ color: plan.accent }} className="text-base">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Botón */}
              <button
                onClick={() => handleSuscribirse(plan.planMpId)}
                disabled={cargando === plan.planMpId}
                className="mt-2 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all disabled:opacity-50"
                style={{
                  backgroundColor: plan.accent,
                  color: plan.accent === '#ffffff' ? '#1e1b4b' : '#1e1b4b',
                }}
              >
                {cargando === plan.planMpId ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Generando...
                  </span>
                ) : 'Suscribirme'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-violet-400 mt-10">
          Los pagos son procesados de forma segura por MercadoPago · Podés cancelar en cualquier momento
        </p>
      </div>
    </div>
  );
}