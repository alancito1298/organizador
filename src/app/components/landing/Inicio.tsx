'use client';

import Image from "next/image";
import Link from "next/link";
import Features from "./Features";
import Planes from "./PlanesPrecios";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import InfoDispositivos from "./InfoDispositivos";
import Faq from "./Faq";
import StickyMobileCta from "./StickyMobileCta";

const items = [
  {
    id: "offline",
    titulo: "⚡ Modo Offline en el Aula",
    descripcion: "¿Poca señal o sin Wi-Fi en tu escuela? Tomá asistencia y cargá notas sin internet. Tus datos se guardan en tu dispositivo y se sincronizan al reconectar.",
  },
  {
    id: "ia",
    titulo: "🤖 Asistente Pedagógico con IA",
    descripcion: "Generá secuencias didácticas, exámenes listos para imprimir, rúbricas y adaptaciones curriculares en segundos con Inteligencia Artificial.",
  },
  {
    id: "cursos",
    titulo: "Crear y gestionar cursos fácilmente",
    descripcion: "Organizá todas tus materias en segundos, separando cursos, años y contenido sin complicaciones.",
  },
  {
    id: "asistencias",
    titulo: "Registrar asistencia y concepto",
    descripcion: "Marcá el registro de tus clases con tan solo un click. Visual ágil y rápida con conceptos pedagógicos.",
  },
  {
    id: "agenda",
    titulo: "Toda tu información en un solo lugar",
    descripcion: "Agenda, Planificaciones, Calificaciones, Horarios, Asistencia, Conceptos y Recordatorios unificados.",
  },
  {
    id: "calificaciones",
    titulo: "Seguimiento de calificaciones",
    descripcion: "Agregá, ordená, consultá y editá calificaciones fácilmente con promedios automáticos por trimestre.",
  },
  {
    id: "alumnos",
    titulo: "Administrá tus alumnos con sencillez",
    descripcion: "Agregá, consultá y gestioná estudiantes de cada curso con sus contactos y teléfonos familiares.",
  },
];

