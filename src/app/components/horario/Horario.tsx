'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cargando from '../shared/Cargando';
import { getToken } from '@/lib/token';
import { Curso } from '../cursos/Cursos';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;
type Dia = typeof DIAS[number];

const DIAS_ABREV: Record<Dia, string> = {
  Lunes: 'LUN',
  Martes: 'MAR',
  Miercoles: 'MIE',
  Jueves: 'JUE',
  Viernes: 'VIE',
};

type HorarioItem = {
  id: number;
  dia: Dia;
  hora: string;
  descripcion: string | null;
};

export type CeldaData = {
  id: number | null;
  materia: string;
  curso: string;
  escuela: string;
  cursoId?: number | null;
};

type Fila = { hora: string; celdas: Record<Dia, CeldaData> };

const normalizarHora = (h: string): string => {
  return (h || '').replace(/\s+/g, ' ').trim();
};

export const parsearDescripcion = (
  desc: string | null | undefined,
  cursos: Curso[] = []
): Omit<CeldaData, 'id'> => {
  if (!desc || !desc.trim()) {
    return { materia: '', curso: '', escuela: '', cursoId: null };
  }

  const raw = desc.trim();

  // 1. Intentar parsear como JSON estructurado
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        materia: parsed.materia ?? '',
        curso: parsed.curso ?? '',
        escuela: parsed.escuela ?? '',
        cursoId: parsed.cursoId ?? null,
      };
    }
  } catch {
    // Si no es JSON, es texto plano
  }

  // 2. Si era texto plano antiguo, buscar coincidencia con cursos creados del docente
  const lower = raw.toLowerCase();
  const cursoEncontrado = cursos.find((c) => {
    const matNorm = (c.materia || '').trim().toLowerCase();
    return matNorm && (matNorm === lower || lower.includes(matNorm));
  });

  if (cursoEncontrado) {
    return {
      materia: cursoEncontrado.materia,
      curso: cursoEncontrado.anio,
      escuela: cursoEncontrado.escuela,
      cursoId: cursoEncontrado.id,
    };
  }

  // 3. Si tiene líneas separadas o guión "Curso - Materia"
  const partes = raw.split(/\r?\n| - | — /);
  if (partes.length >= 2) {
    return {
      materia: partes[0].trim(),
      curso: partes[1].trim(),
      escuela: partes.slice(2).join(' ').trim(),
      cursoId: null,
    };
  }

  return {
    materia: raw,
    curso: '',
    escuela: '',
    cursoId: null,
  };
};

export const serializarDescripcion = (celda: CeldaData): string => {
  const { materia, curso, escuela, cursoId } = celda;
  if (!materia.trim() && !curso.trim() && !escuela.trim()) {
    return '';
  }
  return JSON.stringify({
    materia: materia.trim(),
    curso: curso.trim(),
    escuela: escuela.trim(),
    cursoId: cursoId ?? null,
  });
};

const celdaVacia = (): CeldaData => ({
  id: null,
  materia: '',
  curso: '',
  escuela: '',
  cursoId: null,
});

const celdaTieneDatos = (c: CeldaData): boolean =>
  Boolean(c.materia?.trim() || c.curso?.trim() || c.escuela?.trim());

const nuevaFila = (hora = ''): Fila => ({
  hora: normalizarHora(hora),
  celdas: Object.fromEntries(DIAS.map((d) => [d, celdaVacia()])) as Record<Dia, CeldaData>,
});

const parsearHora = (h: string) => {
  if (!h) return { inicio: '08:00', fin: '09:20' };
  const clean = normalizarHora(h);
  const parts = clean.split(/\s*(?:a|-)\s*/i);
  if (parts.length >= 2) {
    return { inicio: parts[0].trim(), fin: parts[1].trim() };
  }
  return { inicio: clean, fin: '' };
};

