'use client';

const FAQS = [
  {
    pregunta: '¿Es realmente gratis?',
    respuesta: 'Sí, ofrecemos un plan 100% gratuito que te permite gestionar hasta 2 cursos con alumnos ilimitados para siempre, sin necesidad de ingresar tarjeta de crédito.',
  },
  {
    pregunta: '¿Puedo usarlo sin internet?',
    respuesta: 'Actualmente, Organizador Docente requiere conexión a internet para sincronizar tus datos en tiempo real de forma segura en la nube, permitiéndote acceder desde cualquier dispositivo.',
  },
  {
    pregunta: '¿Cómo exporto mis datos a Excel?',
    respuesta: 'Desde la vista de cualquier curso, encontrarás un botón de "Exportar". Al hacer clic, podrás elegir si deseas descargar las asistencias, calificaciones o lista de alumnos en formato .xlsx.',
  },
  {
    pregunta: '¿Qué pasa con mis datos si dejo de pagar el plan Plus?',
    respuesta: 'Tus datos nunca se borran. Si tu suscripción Plus caduca, tu cuenta pasará al plan gratuito. Podrás seguir viendo toda tu información, pero no podrás agregar nuevos cursos si ya superaste el límite de 2.',
  },
];

export default function Faq() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: faq.respuesta },
    })),
  };

  return (
    <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display-lg text-display-lg text-primary text-center mb-xl">Preguntas Frecuentes</h2>
        <div className="space-y-sm">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden">
              <summary className="flex justify-between items-center font-headline-md text-lg text-primary cursor-pointer p-md hover:bg-surface-container transition-colors">
                {faq.pregunta}
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="p-md pt-0 text-on-surface-variant border-t border-outline-variant/20 mt-2 font-body-md">
                {faq.respuesta}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
