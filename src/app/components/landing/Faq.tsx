'use client';

const FAQS = [
  {
    pregunta: '¿El Plan Inicial es realmente gratis para siempre?',
    respuesta: 'Sí. El Plan Inicial es 100% gratuito de por vida. Te permite crear hasta 4 cursos con alumnos ilimitados, tomar asistencia diaria, cargar notas con promedios automáticos y usar la agenda sin ingresar ninguna tarjeta de crédito.',
  },
  {
    pregunta: '¿Puedo usar la aplicación sin conexión ni Wi-Fi en el aula?',
    respuesta: '¡Totalmente! Organizador Docente incluye Modo Offline automático. Podés tomar asistencia y registrar notas dentro del aula sin señal. Toda la información se guarda de forma segura en tu dispositivo y se sincroniza con la nube apenas vuelvas a tener internet.',
  },
  {
    pregunta: '¿Cómo funciona el Asistente Pedagógico con IA?',
    respuesta: 'Es un asistente inteligente especializado en el sistema educativo argentino. Le podés pedir que arme secuencias didácticas, exámenes a desarrollar con rúbrica, ideas para clases, o que analice las notas y asistencias de tus alumnos para saber quiénes necesitan apoyo.',
  },
  {
    pregunta: '¿Cómo exporto las planillas de asistencia y notas a Excel?',
    respuesta: 'Con el Plan Plus, cada curso tiene un botón "Descargar Planilla". Con un solo clic se genera un archivo de Excel (.xlsx) prolijo y ordenado, listo para imprimir o enviar por mail a secretaría y dirección escolar.',
  },
  {
    pregunta: '¿Qué sucede con mi información si dejo de pagar el Plan Plus?',
    respuesta: 'Tus datos nunca se pierden ni se borran. Tu cuenta vuelve al Plan Inicial y podrás seguir consultando todo tu historial de calificaciones, asistencias y alumnos.',
  },
  {
    pregunta: '¿Tengo que descargar la app de Google Play o App Store?',
    respuesta: 'No hace falta ocupar espacio de tu teléfono. Organizador Docente es una Progressive Web App (PWA). Solo tenés que ingresar desde tu navegador en celular, tablet o PC y podés instalar el acceso directo en tu pantalla de inicio en 2 segundos.',
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
    <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto font-mulish" id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="text-center mb-12 flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-accent-violet">
          <span className="material-symbols-outlined text-sm">help</span>
          Respuestas Claras
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Preguntas Frecuentes
        </h2>
        <p className="text-sm sm:text-base text-secondary max-w-xl">
          Resolvemos tus dudas principales sobre el funcionamiento, planes y modo sin conexión.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details
            key={i}
            className="group bg-surface-bg neumorphic-raised rounded-2xl sm:rounded-3xl border border-white/60 p-4 sm:p-5 transition-all duration-300"
          >
            <summary className="flex justify-between items-center text-sm sm:text-base font-extrabold text-on-surface cursor-pointer list-none select-none gap-4">
              <span>{faq.pregunta}</span>
              <span className="p-1.5 rounded-xl neumorphic-inset text-accent-violet group-open:rotate-180 transition-transform duration-300 shrink-0">
                <span className="material-symbols-outlined text-base block">expand_more</span>
              </span>
            </summary>
            <div className="pt-3 text-xs sm:text-sm text-secondary leading-relaxed border-t border-violet-100/60 mt-3 font-medium">
              {faq.respuesta}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
