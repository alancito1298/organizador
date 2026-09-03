'use client';

import Link from 'next/link';

interface FeatureItem {
  id: string;
  titulo: string;
  descripcion: string;
}

// Marco de ventana de aplicación para que no se confunda con la tarjeta exterior
function AppWindowFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-300/80 bg-slate-900 shadow-md flex flex-col font-mulish select-none">
      {/* Barra superior de ventana de sistema */}
      <div className="bg-slate-800/95 px-3 py-1.5 flex items-center justify-between border-b border-slate-700/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500/90"></span>
          <span className="w-2 h-2 rounded-full bg-amber-500/90"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500/90"></span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wide">
          {url}
        </span>
        <div className="w-6"></div>
      </div>
      {/* Pantalla interior de la App */}
      <div className="bg-[#e9edf3] p-3.5 min-h-[190px] flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

// 1. Mockup Modo Offline (Estilo idéntico a OfflineIndicator del sistema)
function MockupOffline() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/offline">
      <div className="flex flex-col gap-2.5">
        {/* Banner Offline nativo de la app */}
        <div className="bg-amber-500 text-white px-3 py-2 rounded-xl shadow-sm flex items-center gap-2.5 border border-amber-400/30">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200"></span>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[10px] uppercase tracking-wider leading-tight">Modo Offline en Aula</p>
            <p className="text-[9px] text-amber-100 truncate">Sin internet. Datos guardados en tu celular.</p>
          </div>
        </div>

        {/* Fila del curso en cola */}
        <div className="bg-surface-bg rounded-xl p-2.5 neumorphic-raised border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-[11px] text-on-surface">3° 1° · Biología</div>
            <div className="text-[9px] text-secondary">26 asistencias tomadas hoy</div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-extrabold text-[9px]">
            Listo para sinc.
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[10px] text-secondary font-semibold">
        <span className="flex items-center gap-1 text-accent-violet font-extrabold">
          <span className="material-symbols-outlined text-xs">cloud_sync</span>
          Sincronización automática
        </span>
        <span className="text-[9px] bg-slate-200 px-2 py-0.5 rounded-md text-slate-600 font-bold">Local</span>
      </div>
    </AppWindowFrame>
  );
}

// 2. Mockup Asistente Pedagógico IA (Estilo idéntico a ChatbotIA modal)
function MockupIA() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/chatbot-ia">
      {/* Header del Chatbot */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-2 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🤖</span>
          <div>
            <div className="font-extrabold text-[10px] leading-tight flex items-center gap-1">
              Asistente Pedagógico IA
              <span className="bg-amber-400 text-amber-950 text-[8px] font-black px-1.5 py-0.2 rounded">PLUS</span>
            </div>
            <div className="text-[8px] text-white/80">Secuencias y exámenes en segundos</div>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]"></span>
      </div>

      {/* Burbujas de chat */}
      <div className="flex flex-col gap-1.5 my-auto">
        <div className="self-end bg-primary text-white text-[9px] font-medium py-1.5 px-2.5 rounded-xl rounded-br-none max-w-[85%] shadow-sm">
          Armame un examen de 4 preguntas de Historia para 3° año.
        </div>
        <div className="self-start bg-white text-on-surface border border-outline-variant text-[9px] font-medium p-2 rounded-xl rounded-bl-none max-w-[92%] shadow-sm flex flex-col gap-1">
          <span className="font-extrabold text-accent-violet flex items-center gap-1 text-[9px]">
            <span className="material-symbols-outlined text-[10px]">check_circle</span>
            Evaluación conceptual generada
          </span>
          <span className="text-secondary text-[8px] line-clamp-1">
            1. Analizá las causas del virreinato y la revolución...
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-200/80">
        <span className="text-primary font-bold flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[10px]">content_copy</span> Copiar
        </span>
        <span className="text-secondary font-bold">Adaptación DUA lista</span>
      </div>
    </AppWindowFrame>
  );
}