export default function Horario() {
  const [filas, setFilas] = useState<Fila[]>([nuevaFila()]);
  const [cursosDocente, setCursosDocente] = useState<Curso[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Día seleccionado en móvil
  const [diaActivo, setDiaActivo] = useState<Dia>('Lunes');

  // Modal para editar hora
  const [editandoHoraIndex, setEditandoHoraIndex] = useState<number | null>(null);
  const [tempHoraInicio, setTempHoraInicio] = useState('');
  const [tempHoraFin, setTempHoraFin] = useState('');

  // Modal para editar celda (Materia, Curso, Escuela)
  const [editandoCelda, setEditandoCelda] = useState<{ filaIndex: number; dia: Dia } | null>(null);
  const [tempMateria, setTempMateria] = useState('');
  const [tempCurso, setTempCurso] = useState('');
  const [tempEscuela, setTempEscuela] = useState('');
  const [tempCursoId, setTempCursoId] = useState<number | null>(null);

  // Menú de opciones de bloque en móvil
  const [menuOpcionesFila, setMenuOpcionesFila] = useState<number | null>(null);

  useEffect(() => {
    const hoyNum = new Date().getDay();
    const mapaDias: Record<number, Dia> = {
      1: 'Lunes',
      2: 'Martes',
      3: 'Miercoles',
      4: 'Jueves',
      5: 'Viernes',
    };
    if (mapaDias[hoyNum]) {
      setDiaActivo(mapaDias[hoyNum]);
    }

    inicializarDatos();
  }, []);

  const inicializarDatos = async () => {
    setCargando(true);
    try {
      const token = getToken();
      if (!token) {
        setFilas([
          nuevaFila('08:00 a 09:20'),
          nuevaFila('09:30 a 10:50'),
          nuevaFila('11:00 a 12:20'),
          nuevaFila('12:20 a 13:40'),
          nuevaFila('14:20 a 15:50'),
        ]);
        setCargando(false);
        return;
      }

      // 1. Obtener Cursos
      let listaCursos: Curso[] = [];
      try {
        const resC = await fetch(`${API}/cursos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resC.ok) {
          const dataC = await resC.json();
          if (Array.isArray(dataC)) {
            listaCursos = dataC;
            setCursosDocente(dataC);
          }
        }
      } catch (errC) {
        console.warn('Error al obtener cursos:', errC);
      }

      // 2. Obtener Horarios
      const resH = await fetch(`${API}/horarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!resH.ok) {
        setFilas([
          nuevaFila('08:00 a 09:20'),
          nuevaFila('09:30 a 10:50'),
          nuevaFila('11:00 a 12:20'),
          nuevaFila('12:20 a 13:40'),
          nuevaFila('14:20 a 15:50'),
        ]);
        setCargando(false);
        return;
      }

      const dataH: HorarioItem[] = await resH.json();

      if (!Array.isArray(dataH) || dataH.length === 0) {
        setFilas([
          nuevaFila('08:00 a 09:20'),
          nuevaFila('09:30 a 10:50'),
          nuevaFila('11:00 a 12:20'),
          nuevaFila('12:20 a 13:40'),
          nuevaFila('14:20 a 15:50'),
        ]);
        setCargando(false);
        return;
      }

      // Normalizar franjas horarias
      const horasNormalizadas = [...new Set(dataH.map((h) => normalizarHora(h.hora)))];
      const filasMap = new Map<string, Fila>();

      for (const hora of horasNormalizadas) {
        filasMap.set(hora, nuevaFila(hora));
      }

      for (const h of dataH) {
        const horaNorm = normalizarHora(h.hora);
        const fila = filasMap.get(horaNorm);
        if (fila && DIAS.includes(h.dia as Dia)) {
          const parsed = parsearDescripcion(h.descripcion, listaCursos);
          fila.celdas[h.dia as Dia] = {
            id: h.id,
            ...parsed,
          };
        }
      }

      const filasOrdenadas = [...filasMap.values()].sort((a, b) => {
        const numA = parseFloat(a.hora.replace(':', '.'));
        const numB = parseFloat(b.hora.replace(':', '.'));
        return isNaN(numA) || isNaN(numB) ? a.hora.localeCompare(b.hora) : numA - numB;
      });

      setFilas(filasOrdenadas.length > 0 ? filasOrdenadas : [nuevaFila('08:00 a 09:20')]);
    } catch (err) {
      console.error('Error al inicializar horarios:', err);
      setFilas([nuevaFila('08:00 a 09:20')]);
    } finally {
      setCargando(false);
    }
  };

  const agregarFila = () => {
    setFilas((prev) => [...prev, nuevaFila('08:00 a 09:20')]);
  };

  const eliminarFila = (filaIndex: number) => {
    if (filas.length <= 1) {
      setFilas([nuevaFila()]);
      return;
    }
    setFilas((prev) => prev.filter((_, i) => i !== filaIndex));
    setMenuOpcionesFila(null);
  };

  const moverFila = (index: number, direccion: 'arriba' | 'abajo') => {
    if (direccion === 'arriba' && index === 0) return;
    if (direccion === 'abajo' && index === filas.length - 1) return;
    const targetIndex = direccion === 'arriba' ? index - 1 : index + 1;
    setFilas((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setMenuOpcionesFila(null);
  };

  const abrirModalEditarHora = (filaIndex: number) => {
    const { inicio, fin } = parsearHora(filas[filaIndex].hora);
    setTempHoraInicio(inicio);
    setTempHoraFin(fin);
    setEditandoHoraIndex(filaIndex);
    setMenuOpcionesFila(null);
  };

  const guardarHoraEditada = () => {
    if (editandoHoraIndex === null) return;
    const nuevaHoraStr = tempHoraFin.trim()
      ? `${tempHoraInicio.trim()} a ${tempHoraFin.trim()}`
      : tempHoraInicio.trim();
    setFilas((prev) =>
      prev.map((f, i) => (i === editandoHoraIndex ? { ...f, hora: normalizarHora(nuevaHoraStr) } : f))
    );
    setEditandoHoraIndex(null);
  };

  const actualizarHora = (filaIndex: number, valor: string) => {
    setFilas((prev) => prev.map((f, i) => (i === filaIndex ? { ...f, hora: valor } : f)));
  };

  // Edición directa en la celda de escritorio
  const actualizarMateria = (filaIndex: number, dia: Dia, valor: string) => {
    setFilas((prev) =>
      prev.map((f, i) =>
        i === filaIndex
          ? {
              ...f,
              celdas: {
                ...f.celdas,
                [dia]: {
                  ...f.celdas[dia],
                  materia: valor,
                },
              },
            }
          : f
      )
    );
  };

  const actualizarCurso = (filaIndex: number, dia: Dia, valor: string) => {
    setFilas((prev) =>
      prev.map((f, i) =>
        i === filaIndex
          ? {
              ...f,
              celdas: {
                ...f.celdas,
                [dia]: {
                  ...f.celdas[dia],
                  curso: valor,
                },
              },
            }
          : f
      )
    );
  };

  const abrirModalEditarCelda = (filaIndex: number, dia: Dia) => {
    const celda = filas[filaIndex].celdas[dia];
    setTempMateria(celda.materia || '');
    setTempCurso(celda.curso || '');
    setTempEscuela(celda.escuela || '');
    setTempCursoId(celda.cursoId ?? null);
    setEditandoCelda({ filaIndex, dia });
    setMenuOpcionesFila(null);
  };

  const seleccionarCursoPredefinido = (cursoIdStr: string) => {
    if (!cursoIdStr) {
      setTempCursoId(null);
      return;
    }
    const idNum = parseInt(cursoIdStr, 10);
    const encontrado = cursosDocente.find((c) => c.id === idNum);
    if (encontrado) {
      setTempMateria(encontrado.materia);
      setTempCurso(encontrado.anio);
      setTempEscuela(encontrado.escuela);
      setTempCursoId(encontrado.id);
    }
  };

  const guardarCeldaEditada = () => {
    if (!editandoCelda) return;
    const { filaIndex, dia } = editandoCelda;
    setFilas((prev) =>
      prev.map((f, i) =>
        i === filaIndex
          ? {
              ...f,
              celdas: {
                ...f.celdas,
                [dia]: {
                  ...f.celdas[dia],
                  materia: tempMateria.trim(),
                  curso: tempCurso.trim(),
                  escuela: tempEscuela.trim(),
                  cursoId: tempCursoId,
                },
              },
            }
          : f
      )
    );
    setEditandoCelda(null);
  };

  const limpiarCelda = (filaIndex: number, dia: Dia) => {
    setFilas((prev) =>
      prev.map((f, i) =>
        i === filaIndex
          ? {
              ...f,
              celdas: {
                ...f.celdas,
                [dia]: {
                  id: f.celdas[dia].id,
                  materia: '',
                  curso: '',
                  escuela: '',
                  cursoId: null,
                },
              },
            }
          : f
      )
    );
    setMenuOpcionesFila(null);
  };

  const guardarTodo = async () => {
    const token = getToken();
    if (!token) {
      alert('No hay sesión activa');
      return;
    }

    for (const fila of filas) {
      if (!fila.hora.trim()) {
        alert('Todas las filas deben tener una hora especificada.');
        return;
      }
    }

    setGuardando(true);
    try {
      const promesas: Promise<Response>[] = [];

      for (const fila of filas) {
        const horaLimpia = normalizarHora(fila.hora);
        for (const dia of DIAS) {
          const celda = fila.celdas[dia];
          const tieneContenido = celdaTieneDatos(celda);
          const descStr = tieneContenido ? serializarDescripcion(celda) : '';

          if (celda.id && !tieneContenido) {
            // Borrar
            promesas.push(
              fetch(`${API}/horarios/${celda.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
            );
          } else if (celda.id && tieneContenido) {
            // Actualizar / Recrear
            promesas.push(
              fetch(`${API}/horarios/${celda.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
            );
            promesas.push(
              fetch(`${API}/horarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ dia, hora: horaLimpia, descripcion: descStr }),
              })
            );
          } else if (!celda.id && tieneContenido) {
            // Crear nuevo
            promesas.push(
              fetch(`${API}/horarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ dia, hora: horaLimpia, descripcion: descStr }),
              })
            );
          }
        }
      }

      await Promise.allSettled(promesas);

      setOk(true);
      setTimeout(() => {
        setOk(false);
        inicializarDatos();
      }, 1500);
    } catch (err) {
      console.error('Error al guardar horarios:', err);
      alert('❌ Error al guardar horarios');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <Cargando texto="Cargando grilla semanal de horarios..." />;
  }

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-container-padding pt-28 md:pt-36 pb-32">
        
        {/* ═════════════════════════════════════════════════════════ */}
        {/* ── MOBILE VIEW: LAYOUT ADAPTADO CON ESCUELA, MATERIA Y CURSO ── */}
        {/* ═════════════════════════════════════════════════════════ */}
        <div className="flex md:hidden flex-col gap-6">
          
          {/* Header Actions Mobile */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline-md-mobile text-2xl text-accent-violet uppercase tracking-tight font-extrabold">
                Grilla Semanal
              </h1>
              <p className="text-secondary text-xs mt-0.5">Materia, curso y escuela por día</p>
            </div>
            
            <button
              onClick={guardarTodo}
              disabled={guardando}
              className="neu-raised text-accent-violet font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
            >
              {guardando ? (
                <div className="w-4 h-4 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              Guardar
            </button>
          </div>

          {/* Day Selector (Tabs con Neumorphism) */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 snap-x">
            {DIAS.map((dia) => {
              const esActivo = diaActivo === dia;
              return (
                <button
                  key={`tab-dia-${dia}`}
                  onClick={() => setDiaActivo(dia)}
                  className={`snap-start shrink-0 font-label-caps px-5 py-3 rounded-2xl text-xs uppercase font-extrabold tracking-wider transition-all ${
                    esActivo
                      ? 'neu-inset text-accent-violet shadow-inner'
                      : 'neu-raised text-secondary hover:text-accent-violet active:scale-95'
                  }`}
                >
                  {DIAS_ABREV[dia]}
                </button>
              );
            })}
          </div>

          {/* Schedule List for Selected Day */}
          <div className="flex flex-col gap-4">
            
            {/* Add Time Block Button */}
            <button
              onClick={agregarFila}
              className="w-full neu-inset border-2 border-dashed border-outline-variant/50 text-secondary hover:text-accent-violet flex items-center justify-center gap-2 py-3.5 rounded-2xl active:bg-surface-variant transition-all font-bold text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Agregar hora</span>
            </button>

            {/* Time Blocks con Datos */}
            {(() => {
              const filasConDatos = filas
                .map((fila, idx) => ({ fila, idx }))
                .filter(({ fila }) => celdaTieneDatos(fila.celdas[diaActivo]));

              if (filasConDatos.length === 0) {
                return (
                  <div className="bg-surface-bg neu-inset rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-secondary/60">calendar_today</span>
                    <div>
                      <h3 className="font-headline-md-mobile text-on-surface text-base font-bold">
                        Sin clases para el {diaActivo}
                      </h3>
                      <p className="text-xs text-secondary mt-0.5">
                        No tenés materias ni cursos registrados para este día.
                      </p>
                    </div>
                    <button
                      onClick={agregarFila}
                      className="mt-1 px-5 py-2.5 rounded-xl neu-raised text-accent-violet font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-sm"
                    >
                      + Cargar horario para {diaActivo}
                    </button>
                  </div>
                );
              }

              return filasConDatos.map(({ fila, idx: filaIndex }) => {
                const celda = fila.celdas[diaActivo];
                const { inicio, fin } = parsearHora(fila.hora);
                const cursoRelacionado = celda.cursoId
                  ? cursosDocente.find((c) => c.id === celda.cursoId)
                  : cursosDocente.find(
                      (c) =>
                        c.materia.trim().toLowerCase() === (celda.materia || '').trim().toLowerCase()
                    );
                const cursoIdDestino = celda.cursoId || cursoRelacionado?.id;

                return (
                  <div
                    key={`mob-block-filled-${filaIndex}`}
                    className="neu-raised rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden group shadow-md"
                  >
                    {/* Borde lateral de acento morado */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-violet rounded-l-2xl"></div>

                    {/* Columna Horario */}
                    <div
                      onClick={() => abrirModalEditarHora(filaIndex)}
                      className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-outline-variant/30 pr-3 cursor-pointer select-none"
                      title="Tocar para editar hora"
                    >
                      <span className="font-extrabold text-accent-violet text-sm leading-none">{inicio}</span>
                      <span className="text-[10px] font-bold text-secondary my-0.5">a</span>
                      <span className="font-extrabold text-accent-violet text-sm leading-none">{fin || '...'}</span>
                    </div>

                    {/* Columna Contenido: Materia, Curso y Escuela */}
                    <div
                      onClick={() => abrirModalEditarCelda(filaIndex, diaActivo)}
                      className="flex-grow min-w-0 cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-extrabold text-on-surface text-base leading-tight uppercase truncate">
                          {celda.materia || 'Sin materia'}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpcionesFila(menuOpcionesFila === filaIndex ? null : filaIndex);
                          }}
                          className="text-secondary hover:text-accent-violet p-1 rounded-lg active:scale-90 transition-transform shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {celda.curso ? (
                            <span className="neu-inset px-3 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider text-accent-violet">
                              {celda.curso}
                            </span>
                          ) : null}
                          {celda.escuela ? (
                            <div className="flex items-center gap-1 text-xs text-secondary font-semibold truncate max-w-[150px]">
                              <span className="material-symbols-outlined text-[14px]">school</span>
                              <span className="truncate">{celda.escuela}</span>
                            </div>
                          ) : null}
                        </div>

                        {cursoIdDestino && (
                          <Link
                            href={`/sub-menu-curso/${cursoIdDestino}/alumnos`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl neu-raised text-[10px] font-extrabold text-accent-violet uppercase tracking-wider active:scale-95 transition-all shadow-sm"
                            title="Ingresar al curso"
                          >
                            <span>Aula</span>
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Menú de opciones de la fila */}
                    {menuOpcionesFila === filaIndex && (
                      <div className="absolute right-4 top-10 bg-surface-bg neu-raised rounded-2xl p-2 z-20 flex flex-col gap-1 border border-white/60 shadow-xl animate-in fade-in zoom-in-95">
                        {cursoIdDestino && (
                          <Link
                            href={`/sub-menu-curso/${cursoIdDestino}/alumnos`}
                            className="px-3 py-1.5 text-[11px] font-bold text-left text-accent-violet hover:bg-violet-50 flex items-center gap-1.5 rounded-lg border-b border-outline-variant/30 pb-2 mb-1"
                          >
                            <span className="material-symbols-outlined text-sm">login</span> Ingresar al aula
                          </Link>
                        )}
                        <button
                          onClick={() => abrirModalEditarCelda(filaIndex, diaActivo)}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-secondary hover:text-accent-violet flex items-center gap-1.5 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span> Editar clase
                        </button>
                        <button
                          onClick={() => abrirModalEditarHora(filaIndex)}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-secondary hover:text-accent-violet flex items-center gap-1.5 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-sm">schedule</span> Editar hora
                        </button>
                        <button
                          onClick={() => moverFila(filaIndex, 'arriba')}
                          disabled={filaIndex === 0}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-secondary hover:text-accent-violet flex items-center gap-1.5 rounded-lg disabled:opacity-30"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_upward</span> Subir
                        </button>
                        <button
                          onClick={() => moverFila(filaIndex, 'abajo')}
                          disabled={filaIndex === filas.length - 1}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-secondary hover:text-accent-violet flex items-center gap-1.5 rounded-lg disabled:opacity-30"
                        >
                          <span className="material-symbols-outlined text-sm">arrow_downward</span> Bajar
                        </button>
                        <button
                          onClick={() => {
                            limpiarCelda(filaIndex, diaActivo);
                            setMenuOpcionesFila(null);
                          }}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span> Quitar de este día
                        </button>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── DESKTOP VIEW: GRILLA COMPLETA CON HORA, CURSO Y MATERIA ── */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex flex-col gap-6">
          
          {/* Header Actions Desktop */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-display-lg text-4xl lg:text-5xl text-accent-violet uppercase tracking-tight font-extrabold leading-tight">
                GRILLA SEMANAL DE HORARIOS LECTIVOS
              </h1>
              <p className="text-sm text-secondary mt-1 font-semibold">
                Organizador semanal interactivo de materias, cursos y horarios.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={agregarFila}
                className="neu-inset px-5 py-3 rounded-2xl text-accent-violet font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#D6DCE5] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Agregar hora
              </button>

              <button
                onClick={guardarTodo}
                disabled={guardando}
                className="neu-raised text-accent-violet hover:brightness-95 px-8 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-accent-violet">Guardando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base text-accent-violet">save</span>
                    <span className="text-accent-violet">Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto pb-6">
            <div className="min-w-[1050px] flex flex-col gap-2.5">
              
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-gutter">
                <div className="neu-header-pill rounded-2xl py-3 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider">
                  Hora
                </div>
                {DIAS.map((dia) => (
                  <div
                    key={`desk-head-${dia}`}
                    className="neu-header-pill rounded-2xl py-3 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filas.map((fila, filaIndex) => (
                <div key={`desk-row-${filaIndex}`} className="grid grid-cols-6 gap-gutter items-stretch">
                  
                  {/* Hora */}
                  <div className="neu-raised rounded-2xl p-1.5 flex flex-col items-center justify-center text-accent-violet font-bold text-center h-full min-h-[52px] relative group">
                    <textarea
                      rows={2}
                      placeholder="12:20 a&#10;13:40"
                      value={fila.hora}
                      onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                      className="w-full bg-transparent text-center font-extrabold text-xs text-accent-violet focus:outline-none resize-none leading-tight"
                    />

                    {/* Up / Down Controls */}
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moverFila(filaIndex, 'arriba')}
                        disabled={filaIndex === 0}
                        className="w-4 h-3.5 flex items-center justify-center text-secondary hover:text-accent-violet disabled:opacity-20"
                        title="Subir franja"
                      >
                        <span className="material-symbols-outlined text-[13px] leading-none">arrow_drop_up</span>
                      </button>
                      <button
                        onClick={() => moverFila(filaIndex, 'abajo')}
                        disabled={filaIndex === filas.length - 1}
                        className="w-4 h-3.5 flex items-center justify-center text-secondary hover:text-accent-violet disabled:opacity-20"
                        title="Bajar franja"
                      >
                        <span className="material-symbols-outlined text-[13px] leading-none">arrow_drop_down</span>
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarFila(filaIndex)}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-secondary hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar fila"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>

                  {/* Day Cells: Edición directa de Materia y Curso */}
                  {DIAS.map((dia) => {
                    const celda = fila.celdas[dia];
                    const tieneContenido = celdaTieneDatos(celda);

                    return (
                      <div
                        key={`desk-cell-${filaIndex}-${dia}`}
                        className={`rounded-2xl transition-all relative group flex flex-col justify-center min-h-[52px] p-2 select-none ${
                          tieneContenido
                            ? 'neu-subject-card'
                            : 'neu-inset'
                        }`}
                      >
                        <div className="flex flex-col justify-center items-center w-full gap-0.5">
                          {/* Campo Materia */}
                          <input
                            type="text"
                            placeholder="Materia"
                            value={celda.materia}
                            onChange={(e) => actualizarMateria(filaIndex, dia, e.target.value)}
                            className="w-full bg-transparent text-center font-extrabold text-xs text-accent-violet focus:outline-none placeholder:text-secondary/40 uppercase leading-none"
                            title="Materia"
                          />

                          {/* Campo Año / Curso */}
                          <input
                            type="text"
                            placeholder="Año / Curso"
                            value={celda.curso}
                            onChange={(e) => actualizarCurso(filaIndex, dia, e.target.value)}
                            className="w-full bg-transparent text-center font-bold text-[11px] text-secondary focus:outline-none placeholder:text-secondary/40 leading-none"
                            title="Año o división del curso"
                          />
                        </div>

                        {/* Botón para abrir modal de opciones avanzadas (elegir de cursos existentes o asignar escuela) */}
                        <button
                          type="button"
                          onClick={() => abrirModalEditarCelda(filaIndex, dia)}
                          className="absolute right-1 top-1 w-4 h-4 rounded flex items-center justify-center text-secondary/40 hover:text-accent-violet opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Elegir de mis cursos o agregar escuela"
                        >
                          <span className="material-symbols-outlined text-[14px]">more_vert</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Modal para Editar Celda (Materia, Curso, Escuela) ── */}
        {editandoCelda !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditandoCelda(null);
            }}
          >
            <div className="bg-surface-bg neu-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 border border-white/60 shadow-2xl font-mulish">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline-md text-lg text-accent-violet uppercase font-extrabold">
                    Configurar Horario
                  </h3>
                  <p className="text-xs text-secondary font-bold">
                    {editandoCelda.dia} — {filas[editandoCelda.filaIndex]?.hora}
                  </p>
                </div>
                <button
                  onClick={() => setEditandoCelda(null)}
                  className="text-secondary hover:text-accent-violet p-1"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Selector de Cursos creados */}
              {cursosDocente.length > 0 && (
                <div className="bg-white/50 p-3 rounded-2xl border border-white/60">
                  <label className="text-[11px] font-bold text-accent-violet uppercase block mb-1">
                    Cargar desde tus Cursos guardados:
                  </label>
                  <select
                    value={tempCursoId ?? ''}
                    onChange={(e) => seleccionarCursoPredefinido(e.target.value)}
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2 text-xs font-bold text-on-surface focus:outline-none"
                  >
                    <option value="">-- Elegir un curso --</option>
                    {cursosDocente.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.materia} — {c.anio}° ({c.escuela})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Campos manuales: Materia, Curso, Escuela */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase block mb-1">
                    Materia:
                  </label>
                  <input
                    type="text"
                    value={tempMateria}
                    onChange={(e) => setTempMateria(e.target.value)}
                    placeholder="Ej. Química, Matemática"
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2 text-sm font-bold text-accent-violet focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase block mb-1">
                      Curso / Año:
                    </label>
                    <input
                      type="text"
                      value={tempCurso}
                      onChange={(e) => setTempCurso(e.target.value)}
                      placeholder="Ej. 2° Año, 1° 1ra"
                      className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2 text-sm font-bold text-accent-violet focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-secondary uppercase block mb-1">
                      Institución / Escuela:
                    </label>
                    <input
                      type="text"
                      value={tempEscuela}
                      onChange={(e) => setTempEscuela(e.target.value)}
                      placeholder="Ej. EET N° 8"
                      className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2 text-sm font-bold text-accent-violet focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    limpiarCelda(editandoCelda.filaIndex, editandoCelda.dia);
                    setEditandoCelda(null);
                  }}
                  className="px-4 py-2.5 rounded-xl neu-raised text-red-600 font-bold text-xs uppercase tracking-wider active:scale-95"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoCelda(null)}
                  className="flex-1 py-2.5 rounded-xl neu-raised text-secondary font-bold text-xs uppercase tracking-wider active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarCeldaEditada}
                  className="flex-1 py-2.5 rounded-xl neu-raised text-accent-violet hover:brightness-95 font-extrabold text-xs uppercase tracking-wider active:scale-95"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal para Editar Franja Horaria (Móvil y Escritorio) ── */}
        {editandoHoraIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditandoHoraIndex(null);
            }}
          >
            <div className="bg-surface-bg neu-raised rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 border border-white/60 shadow-2xl font-mulish">
              <h3 className="font-headline-md text-lg text-accent-violet uppercase font-bold">
                Configurar Horario del Módulo
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Hora Inicio:</label>
                  <input
                    type="text"
                    value={tempHoraInicio}
                    onChange={(e) => setTempHoraInicio(e.target.value)}
                    placeholder="12:20"
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2.5 text-sm font-bold text-accent-violet focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-secondary uppercase block mb-1">Hora Fin:</label>
                  <input
                    type="text"
                    value={tempHoraFin}
                    onChange={(e) => setTempHoraFin(e.target.value)}
                    placeholder="13:40"
                    className="w-full bg-surface-bg neu-inset rounded-xl px-3 py-2.5 text-sm font-bold text-accent-violet focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setEditandoHoraIndex(null)}
                  className="flex-1 py-2.5 rounded-xl neu-raised text-secondary font-bold text-xs uppercase tracking-wider active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarHoraEditada}
                  className="flex-1 py-2.5 rounded-xl neu-raised text-accent-violet hover:brightness-95 font-extrabold text-xs uppercase tracking-wider active:scale-95"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast de Confirmación ── */}
        {ok && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 font-bold text-xs uppercase tracking-wider flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
            <span className="material-symbols-outlined text-base">check_circle</span>
            Horario guardado correctamente
          </div>
        )}
      </main>
    </div>
  );
}