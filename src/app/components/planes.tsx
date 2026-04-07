'use client';

const PLANES = [
  {
    nombre: 'Básico Mensual',
    precio: '$3.999',
    frecuencia: 'por mes',
    cursos: 2,
    features: ['Hasta 2 cursos', 'Alumnos ilimitados', 'Asistencias', 'Calificaciones', 'Agenda', 'Horarios'],
    link: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=d9333165a97b4e60a9b87f27b13c6676',
    color: 'bg-violet-800 border-violet-300',
    btnColor: 'bg-yellow-400 w-8/9 hover:bg-yellow-300 text-violet-900',
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
    link2: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=00418792d857442da35980be23928b2a',
    link:"https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=d7e14b56e3714fd3bfbd6d8b7bcbcc48",
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

export default function Planes() {
 


 
  return (
    <div className="min-h-screen m-0 w-full bg-red-500  ">
      <h1 className="text-3xl mt-10 lg:mt-20 lg:text-4xl font-mono text-violet-900 text-center mb-2 uppercase">
        Elegí el <strong>plan</strong> que mas se adapte a tus necesidades
      </h1>
      <p className="text-center text-violet-950 mb-8 text-sm">
        Todos los planes incluyen <strong>30</strong> días de prueba gratis
      </p>

     

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:gap-8 pt-2 gap-4 max-w-6xl mx-auto">
        {PLANES.map((plan) => (
          <div
            key={plan.nombre}
            className={`rounded-2xl p-10 flex flex-col items-center gap-5  shadow-md ${plan.color}`}
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

            <h2 className="text-2xl uppercase font-bold mt-5 mb-1">{plan.nombre}</h2>
            <p className="text-6xl font-extralight mb-1">{plan.precio}</p>
            <p className="text-sm opacity-70 mb-4">{plan.frecuencia}</p>

            <ul className="space-y-1 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>

            <a
              href="/registro"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-center py-3  rounded-xl font-bold text-sm transition mb-8 uppercase ${plan.btnColor}`}
            >
             Registrarme
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