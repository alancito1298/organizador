'use client';

const PLANES = [
  {
    nombre: 'Gratis',
    precio: '$0',
    frecuencia: 'para siempre',
    gratis: true,
    badgeTop: '¡100% GRATIS!',
    badgeSub: '🌱 Sin Tarjeta',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
    ],
    link: '/registro',
    color: 'bg-emerald-800 border-emerald-500/40 text-white',
    btnText: 'Registrarme Gratis',
  },
  {
    nombre: 'Básico Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: 'Especial Primaria',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
    ],
    link: '/registro',
    color: 'bg-violet-800 border-violet-500/40 text-white',
    btnText: 'Probar Gratis!',
  },
  {
    nombre: 'Plus Mensual',
    precio: '$4.999',
    frecuencia: 'por mes',
    destacado: true,
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: '⭐ Más Popular',
    features: [
      'Cursos ilimitados',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda y Horarios',
      'Planificaciones y Bibliografía',
      'Generación de Excel',
      'Recordatorios',
    ],
    link: '/registro',
    color: 'bg-indigo-900 border-indigo-500/40 text-white',
    btnText: 'Probar Gratis!',
  },
  {
    nombre: 'Básico Anual',
    precio: '$24.999',
    frecuencia: 'por año',
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: 'Ahorrás $22.999',
    features: [
      'Hasta 2 cursos',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda',
      'Horarios',
    ],
    link: '/registro',
    color: 'bg-purple-900 border-purple-500/40 text-white',
    btnText: 'Probar Gratis!',
  },
  {
    nombre: 'Plus Anual',
    precio: '$39.999',
    frecuencia: 'por año',
    destacado: true,
    badgeTop: '¡30 DÍAS GRATIS!',
    badgeSub: 'Ahorrás $19.999',
    features: [
      'Cursos ilimitados',
      'Alumnos ilimitados',
      'Asistencias',
      'Calificaciones',
      'Agenda y Horarios',
      'Planificaciones y Bibliografía',
      'Generación de Excel',
      'Recordatorios',
    ],
    link: '/registro',
    color: 'bg-slate-900 border-slate-700 text-white',
    btnText: 'Probar Gratis!',
  },
];

export default function Planes() {
  return (
    <div className="flex flex-col min-h-screen items-center w-full px-4 py-16 bg-gradient-to-t from-violet-950 to-violet-900 text-white">
      <div className="max-w-7xl w-full flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase text-center mb-4 tracking-tight">
          Elegí el <span className="text-yellow-400">plan</span> ideal para vos
        </h1>
        <p className="text-violet-200 text-center max-w-2xl text-base sm:text-lg mb-12 font-light">
          Todos nuestros planes incluyen acceso desde cualquier dispositivo y soporte continuo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full max-w-7xl items-stretch">
          {PLANES.map((plan) => (
            <div
              key={plan.nombre}
              className={`rounded-2xl p-6 flex flex-col justify-between shadow-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.color}`}
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

              {/* ENCABEZADO DE TARJETA */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold uppercase tracking-wide mb-1 min-h-[3rem] flex items-center justify-center">
                  {plan.nombre}
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-yellow-300">
                    {plan.precio}
                  </span>
                </div>
                <p className="text-xs uppercase tracking-wider opacity-75 mt-1">
                  {plan.frecuencia}
                </p>
              </div>

              {/* LISTA DE CARACTERÍSTICAS */}
              <ul className="flex-1 space-y-2 py-4 border-t border-white/10 mb-6 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-yellow-400 font-bold shrink-0">✓</span>
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>

              {/* BOTÓN CTA */}
              <a
                href={plan.link}
                className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-violet-950 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all duration-200 text-center block"
              >
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm sm:text-base text-violet-200 font-light mt-12">
          Los pagos son procesados de forma segura por <b className="font-bold text-white">MercadoPago</b>.<br />
          Podés cancelar o cambiar de plan en cualquier momento.
        </p>
      </div>
    </div>
  );
}