'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

const PLANES = [
  {
    nombre: 'Básico',
    periodo: 'Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    planMpId: 'd9333165a97b4e60a9b87f27b13c6676',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
    ],
    accent: '#a78bfa',
    bg: 'bg-violet-800',
  },
  {
    nombre: 'Básico',
    periodo: 'Anual',
    precio: '$24.999',
    frecuencia: 'por año',
    planMpId: 'f597ba1d700440b7b40139c8060f78dc',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
    ],
    accent: '#fbbf24',
    bg: 'bg-violet-900',
  },
  {
    nombre: 'Plus',
    periodo: 'Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    planMpId: '00418792d857442da35980be23928b2a',
    features: [
      'Cursos ilimitados',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
      'Planificaciones',
      'Bibliografía',
      'Generación de Excel',
      'Recordatorios',
    ],
    accent: '#fbbf24',
    bg: 'bg-violet-950',
  },
  {
    nombre: 'Plus',
    periodo: 'Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    planMpId: '055a8d3ffb0f403eb1376ed38adde4ba',
    features: [
      'Cursos ilimitados',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
      'Planificaciones',
      'Bibliografía',
      'Generación de Excel',
      'Recordatorios',
    ],
    accent: '#ffffff',
    bg: 'bg-black',
  },
];

export default function PlanesPage() {
  const router = useRouter();

  const [suscripcion, setSuscripcion] = useState<any>(null);
  const [cargando, setCargando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    fetchSuscripcion();
  }, []);

  // 🔹 Obtener estado de suscripción
  const fetchSuscripcion = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API}/suscripciones/estado`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setSuscripcion(data);
    } catch (err) {
      console.error('Error obteniendo suscripción', err);
    }
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
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('ERROR BACKEND:', errorText);
        throw new Error('Error en backend');
      }
  
      const data = await res.json();
  
      if (!data.checkoutUrl) {
        throw new Error('No vino checkoutUrl');
      }
  
    
      window.location.href = data.checkoutUrl;
  
    } catch (err) {
      console.error('ERROR FRONT:', err);
      alert('No se pudo iniciar el pago');
    }
  };

  return (
    <div className="min-h-screen bg-violet-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-violet-900 uppercase">
            Elegí tu plan
          </h1>
          <p className="text-violet-500 text-sm">
            30 días de prueba gratis · Cancelá cuando quieras
          </p>
        </div>

        {/* ESTADO ACTUAL */}
        {suscripcion && (
          <div className="max-w-sm mx-auto mb-8 bg-white rounded-xl p-4 text-center shadow">
            <p className="text-sm text-violet-500">Tu plan actual</p>
            <p className="text-xl font-bold capitalize">
              {suscripcion.estado}
            </p>

            {suscripcion.fechaFin && (
              <p className="text-xs text-gray-400">
                Vence el{' '}
                {new Date(
                  suscripcion.fechaFin
                ).toLocaleDateString('es-AR')}
              </p>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="max-w-sm mx-auto mb-6 bg-red-100 p-3 text-center text-red-600 rounded">
            {error}
          </div>
        )}

        {/* PLANES */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANES.map((plan) => (
            <div
              key={plan.planMpId}
              className={`rounded-2xl p-6 text-white shadow-lg flex flex-col ${plan.bg}`}
            >
              <h2 className="text-2xl font-bold">{plan.nombre}</h2>
              <p className="text-sm opacity-70">{plan.periodo}</p>

              <p className="text-4xl mt-4">{plan.precio}</p>
              <p className="text-xs opacity-60 mb-4">
                /{plan.frecuencia}
              </p>

              <ul className="flex-1 space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm">
                    ✓ {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSuscribirse(plan.planMpId)}
                disabled={cargando === plan.planMpId}
                className="bg-yellow-400 text-violet-900 py-2 rounded font-bold disabled:opacity-50"
              >
                {cargando === plan.planMpId
                  ? 'Procesando...'
                  : 'Suscribirme'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}