// 3. Mockup Gestión de Cursos (Estilo idéntico a Sticker de Actividad en Menu.tsx)
function MockupCursos() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/cursos">
      {/* Sticker oficial de Menu.tsx */}
      <div className="bg-surface-bg rounded-2xl p-3 neumorphic-raised border-l-[5px] border-l-accent-violet flex flex-col justify-between shadow-sm my-auto">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="font-extrabold text-[10px] text-accent-violet flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              08:00 - 09:20 hs
            </span>
            <span className="px-1.5 py-0.5 rounded-md neumorphic-inset font-extrabold text-[9px] text-accent-violet">
              3° 1°
            </span>
          </div>

          <h4 className="font-extrabold text-xs text-on-surface uppercase truncate leading-tight">
            HISTORIA ARGENTINA
          </h4>
          <p className="text-[10px] text-secondary font-medium truncate flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[11px]">domain</span>
            E.E.S. N° 4 "San Martín"
          </p>
        </div>

        <div className="mt-2.5 pt-1.5 border-t border-outline-variant/30">
          <div className="w-full py-1 px-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm">
            <span>Ir al curso</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </div>
        </div>
      </div>
    </AppWindowFrame>
  );
}

// 4. Mockup Asistencias (Estilo idéntico al botón de asistencia y filas de AlumnosClient.tsx)
function MockupAsistencias() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/asistencias">
      <div className="flex flex-col gap-2 my-auto">
        {/* Botón dinámico con Badge de AlumnosClient */}
        <div className="p-2 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-accent-violet">how_to_reg</span>
            <span className="font-black text-[11px] text-on-surface uppercase">Asistencia</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Cargadas
          </span>
        </div>

        {/* Fila de alumno con estado P y Concepto */}
        <div className="p-2 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-[10px] shadow-sm">
              P
            </span>
            <div className="flex flex-col">
              <span className="font-extrabold text-[10px] text-on-surface">Pérez, Mateo</span>
              <span className="text-[8px] text-secondary">Presentismo: 95%</span>
            </div>
          </div>
          <span className="text-[9px] font-extrabold text-accent-violet bg-violet-100 px-2 py-0.5 rounded-md">
            + Concepto 😊
          </span>
        </div>
      </div>

      <div className="text-center text-[9px] font-bold text-secondary">
        Trimestre Activo: 1° · Planilla Guardada
      </div>
    </AppWindowFrame>
  );
}

// 5. Mockup Toda tu Información / Agenda (Estilo idéntico a Agenda en Menu.tsx)
function MockupAgenda() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/agenda">
      <div className="flex flex-col gap-2 my-auto">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-violet flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">sticky_note_2</span>
            Recordatorio de Hoy
          </span>
          <span className="text-[9px] font-extrabold text-accent-violet px-2 py-0.5 rounded-full neumorphic-inset">
            2 eventos
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-bg neumorphic-raised border-l-[4px] border-l-rose-500 flex items-center justify-between shadow-sm">
          <div>
            <div className="font-extrabold text-[10px] text-on-surface">Examen Trimestral Historia</div>
            <div className="text-[8px] text-secondary">08:00 hs · 3° 1° Sec. 4</div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[8px] font-black uppercase">
            Examen
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-bg neumorphic-raised border-l-[4px] border-l-accent-violet flex items-center justify-between shadow-sm">
          <div>
            <div className="font-extrabold text-[10px] text-on-surface">Entrega Planificación Anual</div>
            <div className="text-[8px] text-secondary">11:30 hs · Dirección</div>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-violet-100 text-accent-violet text-[8px] font-black uppercase">
            Secuencia
          </span>
        </div>
      </div>

      <div className="text-center text-[9px] font-extrabold text-accent-violet">
        Agenda, horarios y materias sincronizadas
      </div>
    </AppWindowFrame>
  );
}

