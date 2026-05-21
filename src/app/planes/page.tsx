'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const PLANES = [
  {
    nombre: 'Básico',
    periodo: 'Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    planMpId: 'd9333165a97b4e60a9b87f27b13c6676',
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    bg: 'bg-violet-800',
  },
  {
    nombre: 'Básico',
    periodo: 'Anual',
    precio: '$29.999',
    frecuencia: 'por año',
    planMpId: 'f597ba1d700440b7b40139c8060f78dc',
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Ahorrás $18.000'],
    bg: 'bg-violet-900',
  },
  {
    nombre: 'Plus',
    periodo: 'Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    planMpId: '00418792d857442da35980be23928b2a',
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía', 'Generación de Excel', 'Recordatorios'],
    bg: 'bg-violet-950',
  },
  {
    nombre: 'Plus',
    periodo: 'Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    planMpId: '055a8d3ffb0f403eb1376ed38adde4ba',
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía', 'Generación de Excel', 'Recordatorios', 'Ahorrás $20.000'],
    bg: 'bg-black',
  },
];

export default function PlanesPage() {
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
      if (text) setSuscripcion(JSON.parse(text));
    } catch (err) {
      console.error('Error obteniendo suscripción', err);
    }
  };

  const confirmarSuscripcion = async () => {
    if (!planSeleccionado) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setCargando(planSeleccionado.planMpId);
    setPlanSeleccionado(null);

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

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-violet-900 uppercase mt-12">
            Elegí tu plan
          </h1>
          <p className="text-violet-500 text-sm mt-2">
           
          </p>
          <p className="text-violet-500 text-sm mt-2">
        30 Diás gratis · Cancelá cuando quieras · Renovación automática 
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
        <div className="grid grid-cols-1 m-4 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANES.map((plan) => (
            <div key={plan.planMpId} className={`rounded-xl text-white shadow-lg flex flex-col ${plan.bg}`}>
              <h2 className="text-5xl font-extralight text-center uppercase m-5 mb-0">{plan.nombre}</h2>
              <p className="text-lg text-center font-bold uppercase text-yellow-400">{plan.periodo}</p>
              <p className="text-4xl mt-4 text-center">{plan.precio}</p>
              <p className="text-sm text-black mb-4 text-center mt-2 bg-amber-400">/{plan.frecuencia}</p>

              <ul className="flex-1 space-y-2 text-center mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm">
                    <strong className="text-yellow-400 text-xl">✓</strong> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setPlanSeleccionado(plan)}
                disabled={cargando === plan.planMpId}
                className="bg-yellow-400 text-violet-900 py-2 rounded font-bold disabled:opacity-50 m-2"
              >
                {cargando === plan.planMpId ? 'Procesando...' : 'Suscribirme'}
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
                Ir a MercadoPago →
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav></BottomNav>
    </div>
  );
}