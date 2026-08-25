'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/shared/Navbar';
import BottomNav from '../components/shared/BottomNav';
import Footer from '../components/shared/Footer';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const PLANES = [
  {
    nombre: 'Gratis',
    periodo: '',
    precio: '$0',
    frecuencia: 'para siempre',
    planMpId: 'gratis',
    gratis: true,
    badgeTop: '¡100% GRATIS!',
    badgeSub: '🌱 Sin Tarjeta',
    features: ['Hasta 4 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda y Horarios', 'Con anuncios discretos'],
    bg: 'bg-emerald-800 border-emerald-500/40',
  },
  {
    nombre: 'Plus',
    periodo: 'Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    planMpId: '00418792d857442da35980be23928b2a',
    gratis: false,
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: '⭐ Más Popular',
    features: ['🤖 Asistente Pedagógico IA', 'Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda y Horarios', 'Planificaciones', 'Bibliografía', 'Exportación de Excel', 'Notificaciones', 'Sin publicidad'],
    bg: 'bg-indigo-900 border-indigo-500/40',
  },
  {
    nombre: 'Plus',
    periodo: 'Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    planMpId: '055a8d3ffb0f403eb1376ed38adde4ba',
    gratis: false,
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: 'Ahorrás $20.000',
    features: ['🤖 Asistente Pedagógico IA', 'Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda y Horarios', 'Planificaciones', 'Bibliografía', 'Exportación de Excel', 'Notificaciones', 'Sin publicidad'],
    bg: 'bg-slate-900 border-slate-700',
  },
];

export default function PlanesClient() {
  const router = useRouter();
  const [suscripcion, setSuscripcion]   = useState<any>(null);
  const [cargando, setCargando]         = useState<string | null>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<typeof PLANES[0] | null>(null);

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
      const text = await res.text();
      if (text) {
        const parsed = JSON.parse(text);
        setSuscripcion(parsed.estado && parsed.estado !== 'sin_suscripcion' ? parsed : { estado: 'PLUS', plan: 'Plus' });
      } else {
        setSuscripcion({ estado: 'PLUS', plan: 'Plus' });
      }
    } catch (err) {
      console.error('Error obteniendo suscripción', err);
      setSuscripcion({ estado: 'PLUS', plan: 'Plus' });
    }
  };

  const confirmarSuscripcion = async () => {
    if (!planSeleccionado) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setCargando(planSeleccionado.planMpId);
    setPlanSeleccionado(null);

    if (planSeleccionado.gratis) {
      try {
        const res = await fetch(`${API}/suscripciones/activar-gratis`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Error en backend');

        router.push('/home');
      } catch (err) {
        console.error('ERROR FRONT:', err);
        alert('No se pudo activar el plan gratis');
        setCargando(null);
      }
      return;
    }

    try {
      const res = await fetch(`${API}/suscripciones/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planMpId: planSeleccionado.planMpId }),
      });

      if (!res.ok) throw new Error('Error en backend');

      const data = await res.json();
      if (!data.checkoutUrl) throw new Error('No vino checkoutUrl');

      // Redirigir en la misma pestaña para forzar que completen el pago
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error('ERROR FRONT:', err);
      alert('No se pudo iniciar el pago');
    } finally {
      setCargando(null);
    }
  };

  return (
    <div className="min-h-screen mb-55">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-violet-900 uppercase mt-12">
            Elegí tu plan
          </h1>
          <p className="text-violet-500 text-sm mt-2">
            30 Días gratis · Cancelá cuando quieras · Renovación automática
          </p>
        </div>

        {/* ESTADO ACTUAL */}
        {suscripcion && suscripcion.estado !== 'sin_suscripcion' && (
          <div className="max-w-sm mx-auto mb-8 bg-white rounded-xl p-4 text-center shadow">
            <p className="text-sm text-violet-500">Tu plan actual</p>
            <p className="text-xl font-bold text-violet-700 uppercase">{suscripcion.estado}</p>
            {suscripcion.fechaFin && (
              <p className="text-xs text-gray-400">
                Vence el {new Date(suscripcion.fechaFin).toLocaleDateString('es-AR')}
              </p>
            )}
          </div>
        )}

        {/* PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-6 items-stretch my-6">
          {PLANES.map((plan) => (
            <div
              key={plan.planMpId}
              className={`rounded-3xl p-8 sm:p-10 text-white shadow-xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.bg}`}
            >
              {/* BADGES SUPERIORES ALINEADOS */}
              <div className="min-h-[4rem] flex flex-col items-center justify-start gap-1.5 mb-4 text-center">
                {plan.badgeTop && (
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      plan.gratis
                        ? 'bg-emerald-500 text-emerald-950'
                        : 'bg-red-600 text-white animate-pulse'
                    }`}
                  >
                    {plan.badgeTop}
                  </span>
                )}
                {plan.badgeSub && (
                  <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-black/40 text-yellow-300 border border-yellow-400/30">
                    {plan.badgeSub}
                  </span>
                )}
              </div>

              {/* ENCABEZADO */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold uppercase tracking-wide mb-1 min-h-[3rem] flex items-center justify-center gap-1">
                  {plan.nombre} {plan.periodo && <span className="text-yellow-400 font-extrabold">{plan.periodo}</span>}
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-yellow-300">
                    {plan.precio}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wider opacity-75 mt-1">
                  /{plan.frecuencia}
                </p>
              </div>

              {/* CARACTERÍSTICAS */}
              <ul className="flex-1 space-y-2 py-4 border-t border-white/10 mb-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-yellow-400 font-bold shrink-0">✓</span>
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>

              {/* BOTÓN */}
              <button
                onClick={() => setPlanSeleccionado(plan)}
                disabled={cargando === plan.planMpId}
                className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-violet-950 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {cargando === plan.planMpId ? 'Procesando...' : plan.gratis ? 'Activar Gratis' : 'Suscribirme'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {planSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-violet-900 mb-2 text-center">
              Antes de continuar
            </h2>

            {planSeleccionado.gratis ? (
              <div className="bg-green-50 rounded-xl p-4 mb-4 text-sm text-green-800 space-y-2">
                <p>Vas a activar el plan <strong>Gratis</strong>: hasta 4 cursos, sin tarjeta ni pagos.</p>
                <p className="text-green-600 text-xs mt-2">
                  Podés pasarte a un plan pago cuando quieras desde esta misma pantalla.
                </p>
              </div>
            ) : (
              <div className="bg-violet-50 rounded-xl p-4 mb-4 text-sm text-violet-800 space-y-2">
                <p>Serás redirigido a <strong>MercadoPago</strong> para completar tu suscripción.</p>
                <p>Para que la renovación sea <strong>automática</strong> necesitás:</p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>Tener una cuenta en MercadoPago (o crear una gratis)</li>
                  <li>Agregar una tarjeta de crédito o débito</li>
                  <li>Confirmar la suscripción</li>
                </ol>
                <p className="text-violet-500 text-xs mt-2">
                  Solo necesitás hacerlo una vez. Después MercadoPago cobra automáticamente cada {planSeleccionado.periodo === 'Anual' ? 'año' : 'mes'}.
                </p>
              </div>
            )}

            <p className="text-center font-bold text-violet-900 mb-4">
              {planSeleccionado.nombre} {planSeleccionado.periodo} — {planSeleccionado.precio}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setPlanSeleccionado(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarSuscripcion}
                className="flex-1 py-2 rounded-xl bg-violet-700 text-white hover:bg-violet-800 transition font-bold"
              >
                {planSeleccionado.gratis ? 'Activar plan gratis' : 'Ir a MercadoPago →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <BottomNav />
    </div>
  );
}