// 6. Mockup Calificaciones (Estilo idéntico a tarjeta de Destacados en AlumnosClient.tsx:1063)
function MockupCalificaciones() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/calificaciones">
      {/* Tarjeta idéntica a Top Notas de AlumnosClient */}
      <div className="bg-gradient-to-br from-violet-50/90 via-purple-50/40 to-white rounded-xl p-3 flex flex-col justify-between border border-violet-200/80 shadow-sm my-auto">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-[11px] text-violet-950 uppercase font-black leading-tight">
            MATEO PÉREZ
          </h4>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-300/60 text-[9px] font-bold">
            <span className="material-symbols-outlined text-xs text-violet-600">workspace_premium</span>
            Top Notas
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 py-1.5 px-1 rounded-lg bg-violet-100/35 border border-violet-200/50 mb-2 text-center text-[9px]">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-violet-800 uppercase font-bold">1° Trim</span>
            <span className="font-black text-[11px] text-violet-950">9.50</span>
          </div>
          <div className="flex flex-col items-center border-x border-violet-200/60">
            <span className="text-[8px] text-violet-800 uppercase font-bold">Asist.</span>
            <span className="font-black text-[11px] text-emerald-600">100%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-violet-800 uppercase font-bold">Prom.</span>
            <span className="font-black text-[11px] text-violet-950">9.50</span>
          </div>
        </div>

        <div className="w-full py-1 rounded-lg bg-white text-emerald-800 border border-emerald-300 text-center font-bold text-[9px] uppercase tracking-wider">
          Ver Alumno
        </div>
      </div>
    </AppWindowFrame>
  );
}

// 7. Mockup Administrá tus Alumnos (Estilo idéntico a Nómina en AlumnosClient.tsx)
function MockupAlumnos() {
  return (
    <AppWindowFrame url="app.organizadordocente.com/alumnos">
      <div className="flex flex-col gap-2 my-auto">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary">
            Nómina de Alumnos (31)
          </span>
          <span className="text-[9px] font-bold text-accent-violet">Activos</span>
        </div>

        {/* Fila de alumno oficial de la app */}
        <div className="p-2 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-accent-violet text-white font-extrabold flex items-center justify-center text-[10px] shrink-0">
              LG
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-[10px] text-on-surface truncate">López, Gonzalo N.</div>
              <div className="text-[8px] text-secondary truncate">DNI 48.912.345</div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="p-1 rounded-lg neumorphic-inset text-amber-700 text-[9px]" title="Concepto">
              😊
            </span>
            <span className="p-1 rounded-lg neumorphic-raised text-emerald-700 text-[10px]" title="WhatsApp">
              <span className="material-symbols-outlined text-[12px] block">call</span>
            </span>
          </div>
        </div>

        <div className="p-1.5 rounded-lg neumorphic-inset text-center text-[9px] font-bold text-accent-violet">
          Ficha pedagógica y teléfono de contacto
        </div>
      </div>

      <div className="text-center text-[9px] text-secondary font-medium">
        Edición ágil de estudiantes y legajos
      </div>
    </AppWindowFrame>
  );
}

// Diccionario de componentes genéricos por ID de módulo
function renderMockup(id: string) {
  switch (id) {
    case 'offline':
      return <MockupOffline />;
    case 'ia':
      return <MockupIA />;
    case 'cursos':
      return <MockupCursos />;
    case 'asistencias':
      return <MockupAsistencias />;
    case 'agenda':
      return <MockupAgenda />;
    case 'calificaciones':
      return <MockupCalificaciones />;
    case 'alumnos':
      return <MockupAlumnos />;
    default:
      return <MockupCursos />;
  }
}

export default function Features({ items }: { items: FeatureItem[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto font-mulish" id="modulos">
      <div className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full neumorphic-inset text-xs font-extrabold uppercase tracking-wider text-accent-violet">
          <span className="material-symbols-outlined text-sm">widgets</span>
          Módulos Integrales
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Diseñado para simplificar tu labor en el aula
        </h2>
        <p className="text-sm sm:text-base text-secondary">
          Cada herramienta está pensada para ahorrarte horas de trabajo administrativo y trámites escolares.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface-bg neumorphic-raised rounded-3xl p-6 border border-white/60 shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Componente Genérico de la App dentro de un Marco de Ventana */}
            <div className="w-full mb-5">
              {renderMockup(item.id)}
            </div>

            <div className="flex flex-col flex-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-on-surface mb-2 flex items-center gap-2">
                {item.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-5 font-medium flex-1">
                {item.descripcion}
              </p>

              <Link
                href="/registro"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-accent-violet hover:underline group-hover:translate-x-0.5 transition-transform"
              >
                <span>Probar función gratis</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}