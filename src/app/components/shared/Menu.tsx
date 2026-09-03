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

type ActividadHoy = {
  id: number;
  hora: string;
  materia: string;
  curso: string;
  escuela: string;
  cursoId?: number | null;
};

export default function Menu() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mostrarAds, setMostrarAds] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [actividadesHoy, setActividadesHoy] = useState<ActividadHoy[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(true);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);
  const [cargandoCursos, setCargandoCursos] = useState(true);
  const [cargandoAgenda, setCargandoAgenda] = useState(true);

  // Modal para eliminar curso
  const [cursoAEliminar, setCursoAEliminar] = useState<Curso | null>(null);
  const [eliminandoCurso, setEliminandoCurso] = useState(false);

  // Modal cerrar trimestre
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
      if (!token) {
        setCargandoUsuario(false);
        return;
      }
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error('Error al obtener usuario:', err);
      } finally {
        setCargandoUsuario(false);
      }
    };

    const fetchCursos = async (): Promise<Curso[]> => {
      const token = getToken();
      if (!token) { setCargandoCursos(false); return []; }
      try {
        const res = await fetch(`${API}/cursos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setCursos([]); return []; }
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setCursos(lista);
        return lista;
      } catch {
        setCursos([]);
        return [];
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

    const fetchHorarios = async (cursosList: Curso[] = []) => {
      const token = getToken();
      if (!token) { setCargandoHorarios(false); return; }
      try {
        const res = await fetch(`${API}/horarios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { setActividadesHoy([]); return; }
        const data = await res.json();
        if (!Array.isArray(data)) { setActividadesHoy([]); return; }

        const mapaDiasSemana: Record<number, string> = {
          1: 'Lunes',
          2: 'Martes',
          3: 'Miercoles',
          4: 'Jueves',
          5: 'Viernes',
        };

        const diaHoy = mapaDiasSemana[new Date().getDay()];
        if (!diaHoy) {
          setActividadesHoy([]);
          return;
        }

        const deHoy = data.filter((h: any) => h.dia === diaHoy);

        const parseadas: ActividadHoy[] = deHoy.map((h: any) => {
          let materia = '';
          let curso = '';
          let escuela = '';
          let cursoId: number | null = null;

          if (h.descripcion) {
            try {
              const parsed = JSON.parse(h.descripcion);
              if (parsed && typeof parsed === 'object') {
                materia = parsed.materia || '';
                curso = parsed.curso || '';
                escuela = parsed.escuela || '';
                cursoId = parsed.cursoId ? Number(parsed.cursoId) : null;
              }
            } catch {
              materia = h.descripcion.trim();
            }
          }

          if (!cursoId && materia) {
            const matLower = materia.toLowerCase().trim();
            const encontrado = cursosList.find(
              (c) =>
                c.materia.trim().toLowerCase() === matLower ||
                matLower.includes(c.materia.trim().toLowerCase())
            );
            if (encontrado) {
              cursoId = encontrado.id;
              if (!curso) curso = encontrado.anio;
              if (!escuela) escuela = encontrado.escuela;
            }
          }

          return {
            id: h.id,
            hora: (h.hora || '').replace(/\s+/g, ' ').trim(),
            materia: materia || 'Clase',
            curso,
            escuela,
            cursoId,
          };
        });

        parseadas.sort((a, b) => {
          const numA = parseFloat(a.hora.replace(':', '.'));
          const numB = parseFloat(b.hora.replace(':', '.'));
          return isNaN(numA) || isNaN(numB) ? a.hora.localeCompare(b.hora) : numA - numB;
        });

        setActividadesHoy(parseadas);
      } catch (err) {
        console.error('Error al cargar horarios de hoy:', err);
        setActividadesHoy([]);
      } finally {
        setCargandoHorarios(false);
      }
    };

    const cargarDatos = async () => {
      fetchUsuario();
      const cursosList = await fetchCursos();
      fetchAgenda();
      fetchHorarios(cursosList);
    };

    cargarDatos();
  }, []);

  const handleEliminarCurso = async () => {
    if (!cursoAEliminar) return;
    setEliminandoCurso(true);
    const token = getToken();
    try {
      const res = await fetch(`${API}/cursos/${cursoAEliminar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCursos((prev) => prev.filter((c) => c.id !== cursoAEliminar.id));
        setCursoAEliminar(null);
      } else {
        alert('❌ No se pudo eliminar el curso');
      }
    } catch (err) {
      console.error('Error al eliminar curso:', err);
      alert('❌ Error al eliminar el curso');
    } finally {
      setEliminandoCurso(false);
    }
  };

  // Cálculo del mes actual y eventos
  const hoy = new Date();
  const currentYear = hoy.getFullYear();
  const currentMonth = hoy.getMonth();
  const currentDay = hoy.getDate();
  const DIAS_COMPLETOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const MESES_NOMBRES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const diaSemanaActual = DIAS_COMPLETOS[hoy.getDay()];
  const mesActualNombre = MESES_NOMBRES[currentMonth];
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

  const primerNombre = usuario?.nombre ? usuario.nombre.trim().split(' ')[0] : '';
  const nombreFormateado = primerNombre ? (primerNombre.charAt(0).toUpperCase() + primerNombre.slice(1).toLowerCase()) : 'Docente';

  const renderStickersActividades = () => {
    if (cargandoHorarios) {
      return (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {[1, 2].map((i) => (
            <div key={`stk-load-${i}`} className="w-56 shrink-0 h-24 rounded-2xl bg-surface-bg neumorphic-raised animate-pulse p-3 flex flex-col justify-between">
              <div className="h-4 bg-outline-variant/30 rounded w-1/2"></div>
              <div className="h-5 bg-outline-variant/25 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (actividadesHoy.length === 0) {
      return (
        <div className="p-3.5 rounded-2xl bg-surface-bg neumorphic-inset flex items-center justify-between gap-3 text-xs text-secondary font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span>Hoy ({diaSemanaActual}) no tenés clases programadas en tu horario.</span>
          </div>
          <Link href="/horario" className="text-accent-violet hover:underline text-[11px] font-extrabold shrink-0">
            Ver horario →
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-violet flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">sticky_note_2</span>
            Recordatorio de Hoy ({diaSemanaActual})
          </span>
          <span className="text-[10px] font-extrabold text-accent-violet px-2 py-0.5 rounded-full neumorphic-inset">
            {actividadesHoy.length} {actividadesHoy.length === 1 ? 'clase' : 'clases'}
          </span>
        </div>

        {/* Stickers carrusel horizontal */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-1 px-1 snap-x">
          {actividadesHoy.map((act, index) => {
            const borderColors = [
              'border-l-accent-violet',
              'border-l-emerald-600',
              'border-l-indigo-600',
              'border-l-amber-600',
            ];
            const borderClass = borderColors[index % borderColors.length];

            return (
              <div
                key={`stk-act-${act.id}-${index}`}
                className={`snap-start shrink-0 w-[240px] sm:w-[260px] bg-surface-bg rounded-2xl p-3.5 neumorphic-raised border-l-[5px] ${borderClass} flex flex-col justify-between hover:scale-[1.02] hover:-rotate-1 active:scale-98 transition-all shadow-md group`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-extrabold text-xs text-accent-violet flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {act.hora}
                    </span>
                    {act.curso && (
                      <span className="px-2 py-0.5 rounded-md neumorphic-inset font-extrabold text-[10px] text-accent-violet truncate max-w-[90px]">
                        {formatearGradoCurso(act.curso)}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-on-surface uppercase truncate leading-tight">
                    {act.materia}
                  </h4>
                  {act.escuela && (
                    <p className="text-[11px] text-secondary font-medium truncate flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">domain</span>
                      <span className="truncate">{act.escuela}</span>
                    </p>
                  )}
                </div>

                {/* Botón con enlace para ir al curso del sticker */}
                <div className="mt-3 pt-2 border-t border-outline-variant/30">
                  <Link
                    href={act.cursoId ? `/sub-menu-curso/${act.cursoId}/alumnos` : '/cursos'}
                    className="w-full py-1.5 px-3 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet hover:brightness-95 font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-95 shadow-sm transition-all"
                  >
                    <span>Ir al curso</span>
                    <span className="material-symbols-outlined text-xs font-extrabold">arrow_forward</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AlmanaqueDiario = () => (
    <div
      className="shrink-0 flex flex-col items-center bg-surface-bg neumorphic-raised rounded-2xl overflow-hidden border border-white/60 shadow-md w-20 sm:w-24 text-center select-none hover:scale-105 active:scale-95 transition-transform"
      title="Almanaque del día de hoy"
    >
      {/* Cabecera del almanaque con anillas / fijaciones */}
      <div className="w-full bg-accent-violet text-white py-1 px-2 flex flex-col items-center relative">
        <div className="flex justify-around w-full px-2 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-inner"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-inner"></span>
        </div>
        <span className="font-extrabold text-[10px] uppercase tracking-widest leading-none">
          {mesActualNombre.slice(0, 3)}
        </span>
      </div>
      {/* Hoja del día */}
      <div className="p-2 flex flex-col items-center justify-center w-full bg-gradient-to-b from-white/30 to-transparent">
        <span className="font-extrabold text-2xl sm:text-3xl text-on-surface leading-tight tracking-tighter">
          {String(currentDay).padStart(2, '0')}
        </span>
        <span className="font-extrabold text-[10px] text-accent-violet uppercase tracking-wider leading-tight">
          {diaSemanaActual}
        </span>
        <span className="text-[9px] font-bold text-secondary mt-0.5">
          {currentYear}
        </span>
      </div>
    </div>
  );

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
          <header className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="font-display-lg text-2xl sm:text-3xl text-on-surface tracking-tight font-extrabold flex items-center gap-2.5">
                  {cargandoUsuario ? (
                    <span className="flex items-center gap-2">
                      <span>Hola</span>
                      <span className="w-5 h-5 border-2 border-accent-violet border-t-transparent rounded-full animate-spin inline-block"></span>
                    </span>
                  ) : (
                    `Hola ${nombreFormateado}`
                  )}
                </h1>
                <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                  <span>Año escolar: {anioEscolar}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full neumorphic-inset text-[9px] font-bold text-accent-violet">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></span>
                    En curso
                  </span>
                </div>
              </div>

              {/* Almanaque de Día a Día */}
              <AlmanaqueDiario />
            </div>

            {/* Stickers de Actividades de Hoy (Mobile) */}
            <div className="mt-2">
              {renderStickersActividades()}
            </div>
          </header>

          {/* Menú Mobile (Acceso a las 4 secciones principales) */}
          <section className="bg-surface-bg neumorphic-raised rounded-3xl p-5 w-full">
            <h3 className="font-headline-md-mobile text-sm font-extrabold text-accent-violet uppercase mb-4 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">menu</span>
              Menú
            </h3>
            <nav className="grid grid-cols-2 gap-3.5">
              <Link className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-all active:scale-95 shadow-sm" href="/agenda">
                <div className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_add_on</span>
                </div>
                <span className="font-extrabold text-xs text-accent-violet">Agenda</span>
              </Link>

              <Link className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-all active:scale-95 shadow-sm" href="/cursos">
                <div className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>school</span>
                </div>
                <span className="font-extrabold text-xs text-accent-violet">Cursos</span>
              </Link>

              <Link className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-all active:scale-95 shadow-sm" href="/planificaciones">
                <div className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>edit_document</span>
                </div>
                <span className="font-extrabold text-xs text-accent-violet truncate">Planificaciones</span>
              </Link>

              <Link className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface-bg neumorphic-raised group cursor-pointer hover:text-accent-violet transition-all active:scale-95 shadow-sm" href="/horario">
                <div className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-inset flex items-center justify-center text-accent-violet shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>schedule</span>
                </div>
                <span className="font-extrabold text-xs text-accent-violet">Horarios</span>
              </Link>
            </nav>
          </section>

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
                  <div key={curso.id || idx} className="relative group">
                    <Link
                      href={curso.ruta || (curso.id ? `/sub-menu-curso/${curso.id}/alumnos` : `/curso/${curso.id}`)}
                      className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised hover:scale-[1.02] active:scale-95 transition-transform w-full h-full"
                    >
                      <div className="flex justify-between items-start pr-6">
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

                    {/* Botón Borrar Curso */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCursoAEliminar(curso);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-surface-bg neumorphic-raised flex items-center justify-center text-secondary hover:text-red-600 active:scale-90 transition-all opacity-60 hover:opacity-100 z-10"
                      title="Eliminar este curso"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
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
          <header className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5 min-w-0">
                <h1 className="font-display-lg text-4xl md:text-5xl text-on-surface tracking-tight font-extrabold flex items-center gap-3">
                  {cargandoUsuario ? (
                    <span className="flex items-center gap-3">
                      <span>Hola</span>
                      <span className="w-7 h-7 border-2 border-accent-violet border-t-transparent rounded-full animate-spin inline-block"></span>
                    </span>
                  ) : (
                    `Hola ${nombreFormateado}`
                  )}
                </h1>
                <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                  <span>Año escolar: {anioEscolar}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full neumorphic-inset text-[10px] font-bold text-accent-violet">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_#22c55e]"></span>
                    En curso
                  </span>
                </div>
              </div>

              {/* Almanaque de Día a Día */}
              <AlmanaqueDiario />
            </div>

            {/* Stickers de Actividades de Hoy (Desktop) */}
            <div className="mt-3">
              {renderStickersActividades()}
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
                  <div key={curso.id || idx} className="relative group">
                    <Link
                      href={curso.ruta || (curso.id ? `/sub-menu-curso/${curso.id}/alumnos` : `/curso/${curso.id}`)}
                      className="bg-surface-bg rounded-2xl p-4 flex flex-col gap-3 neumorphic-raised hover:scale-[1.02] active:scale-95 transition-transform w-full h-full"
                    >
                      <div className="flex justify-between items-start pr-6">
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
                          <span className="material-symbols-outlined text-14px">domain</span>
                          {curso.escuela}
                        </p>
                      </div>
                    </Link>

                    {/* Botón Borrar Curso Desktop */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCursoAEliminar(curso);
                      }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-surface-bg neumorphic-raised flex items-center justify-center text-secondary hover:text-red-600 active:scale-90 transition-all opacity-0 group-hover:opacity-100 z-10 shadow-sm"
                      title="Eliminar este curso"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
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



      {/* ── Modal de Confirmación para Borrar Curso ── */}
      {cursoAEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCursoAEliminar(null);
          }}
        >
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 border border-white/60 shadow-2xl font-mulish">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100/80 neumorphic-inset flex items-center justify-center text-red-600 text-2xl shrink-0">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-headline-md text-lg text-on-surface uppercase font-bold truncate">
                  ¿Eliminar curso?
                </h3>
                <p className="text-xs text-secondary truncate">
                  {cursoAEliminar.materia} ({formatearGradoCurso(cursoAEliminar.anio)})
                </p>
              </div>
            </div>

            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 text-xs text-secondary flex flex-col gap-1.5">
              <p className="font-bold text-red-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">warning</span> Acción irreversible
              </p>
              <p className="text-secondary leading-relaxed">
                Se eliminará el aula <b>{cursoAEliminar.materia}</b> de {cursoAEliminar.escuela}.
              </p>
            </div>

            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setCursoAEliminar(null)}
                disabled={eliminandoCurso}
                className="flex-1 py-3 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarCurso}
                disabled={eliminandoCurso}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {eliminandoCurso ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Borrando...</span>
                  </>
                ) : (
                  'Eliminar'
                )}
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