'use client';

import { useEffect, useState } from 'react';
import Cargando from '../shared/Cargando';
import { getToken } from '@/lib/token';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;
type Dia = typeof DIAS[number];

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

export default function Horario() {
  const [filas, setFilas] = useState<Fila[]>([nuevaFila()]);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [diaActivoMobile, setDiaActivoMobile] = useState<Dia | 'todos'>('todos');

  useEffect(() => {
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

  const agregarFila = () => setFilas((prev) => [...prev, nuevaFila()]);

  const eliminarFila = (filaIndex: number) => {
    if (filas.length <= 1) {
      setFilas([nuevaFila()]);
      return;
    }
    setFilas((prev) => prev.filter((_, i) => i !== filaIndex));
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
        
        {/* ── Page Header & Actions ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="font-display-lg text-3xl md:text-5xl text-accent-violet uppercase tracking-tight font-extrabold leading-tight">
              GRILLA SEMANAL DE HORARIOS LECTIVOS
            </h1>
            <p className="text-xs text-secondary mt-1 font-semibold">
              Planificación horaria semanal por módulos y materias.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={agregarFila}
              className="neu-inset px-5 py-3 rounded-2xl text-accent-violet font-bold text-xs uppercase tracking-wider flex-1 md:flex-none flex items-center justify-center gap-2 hover:bg-[#D6DCE5] active:scale-95 transition-all shadow-sm"
              title="Agregar nueva franja horaria"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Agregar hora
            </button>

            <button
              onClick={guardarTodo}
              disabled={guardando}
              className="neu-raised bg-accent-violet text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex-1 md:flex-none flex items-center justify-center gap-2 hover:bg-accent-violet/90 active:scale-95 transition-all shadow-md disabled:opacity-50"
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

        {/* ── Selector de Vista Rápida para Móviles ── */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-thin">
          <button
            onClick={() => setDiaActivoMobile('todos')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              diaActivoMobile === 'todos'
                ? 'bg-accent-violet text-white shadow-sm'
                : 'bg-surface-bg neu-raised text-secondary hover:text-accent-violet'
            }`}
          >
            Grilla Completa ⊞
          </button>
          {DIAS.map((dia) => (
            <button
              key={`tab-mob-${dia}`}
              onClick={() => setDiaActivoMobile(dia)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                diaActivoMobile === dia
                  ? 'bg-accent-violet text-white shadow-sm'
                  : 'bg-surface-bg neu-raised text-secondary hover:text-accent-violet'
              }`}
            >
              {dia}
            </button>
          ))}
        </div>

        {/* ── Mobile Day View (cuando se selecciona un día específico) ── */}
        {diaActivoMobile !== 'todos' && (
          <div className="flex flex-col gap-4 md:hidden mb-8">
            <div className="neu-header-pill rounded-2xl p-4 flex justify-between items-center text-accent-violet font-bold font-headline-md">
              <span>{diaActivoMobile}</span>
              <span className="text-xs font-semibold text-secondary">
                {filas.filter((f) => f.celdas[diaActivoMobile].descripcion.trim()).length} módulos
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {filas.map((fila, filaIndex) => {
                const tieneContenido = fila.celdas[diaActivoMobile].descripcion.trim() !== '';
                return (
                  <div
                    key={`mob-row-${diaActivoMobile}-${filaIndex}`}
                    className={`rounded-2xl p-4 flex flex-col gap-2.5 transition-all ${
                      tieneContenido ? 'neu-subject-card' : 'neu-raised'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-accent-violet">schedule</span>
                        <input
                          type="text"
                          value={fila.hora}
                          onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                          placeholder="08:00 a 09:20"
                          className="bg-transparent font-bold text-xs text-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet/30 rounded px-1"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moverFila(filaIndex, 'arriba')}
                          disabled={filaIndex === 0}
                          className="w-6 h-6 rounded neu-inset flex items-center justify-center text-secondary disabled:opacity-30"
                          title="Subir franja"
                        >
                          <span className="material-symbols-outlined text-xs">arrow_drop_up</span>
                        </button>
                        <button
                          onClick={() => moverFila(filaIndex, 'abajo')}
                          disabled={filaIndex === filas.length - 1}
                          className="w-6 h-6 rounded neu-inset flex items-center justify-center text-secondary disabled:opacity-30"
                          title="Bajar franja"
                        >
                          <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
                        </button>
                        <button
                          onClick={() => eliminarFila(filaIndex)}
                          className="w-6 h-6 rounded neu-inset flex items-center justify-center text-red-500 hover:text-red-700"
                          title="Eliminar franja"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    </div>

                    <textarea
                      placeholder="Materia / Escuela / Aula..."
                      value={fila.celdas[diaActivoMobile].descripcion}
                      onChange={(e) => actualizarCelda(filaIndex, diaActivoMobile, e.target.value)}
                      rows={2}
                      className="w-full bg-surface-bg neu-inset rounded-xl p-3 text-xs text-on-surface font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-accent-violet/30 placeholder:text-secondary/50"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Weekly Grid Layout (Neumorphic Table con Scroll Horizontal) ── */}
        <div className={`w-full overflow-x-auto pb-6 ${diaActivoMobile !== 'todos' ? 'hidden md:block' : 'block'}`}>
          <div className="min-w-[1050px] flex flex-col gap-4">
            
            {/* Column Headers */}
            <div className="grid grid-cols-6 gap-gutter">
              <div className="neu-header-pill rounded-2xl py-4 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider">
                Hora
              </div>
              {DIAS.map((dia) => (
                <div
                  key={`header-${dia}`}
                  className="neu-header-pill rounded-2xl py-4 flex items-center justify-center text-accent-violet font-extrabold text-sm uppercase tracking-wider"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            {filas.map((fila, filaIndex) => (
              <div key={`grid-row-${filaIndex}`} className="grid grid-cols-6 gap-gutter items-stretch">
                
                {/* Columna Hora */}
                <div className="neu-raised rounded-2xl p-3.5 flex flex-col items-center justify-center text-accent-violet font-bold text-center h-full min-h-[90px] relative group">
                  <textarea
                    rows={2}
                    placeholder="12:20 a&#10;13:40"
                    value={fila.hora}
                    onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                    className="w-full bg-transparent text-center font-extrabold text-xs text-accent-violet focus:outline-none resize-none leading-tight"
                  />
                  
                  {/* Controles de orden y eliminar fila */}
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

                {/* Columnas Días */}
                {DIAS.map((dia) => {
                  const celda = fila.celdas[dia];
                  const tieneContenido = celda.descripcion.trim() !== '';

                  return (
                    <div
                      key={`celda-${filaIndex}-${dia}`}
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