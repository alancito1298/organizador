'use client';

import Image from "next/image";
import { Book, Rocket, ArrowRight, Download, CheckCircle2, Calendar, Library, CheckSquare, BarChart2, FileSpreadsheet, Smartphone, Sparkles, Mail } from "lucide-react";
import Features from "./Features";
import Planes from "./PlanesPrecios";
import Header from "../shared/Header";
import Footer from "../shared/Footer";
import InfoDispotivos from "./InfoDispositivos";
import Faq from "./Faq";
import StickyMobileCta from "./StickyMobileCta";

const items = [
  {
    titulo: "✔ Crear y gestionar cursos fácilmente",
    descripcion: "Organizá todas tus materias en segundos, separando cursos, años y contenido sin complicaciones.",
    icono: Book,
    imagen: "/cursos-img.jpeg",
    alt: "Captura de pantalla de la interfaz de gestión de cursos, escuelas y materias en Organizador Docente",
  },
  {
    titulo: "✔ Registrar asistencia y concepto en segundos",
    descripcion: "Marcá el registro de tus clases con tan solo un click. Visual ágil y rápida.",
    icono: Book,
    imagen: "/asistencias-img.jpeg",
    alt: "Planilla digital de toma de asistencia escolar diaria, ausentes y conceptos pedagógicos",
  },
  {
    titulo: "✔ Tener toda tu información en un solo lugar",
    descripcion: "Agenda, Planificaciones, Calificaciones, Horarios, Asistencia, Conceptos y Recordatorios unificados.",
    icono: Book,
    imagen: "/agenda-img.jpeg",
    alt: "Calendario y agenda docente interactiva con recordatorios de exámenes y eventos escolares",
  },
  {
    titulo: "✔ Seguimiento organizado de calificaciones",
    descripcion: "Agregá, ordená, consultá y editá calificaciones fácilmente con promedios automáticos.",
    icono: Book,
    imagen: "/calificaciones-img.jpeg",
    alt: "Registro de calificaciones escolares, notas de evaluaciones y promedios automáticos por trimestre",
  },
  {
    titulo: "✔ Administrá tus alumnos con sencillez",
    descripcion: "Agregá, borrá, consultá y editá estudiantes de cada curso con un solo click.",
    icono: Book,
    imagen: "/alumnos-img.jpeg",
    alt: "Listado completo de estudiantes inscritos y datos de contacto de las familias por curso",
  },
  {
    titulo: "✔ Seguimiento detallado de cada alumno",
    descripcion: "Visualizá todas las estadísticas de cada alumno para tener un seguimiento más preciso y personalizado.",
    icono: Book,
    imagen: "/detalle-alumno-img.jpeg",
    alt: "Ficha individual de estudiante con historial de asistencias y desempeño pedagógico",
  },
];

