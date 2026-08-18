'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    pregunta: '¿El Plan Gratis vence en algún momento?',
    respuesta:
      'No. El Plan Gratis es 100% gratuito para siempre. Te permite gestionar hasta 2 cursos con lista de alumnos, tomar asistencias, cargar calificaciones y llevar tu agenda sin ingresar ninguna tarjeta de crédito.',
  },
  {
    pregunta: '¿Puedo exportar mis planillas de asistencia y notas a Excel?',
    respuesta:
      'Sí. Todos los planes de pago (Básico y Plus) cuentan con la función de exportación directa a planillas formato Excel (.xlsx) con un solo clic, listas para entregar a secretaría o dirección escolar.',
  },
  {
    pregunta: '¿Cómo se procesan los cobros de las suscripciones?',
    respuesta:
      'Todos los pagos se procesan con la máxima seguridad mediante Mercado Pago. Podés suscribirte de manera mensual o anual utilizando tarjeta de débito, crédito o dinero en tu cuenta de Mercado Pago.',
  },
  {
    pregunta: '¿Tengo que descargar una aplicación desde Google Play o App Store?',
    respuesta:
      'No hace falta instalar nada. Organizador Docente es una Web App moderna accesible desde cualquier celular (Android o iPhone), tablet o computadora. Además, podés agregar un acceso rápido a tu pantalla de inicio en 1 segundo.',
  },
  {
    pregunta: '¿Qué diferencia hay entre el Plan Básico y el Plan Plus?',
    respuesta:
      'El Plan Básico te permite administrar hasta 4 cursos simultáneos con exportación a Excel y notificaciones. El Plan Plus ofrece cursos ilimitados, módulos de planificaciones anuales, bibliografía pedagógica y cero publicidad.',
  },
  {
    pregunta: '¿Mis datos e información de los alumnos están seguros?',
    respuesta:
      'Absolutamente. Toda la información de tus cursos, planificaciones y calificaciones se almacena de forma encriptada en la nube con copias de seguridad continuas y acceso exclusivo desde tu cuenta.',
  },
];

export default function Faq() {
  const [abiertos, setAbiertos] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setAbiertos((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Schema.org FAQPage Structured Data para Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.pregunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.respuesta,
      },
    })),
  };

  return (
    <section className="w-full bg-violet-50 py-16 px-4 sm:px-6">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-200 text-violet-900 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Resuelve tus dudas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-violet-950 uppercase tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Todo lo que necesitas saber sobre el uso de la plataforma, planes y exportación a Excel.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = !!abiertos[index];
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-violet-200/80 shadow-sm overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-violet-50/50 transition"
                >
                  <span className="font-bold text-sm sm:text-base text-violet-950">
                    {faq.pregunta}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-violet-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-violet-100 bg-violet-50/30">
                    {faq.respuesta}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center bg-violet-900 text-white rounded-2xl p-6 shadow-xl border border-violet-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-bold text-base">¿Tenés otra duda sobre la plataforma?</h3>
            <p className="text-xs text-violet-200 mt-1">Creá tu cuenta gratis en 30 segundos y probá todas las funciones sin compromiso.</p>
          </div>
          <a
            href="/registro"
            className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-violet-950 font-bold rounded-xl text-xs uppercase tracking-wider transition shrink-0 shadow"
          >
            Registrarme Gratis 🚀
          </a>
        </div>
      </div>
    </section>
  );
}