export default function Inicio() {
  return (
    <div className="bg-surface-bg text-text-main font-mulish antialiased overflow-x-hidden selection:bg-accent-violet/20 min-h-screen">
      {/* TopNavBar Neumórfica */}
      <Header />

      <main className="pt-24 sm:pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col lg:flex-row items-center gap-12 relative">
          <div className="flex-1 flex flex-col items-start gap-4 z-10">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neumorphic-inset text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                Plan Gratis disponible (Hasta 4 cursos)
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neumorphic-inset text-[11px] font-extrabold uppercase tracking-wider text-amber-600">
                <span>⚡</span>
                Modo Offline: Funciona sin Wi-Fi
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neumorphic-inset text-[11px] font-extrabold uppercase tracking-wider text-accent-violet">
                <span>🤖</span>
                IA Pedagógica Argentina
              </div>
            </div>

            {/* Titular Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.15]">
              Organizá tu agenda de clases, planificaciones y notas en un{" "}
              <span className="text-accent-violet relative inline-block">
                solo lugar
                <svg
                  className="absolute w-full h-2.5 -bottom-1 left-0 text-accent-violet/30"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>.
            </h1>

            {/* Bajada */}
            <p className="text-sm sm:text-base text-secondary max-w-xl font-medium leading-relaxed">
              Generá exámenes e ideas con Inteligencia Artificial, tomá asistencia en el aula sin internet, llevá el seguimiento de tus alumnos y exportá todo a Excel en 1 clic. Diseñado por y para docentes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Link
                href="/registro"
                className="bg-accent-violet text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg shadow-accent-violet/25 hover:bg-accent-violet/90 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Comenzar 100% Gratis</span>
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
              </Link>
              <Link
                href="/login"
                className="bg-surface-bg neumorphic-raised text-on-surface font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl hover:text-accent-violet active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Ya tengo cuenta</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-secondary font-bold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                Asistente IA Educativo
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                Sin límites de alumnos
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                Exportación directa a Excel
              </div>
            </div>
          </div>

          {/* Imagen Hero con Marco Neumórfico */}
          <div className="flex-1 w-full relative">
            <div className="bg-surface-bg neumorphic-raised rounded-3xl p-3 sm:p-4 border border-white/70 shadow-2xl overflow-hidden group">
              <Image
                alt="Docente organizando su agenda y planificaciones de clase con Organizador Docente"
                title="Docente organizando su agenda y planificaciones con Organizador Docente"
                src="/img-profe.jpg"
                width={1200}
                height={800}
                className="w-full h-auto rounded-2xl object-cover aspect-[3/2] transform group-hover:scale-[1.02] transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </section>

        {/* Bento Grid: Todo lo que resuelve por vos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-accent-violet">
              <span>⚡</span>
              En Pocas Palabras
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Todo lo que resuelve por vos
            </h2>
            <p className="text-sm sm:text-base text-secondary max-w-xl">
              Simplificá tu gestión escolar diaria con herramientas pensadas para la realidad docente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: Agenda (Ocupa 2 col en desktop) */}
            <div className="lg:col-span-2 bg-surface-bg neumorphic-raised rounded-3xl p-7 border border-white/60 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl neumorphic-inset text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl">calendar_month</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface mb-1">1. Agenda y Cronograma Semanal</h3>
                  <p className="text-xs sm:text-sm text-secondary font-medium leading-relaxed max-w-xl">
                    Agendá exámenes, entregas de trabajos prácticos, actos escolares y reuniones con alertas. Visualizá tu semana completa con tus horarios y materias de cada institución.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Asistente IA (Destacado Violeta) */}
            <div className="bg-gradient-to-br from-accent-violet to-violet-900 text-white rounded-3xl p-7 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                ⭐ NOVEDAD
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-sm text-white shrink-0 text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-1">2. Asistente Pedagógico con IA</h3>
                  <p className="text-xs text-white/90 font-medium leading-relaxed">
                    Formulá exámenes a desarrollar con rúbrica, secuencias didácticas y adaptaciones curriculares en segundos.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1 mt-2">
                Conoce tus cursos y alumnos <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </div>

            {/* Bento Card 3: Planificaciones */}
            <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 border border-white/60 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl neumorphic-inset text-emerald-600 shrink-0">
                  <span className="material-symbols-outlined text-2xl">library_books</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface mb-1">3. Planificaciones</h3>
                  <p className="text-xs text-secondary font-medium leading-relaxed">
                    Unidades didácticas, proyectos anuales y documentos pedagógicos centralizados por materia.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Asistencias */}
            <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 border border-white/60 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl neumorphic-inset text-emerald-600 shrink-0">
                  <span className="material-symbols-outlined text-2xl">how_to_reg</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface mb-1">4. Asistencias y Conceptos</h3>
                  <p className="text-xs text-secondary font-medium leading-relaxed">
                    Marcá presentes, ausencias, justificadas y conceptos positivos/negativos en 1 clic aún sin internet.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Card 5: Calificaciones */}
            <div className="bg-surface-bg neumorphic-raised rounded-3xl p-7 border border-white/60 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl neumorphic-inset text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl">bar_chart</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface mb-1">5. Calificaciones Automáticas</h3>
                  <p className="text-xs text-secondary font-medium leading-relaxed">
                    Notas de trabajos prácticos, orales y evaluaciones con cálculo de promedios por trimestre.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Capturas de Módulos */}
        <Features items={items} />

        {/* Sección Excel Export */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-8 sm:p-12 border border-white/60 shadow-xl flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 flex flex-col gap-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-emerald-600 w-fit">
                <span className="material-symbols-outlined text-sm">table_view</span>
                Exportación Pro
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
                Toda tu información lista para entregar a dirección
              </h2>
              <p className="text-xs sm:text-sm text-secondary font-medium leading-relaxed">
                Descargá tus planillas en formato Excel (.xlsx) con un solo clic. Simplificá el cierre de trimestre, la entrega de asistencias mensuales y el reporte de promedios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div className="p-3.5 rounded-2xl neumorphic-inset flex flex-col gap-1">
                  <span className="text-xs font-extrabold text-on-surface">Asistencias</span>
                  <span className="text-[11px] text-secondary">Porcentajes y ausentes calculados.</span>
                </div>
                <div className="p-3.5 rounded-2xl neumorphic-inset flex flex-col gap-1">
                  <span className="text-xs font-extrabold text-on-surface">Calificaciones</span>
                  <span className="text-[11px] text-secondary">Notas trimestrales y finales.</span>
                </div>
                <div className="p-3.5 rounded-2xl neumorphic-inset flex flex-col gap-1">
                  <span className="text-xs font-extrabold text-on-surface">Nóminas</span>
                  <span className="text-[11px] text-secondary">Listado de alumnos y contactos.</span>
                </div>
              </div>
            </div>

            {/* Preview Planilla */}
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold">Planilla_Asistencia_1A.xlsx</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Excel</span>
                </div>
                <div className="p-3 text-[11px] font-mono text-slate-700 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase">
                        <th className="p-1.5 font-bold">Estudiante</th>
                        <th className="p-1.5 text-center font-bold">Clase 1</th>
                        <th className="p-1.5 text-center font-bold">Clase 2</th>
                        <th className="p-1.5 text-center font-bold">Clase 3</th>
                        <th className="p-1.5 text-center font-bold text-emerald-600">% Asist.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="p-1.5 font-medium">García, Ana</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center font-bold text-emerald-600">100%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-1.5 font-medium">López, Martín</td>
                        <td className="p-1.5 text-center text-red-500 font-bold">A</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center font-bold text-amber-600">66%</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-medium">Pérez, Juan</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center text-emerald-600 font-bold">P</td>
                        <td className="p-1.5 text-center font-bold text-emerald-600">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Dispositivos */}
        <InfoDispositivos />

        {/* Sección Planes y Precios */}
        <Planes />

        {/* Sección Preguntas Frecuentes */}
        <Faq />

        {/* CTA Final */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl text-center flex flex-col items-center gap-4 relative overflow-hidden border border-white/20">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-sm">
              🚀 Empezá hoy mismo
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ¿Listo para simplificar tu trabajo docente?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl font-medium leading-relaxed">
              Unite a miles de docentes que ya ahorran horas cada semana organizando sus clases, asistencias y planificaciones desde un solo lugar.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
              <Link
                href="/registro"
                className="bg-white text-accent-violet font-extrabold text-xs uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-xl hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Crear Cuenta Gratis</span>
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
              </Link>
              <a
                href="https://cv-sigma-umber.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-white/40 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Contactar Soporte</span>
                <span className="material-symbols-outlined text-sm">mail</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Botón Flotante Mobile */}
      <StickyMobileCta />
    </div>
  );
}