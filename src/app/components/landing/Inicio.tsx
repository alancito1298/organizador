'use client';

import Image from "next/image";
import Features from "./Features";
import Planes from "./PlanesPrecios";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import InfoDispositivos from "./InfoDispositivos";
import Faq from "./Faq";
import StickyMobileCta from "./StickyMobileCta";

const items = [
  {
    titulo: "⚡ Modo Offline en el Aula",
    descripcion: "¿Poca señal o sin Wi-Fi en tu escuela? Tomá asistencia y cargá notas sin internet. Tus datos se guardan en tu dispositivo y se sincronizan al reconectar.",
    imagen: "/asistencias-img.jpeg",
    alt: "Modo sin conexión offline para tomar asistencia y notas escolares en el aula sin internet",
  },
  {
    titulo: "🤖 Asistente Pedagógico con IA",
    descripcion: "Generá secuencias didácticas, exámenes listos para imprimir, rúbricas y adaptaciones curriculares en segundos con Inteligencia Artificial.",
    imagen: "/cursos-img.jpeg",
    alt: "Asistente de inteligencia artificial para docentes para crear planificaciones y exámenes",
  },
  {
    titulo: "Crear y gestionar cursos fácilmente",
    descripcion: "Organizá todas tus materias en segundos, separando cursos, años y contenido sin complicaciones.",
    imagen: "/cursos-img.jpeg",
    alt: "Captura de pantalla de la interfaz de gestión de cursos, escuelas y materias en Organizador Docente",
  },
  {
    titulo: "Registrar asistencia y concepto",
    descripcion: "Marcá el registro de tus clases con tan solo un click. Visual ágil y rápida.",
    imagen: "/asistencias-img.jpeg",
    alt: "Planilla digital de toma de asistencia escolar diaria, ausentes y conceptos pedagógicos",
  },
  {
    titulo: "Toda tu información en un solo lugar",
    descripcion: "Agenda, Planificaciones, Calificaciones, Horarios, Asistencia, Conceptos y Recordatorios unificados.",
    imagen: "/agenda-img.jpeg",
    alt: "Calendario y agenda docente interactiva con recordatorios de exámenes y eventos escolares",
  },
  {
    titulo: "Seguimiento de calificaciones",
    descripcion: "Agregá, ordená, consultá y editá calificaciones fácilmente con promedios automáticos.",
    imagen: "/calificaciones-img.jpeg",
    alt: "Registro de calificaciones escolares, notas de evaluaciones y promedios automáticos por trimestre",
  },
  {
    titulo: "Administrá tus alumnos con sencillez",
    descripcion: "Agregá, borrá, consultá y editá estudiantes de cada curso con un solo click.",
    imagen: "/alumnos-img.jpeg",
    alt: "Listado completo de estudiantes inscritos y datos de contacto de las familias por curso",
  },
];

