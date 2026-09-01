'use client';

import { useEffect, useState } from 'react';
import Cargando from '../shared/Cargando';
import { getToken } from '@/lib/token';

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

type Celda = { id: number | null; descripcion: string };
type Fila = { hora: string; celdas: Record<Dia, Celda> };

const celdaVacia = (): Celda => ({ id: null, descripcion: '' });

const nuevaFila = (hora = ''): Fila => ({
  hora,
  celdas: Object.fromEntries(DIAS.map((d) => [d, celdaVacia()])) as Record<Dia, Celda>,
});

const parsearHora = (h: string) => {
  if (!h) return { inicio: '08:00', fin: '09:20' };
  const parts = h.split(/\s*(?:a|-)\s*/i);
  if (parts.length >= 2) {
    return { inicio: parts[0].trim(), fin: parts[1].trim() };
  }
  return { inicio: h.trim(), fin: '' };
};

export default function Horario() {
  const [filas, setFilas] = useState<Fila[]>([nuevaFila()]);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(true);
  
  // Día seleccionado en móvil (por defecto Lunes o día actual si es día de semana)
  const [diaActivo, setDiaActivo] = useState<Dia>('Lunes');

  // Modal para editar/personalizar hora
  const [editandoHoraIndex, setEditandoHoraIndex] = useState<number | null>(null);
  const [tempHoraInicio, setTempHoraInicio] = useState('');
  const [tempHoraFin, setTempHoraFin] = useState('');

  // Menú de opciones de bloque en móvil
  const [menuOpcionesFila, setMenuOpcionesFila] = useState<number | null>(null);

  useEffect(() => {
    // Detectar día actual de la semana si es lunes-viernes
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

    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    setCargando(true);
    try {
      const token = getToken();
      if (!token) {
        setFilas([nuevaFila()]);
        setCargando(false);
        return;
      }

      const res = await fetch(`${API}/horarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setFilas([nuevaFila()]);
        setCargando(false);
        return;
      }

      const data: HorarioItem[] = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setFilas([
          nuevaFila('12:20 a 13:40'),
          nuevaFila('14:20 a 15:50'),
          nuevaFila('19:00 a 20:00'),
          nuevaFila('20:00 a 21:00'),
          nuevaFila('21:00 a 22:00'),
        ]);
        setCargando(false);
        return;
      }

      const horasSet = new Set(data.map((h) => h.hora));
      const filasMap = new Map<string, Fila>();

      for (const hora of horasSet) {
        filasMap.set(hora, nuevaFila(hora));
      }

      for (const h of data) {
        const fila = filasMap.get(h.hora);
        if (fila && DIAS.includes(h.dia as Dia)) {
          fila.celdas[h.dia as Dia] = {
            id: h.id,
            descripcion: h.descripcion ?? '',
          };
        }
      }

      const filasOrdenadas = [...filasMap.values()].sort((a, b) => {
        const numA = parseFloat(a.hora.replace(':', '.'));
        const numB = parseFloat(b.hora.replace(':', '.'));
        return isNaN(numA) || isNaN(numB) ? a.hora.localeCompare(b.hora) : numA - numB;
      });

      setFilas(filasOrdenadas);
    } catch (err) {
      console.error('Error al obtener horarios:', err);
      setFilas([nuevaFila()]);
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
      prev.map((f, i) => (i === editandoHoraIndex ? { ...f, hora: nuevaHoraStr } : f))
    );
    setEditandoHoraIndex(null);
  };

  const actualizarHora = (filaIndex: number, valor: string) => {
    setFilas((prev) => prev.map((f, i) => (i === filaIndex ? { ...f, hora: valor } : f)));
  };

  const actualizarCelda = (filaIndex: number, dia: Dia, valor: string) => {
    setFilas((prev) =>
      prev.map((f, i) =>
        i === filaIndex
          ? { ...f, celdas: { ...f.celdas, [dia]: { ...f.celdas[dia], descripcion: valor } } }
          : f
      )
    );
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
        for (const dia of DIAS) {
          const celda = fila.celdas[dia];

          if (celda.id && !celda.descripcion.trim()) {
            // Existía en BD y quedó vacía → borrar
            promesas.push(
              fetch(`${API}/horarios/${celda.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
            );
          } else if (celda.id && celda.descripcion.trim()) {
            // Recrear
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
                body: JSON.stringify({ dia, hora: fila.hora, descripcion: celda.descripcion }),
              })
            );
          } else if (!celda.id && celda.descripcion.trim()) {
            // Nueva celda con contenido
            promesas.push(
              fetch(`${API}/horarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ dia, hora: fila.hora, descripcion: celda.descripcion }),
              })
            );
          }
        }
      }

      await Promise.all(promesas);

      setOk(true);
      setTimeout(() => {
        setOk(false);
        fetchHorarios();
      }, 2000);
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
        {/* ── MOBILE VIEW: LAYOUT ADAPTADO SEGÚN ESPECIFICACIÓN ── */}
        {/* ═════════════════════════════════════════════════════════ */}
        <div className="flex md:hidden flex-col gap-6">
          
          {/* Header Actions Mobile */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline-md-mobile text-2xl text-accent-violet uppercase tracking-tight font-extrabold">
                Grilla Semanal
              </h1>
              <p className="text-secondary text-xs mt-0.5">Gestión de horarios lectivos</p>
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

            {/* Time Blocks */}
            {filas.map((fila, filaIndex) => {
              const celda = fila.celdas[diaActivo];
              const tieneContenido = celda.descripcion.trim() !== '';
              const { inicio, fin } = parsearHora(fila.hora);

              if (tieneContenido) {
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

                    {/* Columna Contenido */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <textarea
                          rows={2}
                          value={celda.descripcion}
                          onChange={(e) => actualizarCelda(filaIndex, diaActivo, e.target.value)}
                          className="font-bold text-on-surface text-sm leading-tight bg-transparent resize-none focus:outline-none w-full"
                          placeholder="Materia / Aula"
                        />
                        <button
                          onClick={() => setMenuOpcionesFila(menuOpcionesFila === filaIndex ? null : filaIndex)}
                          className="text-secondary hover:text-accent-violet p-1 rounded-lg active:scale-90 transition-transform shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="neu-inset px-3 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider text-accent-violet">
                          Materia
                        </span>
                      </div>
                    </div>

                    {/* Menú de opciones de la fila */}
                    {menuOpcionesFila === filaIndex && (
                      <div className="absolute right-4 top-10 bg-surface-bg neu-raised rounded-2xl p-2 z-20 flex flex-col gap-1 border border-white/60 shadow-xl animate-in fade-in zoom-in-95">
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
                          onClick={() => eliminarFila(filaIndex)}
                          className="px-3 py-1.5 text-[11px] font-bold text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span> Borrar franja
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // Empty / Input State
              return (
                <div key={`mob-block-empty-${filaIndex}`} className="flex gap-4 items-center">
                  <div
                    onClick={() => abrirModalEditarHora(filaIndex)}
                    className="flex flex-col items-center justify-center w-20 shrink-0 cursor-pointer select-none"
                    title="Tocar para editar hora"
                  >
                    <span className="font-extrabold text-secondary text-sm leading-none">{inicio}</span>
                    <span className="text-[10px] font-bold text-secondary my-0.5">a</span>
                    <span className="font-extrabold text-secondary text-sm leading-none">{fin || '...'}</span>
                  </div>

                  <div className="flex-grow neu-inset rounded-2xl p-3 flex items-center gap-2">
                    <input
                      className="w-full bg-transparent border-none text-on-surface placeholder:text-secondary/50 focus:outline-none text-xs font-semibold"
                      placeholder="Materia / Nota"
                      type="text"
                      value={celda.descripcion}
                      onChange={(e) => actualizarCelda(filaIndex, diaActivo, e.target.value)}
                    />
                    <button
                      onClick={() => eliminarFila(filaIndex)}
                      className="text-secondary/60 hover:text-red-500 p-1"
                      title="Eliminar franja"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* ── DESKTOP VIEW: GRILLA COMPLETA CON NEUMORPHISM TABLE ── */}
        {/* ══════════════════════════════════════════════════════════ */}
        <div className="hidden md:flex flex-col gap-6">
          
          {/* Header Actions Desktop */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-display-lg text-4xl lg:text-5xl text-accent-violet uppercase tracking-tight font-extrabold leading-tight">
                GRILLA SEMANAL DE HORARIOS LECTIVOS
              </h1>
              <p className="text-sm text-secondary mt-1 font-semibold">
                Organizador semanal interactivo de módulos, cursos y horarios escolares.
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
                className="neu-raised bg-accent-violet text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-accent-violet/90 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto pb-6">
            <div className="min-w-[1050px] flex flex-col gap-4">
              
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-gutter">
                <div className="neu-header-pill rounded-2xl py-4 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider">
                  Hora
                </div>
                {DIAS.map((dia) => (
                  <div
                    key={`desk-head-${dia}`}
                    className="neu-header-pill rounded-2xl py-4 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider"
                  >
                    {dia}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filas.map((fila, filaIndex) => (
                <div key={`desk-row-${filaIndex}`} className="grid grid-cols-6 gap-gutter items-stretch">
                  
                  {/* Hora */}
                  <div className="neu-raised rounded-2xl p-3.5 flex flex-col items-center justify-center text-accent-violet font-bold text-center h-full min-h-[90px] relative group">
                    <textarea
                      rows={2}
                      placeholder="12:20 a&#10;13:40"
                      value={fila.hora}
                      onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                      className="w-full bg-transparent text-center font-extrabold text-xs text-accent-violet focus:outline-none resize-none leading-tight"
                    />

                    {/* Up / Down Controls */}
                    <div className="absolute right-1.5 top-1.5 flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moverFila(filaIndex, 'arriba')}
                        disabled={filaIndex === 0}
                        className="w-4 h-4 flex items-center justify-center text-secondary hover:text-accent-violet disabled:opacity-20"
                        title="Subir franja"
                      >
                        <span className="material-symbols-outlined text-[14px] leading-none">arrow_drop_up</span>
                      </button>
                      <button
                        onClick={() => moverFila(filaIndex, 'abajo')}
                        disabled={filaIndex === filas.length - 1}
                        className="w-4 h-4 flex items-center justify-center text-secondary hover:text-accent-violet disabled:opacity-20"
                        title="Bajar franja"
                      >
                        <span className="material-symbols-outlined text-[14px] leading-none">arrow_drop_down</span>
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarFila(filaIndex)}
                      className="absolute left-1.5 top-1.5 w-4 h-4 flex items-center justify-center text-secondary hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar fila"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>

                  {/* Day Cells */}
                  {DIAS.map((dia) => {
                    const celda = fila.celdas[dia];
                    const tieneContenido = celda.descripcion.trim() !== '';

                    return (
                      <div
                        key={`desk-cell-${filaIndex}-${dia}`}
                        className={`rounded-2xl transition-all h-full min-h-[90px] ${
                          tieneContenido ? 'neu-subject-card p-3' : 'neu-inset p-2.5'
                        }`}
                      >
                        <textarea
                          placeholder="Materia / Nota"
                          value={celda.descripcion}
                          onChange={(e) => actualizarCelda(filaIndex, dia, e.target.value)}
                          className={`w-full h-full min-h-[70px] bg-transparent resize-none focus:outline-none text-xs leading-relaxed ${
                            tieneContenido
                              ? 'text-on-surface font-bold placeholder:text-secondary/50'
                              : 'text-secondary/80 font-medium placeholder:text-secondary/40'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Modal para Editar Franja Horaria (Móvil) ── */}
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
                  className="flex-1 py-2.5 rounded-xl bg-accent-violet text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95"
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