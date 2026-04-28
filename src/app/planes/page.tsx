'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const PLANES = [
  {
    nombre: 'Básico Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    cursos: 2,
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=d9333165a97b4e60a9b87f27b13c6676',
    color: 'bg-violet-800 border-violet-300 ',
    btnColor: 'bg-yellow-400 w-8/9 hover:bg-yellow-300 text-violet-900 ',
    
  },
  {
    nombre: 'Básico Anual',
    precio: '$24.999',
    frecuencia: 'por año',
    cursos: 2,
    ahorro: 'Ahorrás $22.989',
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=f597ba1d700440b7b40139c8060f78dc',
    color: 'bg-violet-900 border-yellow-300',
    btnColor: 'bg-yellow-400 w-8/9 hover:bg-yellow-300 text-violet-900',
  },
  {
    nombre: 'Plus Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    cursos: 999,
    destacado: true,
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía','Generacion de excel','Recordatorios'],
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=00418792d857442da35980be23928b2a',
    color: 'bg-violet-950 text-white',
    btnColor: 'bg-yellow-400 w-8/9 hover:bg-yellow-300 text-violet-900',
  },
  {
    nombre: 'Plus Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    cursos: 999,
    ahorro: 'Ahorrás $19.989',
    destacado: true,
    features: ['Cursos ilimitados', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios', 'Planificaciones', 'Bibliografía','Generacion de excel','Recordatorios'],
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=055a8d3ffb0f403eb1376ed38adde4ba',
    color: 'bg-black text-white',
    btnColor: 'bg-white w-8/9 hover:bg-yellow-300 text-violet-900',
  },
];

export default function PlanesPage() {
  const [suscripcion, setSuscripcion] = useState<any>(null);

  useEffect(() => {
    fetchSuscripcion();
  }, []);

  const fetchSuscripcion = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app'}/suscripciones/estado`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setSuscripcion(data);
  };

  return (
    <div className="min-h-full m-0 bg-violet-100 pt-8">
      <Navbar></Navbar>
      <h1 className="text-3xl font-bold text-violet-900 text-center mt-8 uppercase">
        Elegí tu plan
      </h1>
      <p className="text-center text-violet-500 mb-8 text-sm">
        Todos los planes incluyen 7 días de prueba gratis
      </p>

      {suscripcion && (
        <div className="max-w-md mx-auto mb-6 bg-white border border-violet-200 rounded-xl p-4 text-center">
          <p className="text-violet-700 font-semibold">
            Plan actual: <span className="capitalize">{suscripcion.estado}</span>
          </p>
          {suscripcion.fechaFin && (
            <p className="text-sm text-violet-400">
              Vence: {new Date(suscripcion.fechaFin).toLocaleDateString('es-AR')}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xs:m-2 xl:grid-cols-4  gap-4 max-w-6xl mx-auto">
        {PLANES.map((plan) => (
          <div
            key={plan.nombre}
            className={`rounded-2xl p-10 m-auto  flex flex-col justify-end min-w-84 lg:min-w items-center gap-5 sm:m-5 shadow-md ${plan.color}`}
          >
            {plan.destacado && (
              <span className="text-sm font-bold uppercase text-amber-400 bg-black border-amber-400 border-2 rounded-full px-10 py-1 self-start ">
                ⭐ Más popular
              </span>
            )}
            {plan.ahorro && (
              <span className="text-lg font-bold uppercase bg-green-400 text-green-950 rounded-full px-3 py-1 self-start mb-2">
                {plan.ahorro}
              </span>
            )}

            <h2 className="text-2xl font-bold mb-1 mt-8 uppercase">{plan.nombre}</h2>
            <p className="text-6xl font-extralight mb-1">{plan.precio}</p>
            <p className="text-sm opacity-70 mb-4">/{plan.frecuencia}</p>

            <ul className="space-y-1 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>

            <a
              href={plan.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-center py-3 mb-4 rounded-xl font-bold text-sm transition uppercase ${plan.btnColor}`}
            >
              Suscribirme
            </a>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-violet-400 mt-8">
        Los pagos son procesados de forma segura por MercadoPago.
        Podés cancelar en cualquier momento.
      </p>
    </div>
  );
}