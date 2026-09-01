'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from './BottomNav';
import { getToken } from '@/lib/token';

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

type Usuario = {
  nombre: string;
  apellido: string;
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

const formatearGradoCurso = (anio: string | number | undefined) => {
  if (!anio) return '';
  const str = String(anio).trim();
  const lower = str.toLowerCase();
  if (lower.includes('año') || lower.includes('grado') || lower.includes('to') || lower.includes('do') || lower.includes('ro') || lower.includes('er')) {
    return str;
  }
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    const nombres: Record<number, string> = {
      1: '1er Año',
      2: '2do Año',
      3: '3er Año',
      4: '4to Año',
      5: '5to Año',
      6: '6to Año',
      7: '7mo Año',
    };
    return nombres[num] || `${num}° Año`;
  }
  return `${str}° Año`;
};

export default function Menu() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarAds, setMostrarAds] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [cargandoAgenda, setCargandoAgenda] = useState(true);

  // Trimestre Activo
  const [trimestreActivo, setTrimestreActivo] = useState<number>(1);
  const [modalCerrarTrimestre, setModalCerrarTrimestre] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('trimestreActivo');
    if (saved && [1, 2, 3].includes(Number(saved))) {
      setTrimestreActivo(Number(saved));
    } else {
      setTrimestreActivo(1);
      localStorage.setItem('trimestreActivo', '1');
    }
  }, []);

  const cambiarTrimestre = (t: number) => {
    setTrimestreActivo(t);
    localStorage.setItem('trimestreActivo', String(t));
  };

  const avanzarSiguienteTrimestre = () => {
    if (trimestreActivo < 3) {
      cambiarTrimestre(trimestreActivo + 1);
    } else {
      cambiarTrimestre(1);
    }
    setModalCerrarTrimestre(false);
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error('Error al obtener usuario:', err);
      }
    };

    const fetchCursos = async () => {
      const token = getToken();
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
      const token = getToken();
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

    fetchUsuario();
    fetchCursos();
    fetchAgenda();
  }, []);

  // Cálculo del mes actual y eventos
  const hoy = new Date();
  const currentYear = hoy.getFullYear();
  const currentMonth = hoy.getMonth();
  const currentDay = hoy.getDate();
  const DIAS_COMPLETOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemanaActual = DIAS_COMPLETOS[hoy.getDay()];
  const anioEscolar = `${currentYear} - ${currentYear + 1}`;

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

  const primerNombre = usuario?.nombre ? usuario.nombre.trim().split(' ')[0] : 'Joshua';
  const nombreFormateado = primerNombre ? (primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase()) : 'Docente';

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col antialiased">
      <main className="flex-grow flex flex-col md:flex-row max-w-[1440px] w-full mx-auto pb-24 md:pb-12 pt-32 md:pt-40 px-4 md:px-margin-page gap-gutter">
        {/* Vertical Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-surface-bg neumorphic-raised rounded-3xl p-6 h-fit sticky top-32 mb-12">
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
          </nav>
        </aside>

        {/* Mobile View con toda la información solicitada */}
        <div className="flex flex-col md:hidden w-full gap-6">
          {/* Header Mobile */}
          <header className="flex flex-col gap-1.5 pt-2">
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight font-extrabold">
              Hola {nombreFormateado}
            </h1>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-headline-md text-on-surface text-base font-bold">
                {diaSemanaActual} / {cursos.length > 0 ? `${formatearGradoCurso(cursos[0].anio).toUpperCase()} • ${cursos[0].materia.toUpperCase()}` : 'MATERIA'}
              </span>
              <span className="text-xs text-secondary">{cursos.length > 0 ? `(${cursos[0].escuela})` : ''}</span>
              <Link className="text-accent-violet text-xs font-bold underline ml-1 hover:opacity-80" href="/horario">
                Ver horarios →
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
              <span>Año escolar: {anioEscolar}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full neumorphic-inset text-[10px] font-bold text-accent-violet">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></span>
                En curso
              </span>
            </div>

            {/* ── Indicador de Trimestre (Mobile) ── */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-secondary mt-1">
              <span className="font-semibold text-secondary">Estás viendo:</span>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full neumorphic-inset text-xs font-bold text-accent-violet">
                {trimestreActivo}° Trimestre
              </div>

              <button
                onClick={() => setModalCerrarTrimestre(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-bg neumorphic-raised text-[11px] font-bold text-amber-800 hover:text-amber-900 active:scale-95 transition-all shadow-sm"
                title="Cerrar trimestre actual y pasar al siguiente"
              >
                <span className="material-symbols-outlined text-xs text-amber-600">lock_reset</span>
                {trimestreActivo < 3 ? `Cerrar ${trimestreActivo}° Trimestre` : 'Cerrar 3° Trimestre'}
              </button>
            </div>
          </header>

          {/* Cursos Mobile */}
          <section className="flex flex-col gap-4">
            {cargandoCursos ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={`curso-load-mob-${i}`} className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="w-12 h-5 rounded-md neumorphic-inset"></div>
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="h-4 bg-outline-variant/30 rounded w-3/4"></div>
                      <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cursos.length === 0 ? (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-secondary">school</span>
                <p className="text-xs text-secondary font-medium">Aún no tenés cursos creados.</p>
                <Link href="/cursos" className="px-4 py-1.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider">
                  + Crear Curso
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {cursos.slice(0, 4).map((curso, idx) => (
                  <Link
                    key={curso.id || idx}
                    href={curso.ruta ?? `/sub-menu-curso/${curso.id}/alumnos`}
                    className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center text-accent-violet">
                        <span className="material-symbols-outlined text-2xl">{iconoPorMateria(curso.materia)}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md neumorphic-inset font-extrabold text-[11px] text-accent-violet">
                        {formatearGradoCurso(curso.anio)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline-md-mobile text-on-surface truncate">{curso.materia}</h3>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-1 truncate">
                        <span className="material-symbols-outlined text-[14px]">domain</span>
                        {curso.escuela}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {cursos.length > 0 && (
              <div className="flex justify-end">
                <Link className="font-label-caps text-accent-violet hover:opacity-80 transition-opacity" href="/cursos">
                  VER TODOS
                </Link>
              </div>
            )}
          </section>

          {/* Eventos Programados Mobile */}
          <section className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center">
              <h2 className="font-label-caps text-secondary">
                {eventosMes.length} EVENTOS PROGRAMADOS
              </h2>
              <Link
                href="/agenda"
                className="flex items-center gap-1 text-accent-violet font-bold text-sm hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Agendar
              </Link>
            </div>

            {cargandoAgenda ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={`agenda-load-mob-${i}`} className="bg-surface-bg rounded-xl p-3.5 flex items-center gap-4 neumorphic-raised animate-pulse">
                    <div className="w-12 h-12 rounded-lg neumorphic-inset flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-4 bg-outline-variant/30 rounded w-2/3"></div>
                      <div className="h-3 bg-outline-variant/20 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : eventosMes.length === 0 ? (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-5 text-center">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">event_available</span>
                <p className="text-xs text-secondary font-medium">No hay eventos agendados para este mes.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {eventosMes.slice(0, 5).map((ev, idx) => {
                  const diaNum = ev.fecha ? Number(ev.fecha.split('T')[0].split('-')[2]) : 10;
                  const mesNum = ev.fecha ? Number(ev.fecha.split('T')[0].split('-')[1]) - 1 : currentMonth;
                  const mesNombre = MESES[mesNum] ?? 'Agosto';
                  return (
                    <Link
                      key={ev.id || idx}
                      href="/agenda"
                      className="bg-surface-bg rounded-xl p-3.5 flex items-center gap-4 neumorphic-raised hover:scale-[1.01] active:scale-98 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-lg neumorphic-inset flex flex-col items-center justify-center text-accent-violet shrink-0">
                        <span className="text-[10px] font-bold leading-none uppercase">DÍA</span>
                        <span className="text-lg font-bold leading-none mt-0.5">{diaNum}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="font-bold text-on-surface text-sm truncate">
                          {ev.descripcion}
                        </h4>
                        <span className="text-xs text-secondary mt-0.5">{diaNum} de {mesNombre}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center mt-2 pb-6 border-b border-outline-variant/30">
              <Link
                className="font-label-caps text-accent-violet hover:opacity-80 transition-opacity flex items-center gap-2"
                href="/agenda"
              >
                VER AGENDA COMPLETA <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>

        {/* Main Content Area (Desktop & Tablet) */}
        <div className="hidden md:flex flex-grow w-full max-w-4xl mx-auto md:mx-0 flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col gap-1.5">
            <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface tracking-tight font-extrabold">
              Hola {nombreFormateado}
            </h1>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-headline-md text-on-surface text-lg font-bold">
                {diaSemanaActual} / {cursos.length > 0 ? `${formatearGradoCurso(cursos[0].anio).toUpperCase()} • ${cursos[0].materia.toUpperCase()}` : 'MATERIA'}
              </span>
              <span className="text-sm text-secondary">{cursos.length > 0 ? `(${cursos[0].escuela})` : ''}</span>
              <Link className="text-accent-violet text-xs font-bold underline ml-2 hover:opacity-80" href="/horario">
                Ver horarios →
              </Link>
            </div>
            <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
              <span>Año escolar: {anioEscolar}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full neumorphic-inset text-[10px] font-bold text-accent-violet">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></span>
                En curso
              </span>
            </div>

            {/* ── Indicador de Trimestre (Desktop) ── */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-secondary mt-1">
              <span className="font-semibold text-secondary">Estás viendo:</span>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full neumorphic-inset text-xs font-bold text-accent-violet">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {trimestreActivo}° Trimestre
              </div>

              {/* Selector Rápido */}
              <div className="flex items-center gap-1 bg-surface-bg neumorphic-inset rounded-full p-0.5">
                {[1, 2, 3].map((t) => (
                  <button
                    key={t}
                    onClick={() => cambiarTrimestre(t)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                      trimestreActivo === t
                        ? 'bg-accent-violet text-white shadow-sm'
                        : 'text-secondary hover:text-accent-violet'
                    }`}
                  >
                    {t}° Trim
                  </button>
                ))}
              </div>

              <button
                onClick={() => setModalCerrarTrimestre(true)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-bg neumorphic-raised text-[11px] font-bold text-amber-800 hover:text-amber-900 active:scale-95 transition-all shadow-sm ml-1"
                title="Cerrar trimestre actual y pasar al siguiente"
              >
                <span className="material-symbols-outlined text-sm text-amber-600">lock_reset</span>
                {trimestreActivo < 3 ? `Cerrar ${trimestreActivo}° Trimestre y pasar al ${trimestreActivo + 1}°` : 'Cerrar 3° Trimestre'}
              </button>
            </div>
          </header>

          {/* Mis Cursos Section (Desktop) */}
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-headline-md text-headline-md text-accent-violet uppercase tracking-wide">Mis Cursos</h2>
              {cursos.length > 0 && (
                <Link className="font-label-caps text-accent-violet hover:opacity-80 transition-opacity uppercase tracking-wider" href="/cursos">
                  VER TODOS
                </Link>
              )}
            </div>

            {cargandoCursos ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={`curso-load-desk-${i}`} className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised animate-pulse">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="w-12 h-5 rounded-md neumorphic-inset"></div>
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="h-4 bg-outline-variant/30 rounded w-3/4"></div>
                      <div className="h-3 bg-outline-variant/20 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cursos.length === 0 ? (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-8 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-secondary">school</span>
                <p className="text-sm text-secondary font-medium">Aún no tenés cursos creados.</p>
                <Link href="/cursos" className="px-5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all">
                  + Crear Curso
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cursos.slice(0, 4).map((curso, idx) => (
                  <Link
                    key={curso.id || idx}
                    href={curso.ruta ?? `/sub-menu-curso/${curso.id}/alumnos`}
                    className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center text-accent-violet">
                        <span className="material-symbols-outlined text-2xl">{iconoPorMateria(curso.materia)}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg neumorphic-inset font-extrabold text-[11px] text-accent-violet">
                        {formatearGradoCurso(curso.anio)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-headline-md-mobile text-on-surface truncate">{curso.materia}</h3>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-1 truncate">
                        <span className="material-symbols-outlined text-[14px]">domain</span>
                        {curso.escuela}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Agenda Section (Desktop) */}
          <section className="flex flex-col gap-4 mt-2">
            <div className="flex justify-between items-center px-1">
              <h2 className="font-label-caps text-secondary uppercase tracking-wider">
                {eventosMes.length} EVENTOS PROGRAMADOS
              </h2>
              <Link
                href="/agenda"
                className="flex items-center gap-1 text-accent-violet font-bold text-sm hover:opacity-80 transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Agendar
              </Link>
            </div>

            {cargandoAgenda ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={`agenda-load-desk-${i}`} className="bg-surface-bg rounded-xl p-3.5 flex items-center gap-4 neumorphic-raised animate-pulse">
                    <div className="w-12 h-12 rounded-lg neumorphic-inset flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-4 bg-outline-variant/30 rounded w-2/3"></div>
                      <div className="h-3 bg-outline-variant/20 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : eventosMes.length === 0 ? (
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-secondary mb-1">event_available</span>
                <p className="text-xs text-secondary font-medium">No hay eventos agendados para este mes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eventosMes.slice(0, 6).map((ev, idx) => {
                  const diaNum = ev.fecha ? Number(ev.fecha.split('T')[0].split('-')[2]) : 10;
                  const mesNum = ev.fecha ? Number(ev.fecha.split('T')[0].split('-')[1]) - 1 : currentMonth;
                  const mesNombre = MESES[mesNum] ?? 'Agosto';
                  return (
                    <Link
                      key={ev.id || idx}
                      href="/agenda"
                      className="bg-surface-bg rounded-xl p-3.5 flex items-center gap-4 neumorphic-raised hover:scale-[1.01] active:scale-98 transition-transform"
                    >
                      <div className="w-12 h-12 rounded-lg neumorphic-inset flex flex-col items-center justify-center text-accent-violet shrink-0">
                        <span className="text-[10px] font-bold leading-none uppercase">DÍA</span>
                        <span className="text-lg font-bold leading-none mt-0.5">{diaNum}</span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <h4 className="font-bold text-on-surface text-sm truncate">
                          {ev.descripcion}
                        </h4>
                        <span className="text-xs text-secondary mt-0.5">{diaNum} de {mesNombre}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center mt-4 pb-8 border-b border-outline-variant/30">
              <Link
                className="font-label-caps text-accent-violet hover:opacity-80 transition-opacity flex items-center gap-2"
                href="/agenda"
              >
                VER AGENDA COMPLETA <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
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

      {/* ── Modal de Confirmación para Cerrar Trimestre ── */}
      {modalCerrarTrimestre && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalCerrarTrimestre(false);
          }}
        >
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-5 border border-white/60 shadow-2xl font-mulish">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 neumorphic-inset flex items-center justify-center text-amber-700 text-2xl shrink-0">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <div>
                <h3 className="font-headline-md text-xl text-on-surface uppercase font-bold">
                  {trimestreActivo < 3 ? `Cerrar ${trimestreActivo}° Trimestre` : 'Cerrar 3° Trimestre'}
                </h3>
                <p className="text-xs text-secondary">
                  {trimestreActivo < 3
                    ? `Avanzarás al ${trimestreActivo + 1}° Trimestre para iniciar la nueva etapa de clases.`
                    : 'Has concluido el ciclo lectivo. Puedes reiniciar al 1° Trimestre.'}
                </p>
              </div>
            </div>

            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 text-xs text-secondary flex flex-col gap-2">
              <p className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                Tus registros anteriores se conservan para exportar a Excel / PDF.
              </p>
              <p className="text-secondary">
                La vista activa pasará al nuevo trimestre para registrar asistencias y notas desde cero.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setModalCerrarTrimestre(false)}
                className="flex-1 py-3 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={avanzarSiguienteTrimestre}
                className="flex-1 py-3 rounded-xl bg-accent-violet text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-accent-violet/90 active:scale-95 transition-all"
              >
                {trimestreActivo < 3 ? `Pasar al ${trimestreActivo + 1}° Trimestre →` : 'Reiniciar al 1° Trimestre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav (Mobile) */}
      <BottomNav />
    </div>
  );
}