export default function Inicio() {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col selection:bg-violet-200 selection:text-violet-950">
      
      {/* NAVBAR */}
      <Header />

      <main className="flex-1 pt-20 md:pt-24">
        
        {/* HERO SECTION */}
        <section className="px-4 sm:px-8 py-12 md:py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          
          {/* Fondo Decorativo */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-violet-100/60 to-transparent -z-10 rounded-bl-[100px] pointer-events-none" />

          {/* COLUMNA IZQUIERDA: TEXTO HERO */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 z-10">
            
            {/* BADGE PLAN GRATIS */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-500/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Plan 100% Gratis disponible (hasta 2 cursos) — Sin tarjeta</span>
            </div>

            {/* H1 TITLE */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-violet-950 leading-tight tracking-tight max-w-2xl">
              Organizá tu agenda de clases, planificaciones y notas en un{" "}
              <span className="text-violet-700 relative inline-block">
                solo lugar
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>.
            </h1>

            {/* SUBTITLE */}
            <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed mt-2">
              Tomá asistencia, llevá el seguimiento de tus alumnos y exportá todo a Excel en 1 clic. Diseñado por y para docentes reales para reducir tu carga administrativa.
            </p>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4 w-full sm:w-auto">
              <a
                href="/registro"
                className="bg-violet-950 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-violet-900 transition shadow-md flex items-center gap-2"
              >
                <span>Registrarme Gratis</span>
                <Rocket size={16} className="text-yellow-400" />
              </a>

              <a
                href="/login"
                className="bg-violet-50 text-violet-950 font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl hover:bg-violet-100 transition flex items-center gap-2 border border-violet-200"
              >
                <span>Iniciar Sesión</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* BADGES RÁPIDOS */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-6 text-xs text-gray-500 font-medium border-t border-violet-100 pt-4 w-full">
              <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Agenda</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Planificaciones</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Asistencia</div>
            </div>
          </div>

          {/* COLUMNA DERECHA: IMAGEN CON EFECTO 3D */}
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-0 bg-violet-200/50 rounded-2xl transform rotate-3 scale-105 transition-transform duration-500 group-hover:rotate-6 -z-10" />
            <Image
              src="/img-profe.jpg"
              alt="Docente organizando su agenda y planificaciones de clase con Organizador Docente"
              title="Docente organizando su agenda y planificaciones con Organizador Docente"
              width={1200}
              height={800}
              className="w-full h-auto rounded-2xl shadow-2xl relative z-10 object-cover aspect-[3/2] border border-violet-200 transform transition-transform duration-500 hover:scale-[1.02]"
              priority
            />
          </div>
        </section>

        {/* TL;DR BENTO GRID SECTION */}
        <section className="bg-violet-50/70 py-16 px-4 sm:px-8 border-y border-violet-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-yellow-400 text-violet-950 font-extrabold text-xs px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                ⚡ TL;DR — En Resumen
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-violet-950 uppercase tracking-tight">
                5 puntos clave que resuelve
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1 (Large) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-violet-200/70 shadow-sm hover:shadow-md transition flex flex-col justify-between relative overflow-hidden group">
                <div className="w-12 h-12 rounded-xl bg-violet-950 text-white flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-violet-950 mb-2">1. Agenda Docente</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                    Agendá exámenes, entregas y eventos escolares con alertas. Visualizá toda tu semana de un vistazo y nunca olvides una fecha importante.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 border border-violet-200/70 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-violet-800 text-white flex items-center justify-center mb-4">
                  <Library size={24} />
                </div>
                <h3 className="text-xl font-bold text-violet-950 mb-2">2. Planificaciones</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Secuencias didácticas, unidades y archivos en un solo lugar.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 border border-violet-200/70 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                  <CheckSquare size={24} />
                </div>
                <h3 className="text-xl font-bold text-violet-950 mb-2">3. Asistencias</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Marcá presente, ausente y concepto pedagógico en 1 clic.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-6 border border-violet-200/70 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4">
                  <BarChart2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-violet-950 mb-2">4. Calificaciones</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Notas de trabajos y evaluaciones con promedio automático.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-gradient-to-br from-violet-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-yellow-400 flex items-center justify-center mb-4">
                  <FileSpreadsheet size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">5. Exportar a Excel</h3>
                <p className="text-sm text-violet-200 leading-relaxed">
                  Descargá todas tus planillas a .xlsx listas para presentar a directivos.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ¿CÓMO FUNCIONA? FEATURES SECTION */}
        <Features items={items} />

        {/* PLANES Y PRECIOS SECTION */}
        <Planes />

        {/* EXCEL EXPORT SECTION */}
        <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <div className="flex-1 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <FileSpreadsheet size={14} /> Exportación instantánea
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-extrabold text-violet-950 uppercase tracking-tight">
                Toda tu información lista para imprimir
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Descargá tus planillas en formato Excel (.xlsx) listas para presentar. Simplificá el cierre de notas y el envío de informes a dirección.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-violet-950 text-base">Asistencias</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Exportá la asistencia mensual con porcentajes automáticos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="p-2 bg-violet-700 text-white rounded-lg shrink-0">
                    <BarChart2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-violet-950 text-base">Calificaciones</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Descargá las notas por trimestre con promedios finales calculados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
                    <Book size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-violet-950 text-base">Alumnos</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Listados completos de tus alumnos con sus datos de contacto.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MOCKUP TABLA EXCEL */}
            <div className="flex-1 w-full relative">
              <div className="bg-white rounded-2xl shadow-xl border border-violet-200 overflow-hidden flex flex-col">
                <div className="bg-emerald-800 px-4 py-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-yellow-300" />
                    <span className="text-xs font-mono font-bold">asistencias_curso_tecnologia.xlsx</span>
                  </div>
                  <a
                    href="/"
                    download="asistencias_Escuela_n22_5TIC.xlsx"
                    className="text-[11px] bg-emerald-950 hover:bg-emerald-900 text-emerald-200 px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition"
                  >
                    <Download size={12} />
                    <span>Ejemplo</span>
                  </a>
                </div>

                <div className="p-4 overflow-x-auto bg-slate-50">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-emerald-100 text-emerald-900 font-bold">
                        <th className="p-2 text-left border border-slate-200">Alumno</th>
                        <th className="p-2 text-center border border-slate-200">12/04</th>
                        <th className="p-2 text-center border border-slate-200">19/04</th>
                        <th className="p-2 text-center border border-slate-200">26/04</th>
                        <th className="p-2 text-center border border-slate-200">% Asist.</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-slate-100">
                        <td className="p-2 border-r border-slate-200 font-semibold text-gray-800">Pérez, Juan</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center border-r border-slate-200 text-rose-600 font-bold">A</td>
                        <td className="p-2 text-center font-bold text-gray-700">67%</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="p-2 border-r border-slate-200 font-semibold text-gray-800">García, Ana</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center font-bold text-gray-700">100%</td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-slate-200 font-semibold text-gray-800">López, Martín</td>
                        <td className="p-2 text-center border-r border-slate-200 text-amber-600 font-bold">J</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center border-r border-slate-200 text-emerald-600 font-bold">P</td>
                        <td className="p-2 text-center font-bold text-gray-700">85%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* INFO DISPOSITIVOS */}
        <InfoDispotivos />

        {/* FAQ */}
        <Faq />

        {/* FINAL CTA SECTION */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl border border-violet-800 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mb-3">
                ¿Tenés más dudas?
              </h2>
              <p className="text-violet-200 text-base sm:text-lg mb-8">
                Estamos acá para ayudarte a simplificar tu día a día. Escribinos o comenzá a probar la plataforma gratis hoy mismo.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <a
                  href="/registro"
                  className="bg-yellow-400 hover:bg-yellow-300 text-violet-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <span>Registrarme Gratis</span>
                  <Rocket size={16} />
                </a>
                <a
                  href="https://cv-sigma-umber.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition flex items-center gap-2"
                >
                  <Mail size={16} />
                  <span>Contactar Soporte</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />

      {/* STICKY MOBILE CTA */}
      <StickyMobileCta />

    </div>
  );
}