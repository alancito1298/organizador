'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from './BottomNav';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type Curso = {
  id: number;
  escuela: string;
  anio: string;
  materia: string;
  ruta: string;
};

type AgendaItem = {
  id: number;
  fecha: string;
  descripcion: string;
};

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

// Ícono por materia (fallback a 'menu_book')
const iconoPorMateria = (materia: string): string => {
  const m = materia.toLowerCase();
  if (m.includes('mat') || m.includes('álgebra') || m.includes('cálculo')) return 'functions';
  if (m.includes('hist') || m.includes('geo')) return 'history_edu';
  if (m.includes('leng') || m.includes('lit') || m.includes('español')) return 'menu_book';
  if (m.includes('fís') || m.includes('quím') || m.includes('bio') || m.includes('cien')) return 'science';
  if (m.includes('ed. fís') || m.includes('física') || m.includes('deporte')) return 'sports';
  if (m.includes('music') || m.includes('arte') || m.includes('plást')) return 'palette';
  if (m.includes('tecno') || m.includes('inform') || m.includes('comput')) return 'computer';
  if (m.includes('inglés') || m.includes('idioma') || m.includes('lengua ext')) return 'translate';
  return 'menu_book';
};

export default function Menu() {
  const [mostrarAds, setMostrarAds] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [cargandoAgenda, setCargandoAgenda] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setCargandoCursos(false); return; }
      try {
        const res = await fetch(`${API}/cursos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setCursos([]); return; }
        const data = await res.json();
        setCursos(Array.isArray(data) ? data : []);
      } catch {
        setCursos([]);
      } finally {
        setCargandoCursos(false);
      }
    };

    const fetchAgenda = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setCargandoAgenda(false); return; }
      try {
        const res = await fetch(`${API}/agenda`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setAgenda([]); return; }
        const data = await res.json();
        setAgenda(Array.isArray(data) ? data : []);
      } catch {
        setAgenda([]);
      } finally {
        setCargandoAgenda(false);
      }
    };

    fetchCursos();
    fetchAgenda();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.replace('/');
  };

  // Cálculo del mes actual y eventos
  const hoy = new Date();
  const currentYear = hoy.getFullYear();
  const currentMonth = hoy.getMonth();
  const currentDay = hoy.getDate();

  const primerDia = new Date(currentYear, currentMonth, 1);
  const totalDiasMes = new Date(currentYear, currentMonth + 1, 0).getDate();
  let offsetInicio = primerDia.getDay() - 1;
  if (offsetInicio < 0) offsetInicio = 6;

  const celdasMes: (number | null)[] = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: totalDiasMes }, (_, i) => i + 1)
  ];

  const eventosMes = agenda.filter(item => {
    const [y, m] = item.fecha.split('T')[0].split('-').map(Number);
    return y === currentYear && m === (currentMonth + 1);
  }).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const diasConEvento = new Set(
    eventosMes.map(item => Number(item.fecha.split('T')[0].split('-')[2]))
  );

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col antialiased">
      <main className="flex-grow flex flex-col md:flex-row max-w-[1440px] w-full mx-auto pb-24 md:pb-0 pt-28 md:pt-32 px-4 md:px-margin-page gap-gutter">
        {/* Vertical Sidebar */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-surface-bg neumorphic-raised rounded-3xl p-6 h-fit sticky top-24 mb-12">
          <h3 className="font-headline-md-mobile text-headline-md-mobile text-accent-violet uppercase mb-6 px-4">Menú</h3>
          <nav className="flex flex-col gap-4">
            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/agenda">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_add_on</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Agenda</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/cursos">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>school</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Cursos</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/planificaciones">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>edit_document</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Planificaciones</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/horario">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Horarios</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/planes">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Pagos</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/horario">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>bug_report</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Ayuda</span>
            </Link>

            <Link className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-colors" href="/perfil">
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet">Perfil</span>
            </Link>

            <button
              onClick={cerrarSesion}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-red-600 transition-colors text-left w-full mt-2"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-bg neumorphic-inset flex items-center justify-center group-hover:scale-105 transition-transform text-accent-violet group-hover:text-red-600">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
              </div>
              <span className="font-body-sm text-body-sm font-bold text-accent-violet group-hover:text-red-600">Cerrar Sesión</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Menu Grid (solo mobile) */}
        <div className="flex flex-col md:hidden w-full">
          {/* Page Header Mobile */}
          <div className="text-center mb-8">
            <h1 className="font-headline-md text-headline-md text-accent-violet uppercase mb-4 tracking-wide">¡Hola Docente!</h1>
            <div className="flex justify-center items-center gap-2">
              <h2 className="font-display-lg text-accent-violet uppercase" style={{ fontSize: '2rem', fontWeight: 800 }}>Organizador<br />Docente</h2>
            </div>
          </div>

          {/* Grid de accesos rápidos */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <a href="/agenda" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_add_on</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Agenda</span>
            </a>
            <a href="/cursos" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>school</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Cursos</span>
            </a>
            <a href="/planificaciones" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>edit_document</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Planificaciones</span>
            </a>
            <a href="/horario" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Horarios</span>
            </a>
            <a href="/planes" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Pagos</span>
            </a>
            <a href="/perfil" className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95">
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-accent-violet" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
              </div>
              <span className="font-bold text-sm text-accent-violet uppercase tracking-wide">Perfil</span>
            </a>

            <button
              onClick={cerrarSesion}
              className="bg-surface-bg neumorphic-raised rounded-2xl p-5 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 text-accent-violet hover:text-red-600"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
              </div>
              <span className="font-bold text-sm uppercase tracking-wide">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Content Area (solo desktop) */}
        <div className="hidden md:flex flex-grow w-full max-w-4xl mx-auto md:mx-0 flex-col">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-headline-md text-headline-md text-accent-violet uppercase mb-6 tracking-wide">¡Hola Docente! Tu panel de gestión</h1>
            <div className="flex justify-center items-center gap-3">
              <span className="material-symbols-outlined text-display-lg text-accent-violet">history_edu</span>
              <h2 className="font-display-lg text-display-lg text-accent-violet leading-none uppercase">Organizador<br />Docente</h2>
            </div>
          </div>

          {/* Mis Cursos Recientes Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-headline-md text-headline-md text-accent-violet uppercase tracking-wide">Mis Cursos Recientes</h3>
              <Link className="text-body-sm font-bold text-accent-violet hover:opacity-80 transition-opacity uppercase tracking-wider" href="/cursos">Ver todos</Link>
            </div>

            {/* Skeleton loader */}
            {cargandoCursos && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-surface-bg neumorphic-inset rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-outline-variant/30" />
                      <div className="w-10 h-4 rounded bg-outline-variant/30" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="h-5 w-3/4 rounded bg-outline-variant/30" />
                      <div className="h-4 w-1/2 rounded bg-outline-variant/20" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sin cursos */}
            {!cargandoCursos && cursos.length === 0 && (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
                <span className="material-symbols-outlined text-5xl text-outline-variant">school</span>
                <p className="font-bold text-text-main">Todavía no tenés cursos cargados</p>
                <p className="text-sm text-secondary">Creá tu primer curso para empezar a gestionar tu aula.</p>
                <Link
                  href="/cursos"
                  className="mt-2 px-6 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Crear curso
                </Link>
              </div>
            )}

            {/* Cursos reales (máx 3) */}
            {!cargandoCursos && cursos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cursos.slice(0, 3).map(curso => (
                  <Link
                    key={curso.id}
                    href={curso.ruta ?? `/sub-menu-curso/${curso.id}`}
                    className="bg-surface-bg neumorphic-raised rounded-2xl p-6 flex flex-col gap-4 group cursor-pointer hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent-violet text-3xl">{iconoPorMateria(curso.materia)}</span>
                      </div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">{curso.anio}°</span>
                    </div>
                    <div>
                      <h4 className="font-body-lg font-bold text-text-main mb-1">{curso.materia}</h4>
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">location_city</span>
                        <span className="text-xs truncate">{curso.escuela}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Vista Previa del Mes y Eventos del Mes (solo desktop) */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-violet text-2xl">calendar_month</span>
                <h3 className="font-headline-md text-headline-md text-accent-violet uppercase tracking-wide">
                  {MESES[currentMonth]} {currentYear}
                </h3>
              </div>
              <Link className="text-body-sm font-bold text-accent-violet hover:opacity-80 transition-opacity uppercase tracking-wider flex items-center gap-1" href="/agenda">
                Ver Agenda Completa →
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Mini Calendario */}
              <div className="lg:col-span-5 bg-surface-bg neumorphic-raised rounded-2xl p-6">
                <div className="text-center font-bold text-text-main text-sm mb-4 uppercase tracking-wider pb-2 border-b border-outline-variant/30">
                  {MESES[currentMonth]} {currentYear}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {DIAS_SEMANA.map((d, i) => (
                    <span key={i} className="text-[11px] font-bold text-secondary uppercase">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {celdasMes.map((dia, idx) => {
                    if (!dia) return <div key={idx} className="h-8" />;
                    const esHoy = dia === currentDay;
                    const tieneEvento = diasConEvento.has(dia);
                    return (
                      <div
                        key={idx}
                        className={`h-8 rounded-lg flex flex-col items-center justify-center text-xs font-semibold relative transition-all ${
                          esHoy
                            ? 'bg-accent-violet text-white font-bold shadow-md'
                            : tieneEvento
                            ? 'bg-surface-bg neumorphic-inset text-accent-violet font-bold'
                            : 'text-text-main hover:bg-white/30'
                        }`}
                      >
                        <span>{dia}</span>
                        {tieneEvento && !esHoy && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-violet absolute bottom-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lista de Eventos del Mes */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {eventosMes.length} {eventosMes.length === 1 ? 'evento programado' : 'eventos programados'}
                  </span>
                  <Link
                    href="/agenda"
                    className="text-xs font-bold text-accent-violet hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span> Agendar
                  </Link>
                </div>

                {cargandoAgenda && (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-surface-bg neumorphic-inset rounded-xl p-4 flex gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-lg bg-outline-variant/30 shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-outline-variant/30 rounded w-3/4" />
                          <div className="h-3 bg-outline-variant/20 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!cargandoAgenda && eventosMes.length === 0 && (
                  <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-secondary">event_available</span>
                    <p className="text-sm font-semibold text-text-main">No hay eventos para {MESES[currentMonth]}</p>
                    <p className="text-xs text-secondary">Aprovechá para organizar tus clases, entregas y evaluaciones.</p>
                    <Link
                      href="/agenda"
                      className="mt-2 px-4 py-1.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      Crear evento
                    </Link>
                  </div>
                )}

                {!cargandoAgenda && eventosMes.length > 0 && (
                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                    {eventosMes.map((ev) => {
                      const diaNum = Number(ev.fecha.split('T')[0].split('-')[2]);
                      const esHoy = diaNum === currentDay;
                      return (
                        <div
                          key={ev.id}
                          className={`bg-surface-bg rounded-xl p-3.5 flex items-center gap-3 transition-transform hover:scale-[1.01] ${
                            esHoy ? 'neumorphic-inset border-l-4 border-accent-violet' : 'neumorphic-raised'
                          }`}
                        >
                          <div className="w-11 h-11 rounded-lg bg-surface-bg neumorphic-inset flex flex-col items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold uppercase text-secondary leading-none">Día</span>
                            <span className="text-sm font-extrabold text-accent-violet leading-tight">{diaNum}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{ev.descripcion}</p>
                            <span className="text-[11px] text-secondary">
                              {esHoy ? '📌 Hoy' : `${diaNum} de ${MESES[currentMonth]}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sponsored Banner */}
          {mostrarAds && (
            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="bg-tertiary-fixed-dim text-on-tertiary-fixed text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide border border-outline-variant/30">Patrocinado</span>
                <span className="material-symbols-outlined text-accent-violet">school</span>
                <div className="flex-col">
                  <h4 className="font-body-lg text-body-lg font-bold text-text-main">Diplomatura en Innovación Educativa 2026</h4>
                  <p className="font-body-sm text-body-sm text-secondary">Becas del 50% y puntaje docente homologado para todas las provincias.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a className="px-4 py-2 rounded-lg bg-surface-bg neumorphic-raised text-accent-violet font-bold text-sm whitespace-nowrap" href="https://www.organizadordocente.com" target="_blank" rel="noopener noreferrer">Ver información</a>
                <button
                  onClick={() => setMostrarAds(false)}
                  className="px-4 py-2 rounded-lg bg-surface-bg neumorphic-raised text-secondary font-bold text-sm whitespace-nowrap flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">close</span> Quitar ads
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}