export default function Inicio() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-secondary-container selection:text-on-secondary-container">

      {/* TopNavBar */}
      <Header />

      <main className="pt-24 md:pt-32">

        {/* Hero Section */}
        <section className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col lg:flex-row items-center gap-xl relative overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-surface-lavender to-transparent -z-10 rounded-bl-[100px] opacity-70" />

          <div className="flex-1 flex flex-col items-start gap-md z-10">
            <div className="flex flex-wrap gap-xs mb-xs">
              <div className="inline-flex items-center gap-xs bg-success-green/10 text-success-green px-sm py-xs rounded-full font-label-md text-label-md border border-success-green/20">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                Plan 100% Gratis disponible (hasta 4 cursos)
              </div>
              <div className="inline-flex items-center gap-xs bg-amber-500/15 text-amber-900 border border-amber-500/30 font-bold px-sm py-xs rounded-full font-label-md text-label-md shadow-sm">
                <span>⚡</span> Modo Offline: Funciona sin Internet
              </div>
              <div className="inline-flex items-center gap-xs bg-tertiary-fixed text-on-tertiary-fixed font-bold px-sm py-xs rounded-full font-label-md text-label-md shadow-sm">
                <span>🤖</span> IA Pedagógica
              </div>
            </div>

            <h1 className="font-display-lg text-display-lg text-primary max-w-2xl">
              Organizá tu agenda de clases, planificaciones y notas en un{" "}
              <span className="text-secondary relative whitespace-nowrap">
                solo lugar
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-tertiary-fixed" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>.
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Generá exámenes e ideas con IA, tomá asistencia, llevá el seguimiento de tus alumnos y exportá todo a Excel en 1 clic. Diseñado por y para docentes.
            </p>

            <div className="flex flex-wrap items-center gap-sm mt-sm">
              <a className="bg-primary text-white font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-all shadow-md flex items-center gap-xs" href="/registro">
                Registrarme Gratis
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </a>
              <a className="bg-surface-lavender text-secondary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-surface-container transition-all flex items-center gap-xs" href="/login">
                Iniciar Sesión
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-md mt-md text-sm text-on-surface-variant font-label-sm">
              <div className="flex items-center gap-base"><span className="material-symbols-outlined text-[16px] text-success-green">check_circle</span> 🤖 Asistente IA</div>
              <div className="flex items-center gap-base"><span className="material-symbols-outlined text-[16px] text-success-green">check_circle</span> Agenda y Horarios</div>
              <div className="flex items-center gap-base"><span className="material-symbols-outlined text-[16px] text-success-green">check_circle</span> Planificaciones</div>
              <div className="flex items-center gap-base"><span className="material-symbols-outlined text-[16px] text-success-green">check_circle</span> Exportar a Excel</div>
            </div>
          </div>

          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6" />
            <Image
              alt="Docente organizando su agenda y planificaciones de clase con Organizador Docente"
              title="Docente organizando su agenda y planificaciones con Organizador Docente"
              src="/img-profe.jpg"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl shadow-xl relative z-10 object-cover aspect-[3/2] border border-outline-variant/30 transform transition-transform duration-500 hover:scale-[1.02]"
              priority
            />
          </div>
        </section>

        {/* TL;DR Features Bento Grid */}
        <section className="bg-surface-container-low py-xl px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-xl">
            <div className="inline-block bg-tertiary-fixed text-on-tertiary-fixed font-label-sm px-sm py-xs rounded-full mb-md uppercase tracking-wider font-bold">⚡ En pocas palabras</div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Todo lo que resuelve por vos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md max-w-6xl mx-auto">
            {/* Card 1 (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 bg-surface rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform" />
              <div>
                <div className="w-12 h-12 bg-primary-container text-white rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-sm">1. Agenda Docente</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Agendá exámenes, entregas y eventos escolares con alertas. Visualiza toda tu semana de un vistazo y nunca olvides una fecha importante.</p>
              </div>
            </div>
            {/* Card 2: Asistente IA (Destacado) */}
            <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-xl p-lg shadow-md hover:shadow-lg transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm px-md py-xs rounded-bl-lg font-bold">
                ⭐ NUEVO
              </div>
              <div className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center mb-md text-2xl">
                🤖
              </div>
              <h3 className="font-headline-md text-headline-md mb-sm text-white">2. Asistente Pedagógico IA</h3>
              <p className="font-body-md text-body-md text-white/90">Generá exámenes listos para imprimir, secuencias didácticas y adaptaciones de aula en segundos.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-secondary-container text-white rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">3. Planificaciones</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Secuencias didácticas, unidades y archivos en un solo lugar.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-success-green/20 text-success-green rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">4. Asistencias</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Marcá presente, ausente y concepto pedagógico en 1 clic.</p>
            </div>
            {/* Card 5 */}
            <div className="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">5. Calificaciones</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Notas de trabajos y evaluaciones con promedio automático.</p>
            </div>
            {/* Card 6 */}
            <div className="bg-surface rounded-xl p-lg border border-outline-variant shadow-sm hover:shadow-md transition-shadow group bg-gradient-to-br from-surface to-surface-lavender">
              <div className="w-12 h-12 bg-deep-indigo text-white rounded-lg flex items-center justify-center mb-md">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-sm">6. Exportar a Excel</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Descargá todas tus planillas a .xlsx listas para presentar a directivos.</p>
            </div>
          </div>
        </section>

        {/* How it Works (Screenshots) */}
        <Features items={items} />

        {/* Pricing Section */}
        <Planes />

        {/* Excel Export Section */}
        <section className="py-xl px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-xl">
            <div className="flex-1 space-y-md">
              <h2 className="font-display-lg text-display-lg text-primary">Toda tu información lista para imprimir</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Descargá tus planillas en formato Excel listas para presentar. Simplificá el cierre de notas y el envío de informes a dirección.</p>
              <div className="space-y-sm mt-lg">
                <div className="flex items-start gap-md p-md bg-surface-lavender rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[32px]">checklist</span>
                  <div>
                    <h4 className="font-headline-md text-lg text-primary mb-1">Asistencias</h4>
                    <p className="text-sm text-on-surface-variant">Exportá la asistencia mensual con porcentajes automáticos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-md p-md bg-surface-lavender rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[32px]">grade</span>
                  <div>
                    <h4 className="font-headline-md text-lg text-primary mb-1">Calificaciones</h4>
                    <p className="text-sm text-on-surface-variant">Descargá las notas por trimestre con promedios finales calculados.</p>
                  </div>
                </div>
                <div className="flex items-start gap-md p-md bg-surface-lavender rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-secondary text-[32px]">group</span>
                  <div>
                    <h4 className="font-headline-md text-lg text-primary mb-1">Alumnos</h4>
                    <p className="text-sm text-on-surface-variant">Listados completos de tus alumnos con sus datos de contacto.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-secondary/10 rounded-2xl transform -rotate-3 scale-105 transition-transform duration-500" />
              <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden flex flex-col h-[400px]">
                {/* Fake Spreadsheet Header */}
                <div className="bg-surface-container-high border-b border-outline-variant/50 p-sm flex items-center gap-sm">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-error" />
                    <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" />
                    <div className="w-3 h-3 rounded-full bg-success-green" />
                  </div>
                  <div className="bg-white rounded px-sm py-1 text-xs text-on-surface-variant flex-1 text-center font-mono">Planilla_Asistencia_1A.xlsx</div>
                </div>
                {/* Fake Spreadsheet Body */}
                <div className="flex-1 bg-white p-sm overflow-hidden relative">
                  <div className="grid grid-cols-5 gap-1 text-xs font-mono text-on-surface-variant mb-2">
                    <div className="bg-surface-container-low p-2 font-bold border-b border-r border-outline-variant/20">Alumno</div>
                    <div className="bg-surface-container-low p-2 font-bold border-b border-r border-outline-variant/20">Lunes 4</div>
                    <div className="bg-surface-container-low p-2 font-bold border-b border-r border-outline-variant/20">Miércoles 6</div>
                    <div className="bg-surface-container-low p-2 font-bold border-b border-r border-outline-variant/20">Viernes 8</div>
                    <div className="bg-surface-container-low p-2 font-bold border-b border-outline-variant/20">% Asist.</div>
                    <div className="p-2 border-b border-r border-outline-variant/20">Pérez, Juan</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center text-error border-b border-r border-outline-variant/20">A</div>
                    <div className="p-2 text-center border-b border-outline-variant/20">66%</div>
                    <div className="p-2 border-b border-r border-outline-variant/20">García, Ana</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center border-b border-outline-variant/20">100%</div>
                    <div className="p-2 border-b border-r border-outline-variant/20">López, Martín</div>
                    <div className="p-2 text-center text-error border-b border-r border-outline-variant/20">A</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center text-success-green border-b border-r border-outline-variant/20">P</div>
                    <div className="p-2 text-center border-b border-outline-variant/20">66%</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Device Compatibility */}
        <InfoDispositivos />

        {/* FAQ Section */}
        <Faq />

        {/* CTA Section */}
        <section className="py-xl px-margin-mobile md:px-margin-desktop bg-primary text-white text-center rounded-3xl mx-margin-mobile md:mx-margin-desktop mb-xl overflow-hidden relative shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="font-display-lg text-display-lg mb-sm">¿Tenés más dudas?</h2>
            <p className="font-body-lg text-body-lg text-on-primary/80 mb-lg">Estamos acá para ayudarte a simplificar tu día a día. Escribinos o comenzá a probar la plataforma gratis hoy mismo.</p>
            <div className="flex flex-wrap items-center justify-center gap-md w-full">
              <a className="bg-tertiary-fixed text-on-tertiary-fixed font-label-md px-lg py-sm rounded-lg hover:bg-tertiary transition-colors shadow-md font-bold flex items-center gap-xs" href="/registro">
                Registrarme Gratis
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </a>
              <a className="bg-transparent border border-white text-white font-label-md px-lg py-sm rounded-lg hover:bg-white/10 transition-colors flex items-center gap-xs" href="https://cv-sigma-umber.vercel.app/" target="_blank" rel="noopener noreferrer">
                Contactar Soporte
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Mobile Button */}
      <StickyMobileCta />
    </div>
  );
}