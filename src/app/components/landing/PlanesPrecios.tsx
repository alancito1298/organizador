'use client';

import { Check, Star, Sparkles } from 'lucide-react';

const PLANES = [
  {
    nombre: 'Gratis',
    precio: '$0',
    frecuencia: 'para siempre',
    gratis: true,
    badgeTop: '🌱 100% GRATIS',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias y Calificaciones',
      'Agenda y Horarios',
      'Con anuncios discretos',
    ],
    link: '/registro',
    btnText: 'Registrarme Gratis',
    destacado: false,
  },
  {
    nombre: 'Básico Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    badgeTop: 'RECOMENDADO',
    features: [
      'Hasta 4 cursos',
      'Exportación Excel',
      'Notificaciones',
      'Sin publicidad',
    ],
    link: '/registro',
    btnText: 'Probar Gratis!',
    destacado: false,
  },
  {
    nombre: 'Plus Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    destacado: true,
    badgeTop: '⭐ Más Popular',
    badgeSub: '¡30 DÍAS GRATIS!',
    features: [
      'Cursos ilimitados',
      'Planificaciones y Bibliografía',
      'Exportación Excel Pro',
      'Sin publicidad',
    ],
    link: '/registro',
    btnText: 'Probar Gratis!',
  },
  {
    nombre: 'Básico Anual',
    precio: '$24.999',
    frecuencia: 'por año',
    ahorro: 'Ahorrás $22.999',
    badgeTop: 'AHORRO ANUAL',
    features: [
      'Hasta 4 cursos',
      'Exportación Excel',
      'Sin publicidad',
    ],
    link: '/registro',
    btnText: 'Probar Gratis!',
    destacado: false,
  },
  {
    nombre: 'Plus Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    ahorro: 'Ahorrás $19.999',
    badgeTop: 'MÁXIMO VALOR',
    features: [
      'Cursos ilimitados',
      'Planificaciones y Bibliografía',
      'Exportación Excel Pro',
      'Sin publicidad',
    ],
    link: '/registro',
    btnText: 'Probar Gratis!',
    destacado: false,
  },
];

export default function Planes() {
  return (
    <section className="py-16 px-4 sm:px-8 bg-violet-50/50 border-t border-violet-100" id="precios">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-violet-950 uppercase tracking-tight mb-3">
            Elegí el plan ideal para vos
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Todos nuestros planes incluyen acceso desde cualquier dispositivo y soporte continuo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {PLANES.map((plan) => (
            <div
              key={plan.nombre}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                plan.destacado
                  ? 'bg-violet-950 text-white shadow-2xl border-2 border-violet-700 relative overflow-hidden transform lg:-translate-y-2'
                  : 'bg-white text-gray-900 border border-violet-200/80 shadow-sm hover:shadow-md hover:border-violet-300'
              }`}
            >
              {plan.destacado && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-violet-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  ⭐ Más Popular
                </div>
              )}

              <div>
                {/* BADGE TOP */}
                <div className="mb-4">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase px-3 py-1 rounded-full ${
                      plan.gratis
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.destacado
                        ? 'bg-white/20 text-white'
                        : 'bg-violet-100 text-violet-900'
                    }`}
                  >
                    {plan.badgeTop}
                  </span>
                </div>

                {/* NOMBRE Y PRECIO */}
                <h3 className={`font-bold text-xl mb-1 ${plan.destacado ? 'text-white' : 'text-violet-950'}`}>
                  {plan.nombre}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.destacado ? 'text-yellow-400' : 'text-violet-950'}`}>
                    {plan.precio}
                  </span>
                  <span className={`text-xs ${plan.destacado ? 'text-violet-200' : 'text-gray-500'}`}>
                    /{plan.frecuencia}
                  </span>
                </div>

                {plan.ahorro && (
                  <p className="text-xs font-bold text-emerald-600 mb-4">{plan.ahorro}</p>
                )}

                {/* LISTA DE CARACTERÍSTICAS */}
                <ul className="space-y-2.5 my-6 text-xs sm:text-sm border-t border-b border-violet-100 py-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className={`shrink-0 mt-0.5 ${
                          plan.destacado ? 'text-yellow-400' : 'text-violet-700'
                        }`}
                      />
                      <span className={plan.destacado ? 'text-violet-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BOTÓN CTA */}
              <a
                href={plan.link}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center block transition shadow-sm ${
                  plan.destacado
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-violet-950 shadow-lg font-extrabold'
                    : 'bg-white hover:bg-violet-50 text-violet-950 border border-violet-300'
                }`}
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-12">
          Los pagos son procesados de forma segura por <strong className="text-violet-950">MercadoPago</strong>.<br />
          Podés cancelar o cambiar de plan en cualquier momento.
        </p>
      </div>
    </section>
  );
}