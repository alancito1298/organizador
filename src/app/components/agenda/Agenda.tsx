'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/token';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type AgendaItem = {
  id: number;
  fecha: string;
  descripcion: string;
};

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const toKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const hoyKey = () => {
  const h = new Date();
  return toKey(h.getFullYear(), h.getMonth(), h.getDate());
};

export default function AgendaCalendario() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalVer, setModalVer] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('');
  const [notasDia, setNotasDia] = useState<AgendaItem[]>([]);
  const [descripcion, setDescripcion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  useEffect(() => {
    fetchAgenda();
  }, []);

  const fetchAgenda = async () => {
    setCargando(true);
    const token = getToken();
    try {
      const res = await fetch(`${API}/agenda`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: AgendaItem[] = await res.json();
        setAgendaItems(data);
      }
    } catch (e) {
      console.error('Error fetching agenda:', e);
    } finally {
      setCargando(false);
    }
  };

  const diasConNotas = new Set(
    agendaItems.map((i) => i.fecha.split('T')[0])
  );

  // Construir grilla del mes
  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0).getDate();
  // Lunes = 0 ... Domingo = 6
  let offsetInicio = primerDia.getDay() - 1;
  if (offsetInicio < 0) offsetInicio = 6;

  const celdas: (number | null)[] = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: ultimoDia }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  const navMes = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  const irAHoy = () => {
    const h = new Date();
    setMonth(h.getMonth());
    setYear(h.getFullYear());
  };

  const handleClickDia = (dia: number) => {
    const key = toKey(year, month, dia);
    const notas = agendaItems.filter((i) => i.fecha.split('T')[0] === key);
    setDiaSeleccionado(key);
    if (notas.length > 0) {
      setNotasDia(notas);
      setModalVer(true);
    } else {
      setDescripcion('');
      setModalAgregar(true);
    }
  };

  const abrirAgregarDia = (key: string) => {
    setDiaSeleccionado(key);
    setDescripcion('');
    setModalVer(false);
    setModalAgregar(true);
  };

  const guardarNota = async () => {
    if (!descripcion.trim() || !diaSeleccionado) return;
    setGuardando(true);
    const token = getToken();
    try {
      const res = await fetch(`${API}/agenda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fecha: new Date(diaSeleccionado + 'T12:00:00').toISOString(),
          descripcion: descripcion.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setModalAgregar(false);
      setDescripcion('');
      await fetchAgenda();
    } catch {
      alert('❌ Error al guardar la nota');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarNota = async (id: number) => {
    setEliminandoId(id);
    const token = getToken();
    try {
      const res = await fetch(`${API}/agenda/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setNotasDia((prev) => prev.filter((n) => n.id !== id));
      await fetchAgenda();
    } catch {
      alert('❌ Error al eliminar');
    } finally {
      setEliminandoId(null);
    }
  };

  const formatDia = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  // Eventos del mes activo
  const eventosMesActivo = agendaItems
    .filter(item => {
      const [y, m] = item.fecha.split('T')[0].split('-').map(Number);
      return y === year && m - 1 === month;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const esMesActual = year === new Date().getFullYear() && month === new Date().getMonth();

  return (
    <div className="w-full min-h-screen bg-surface-bg text-text-main flex flex-col font-mulish antialiased">
      <main className="flex-grow max-w-4xl w-full mx-auto pb-28 pt-28 md:pt-36 px-4 md:px-margin-page flex flex-col gap-6">
        
        {/* ── Encabezado de Página ── */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface tracking-tight">
              Agenda Docente
            </h1>
            <p className="font-body-lg text-secondary text-sm md:text-base mt-1">
              Organizá tus fechas, eventos y actividades escolares.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!esMesActual && (
              <button
                onClick={irAHoy}
                className="px-4 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Mes Actual
              </button>
            )}
            <button
              onClick={() => abrirAgregarDia(hoyKey())}
              className="px-4 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:opacity-80 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Nuevo Evento
            </button>
          </div>
        </header>

        {/* ── Tarjeta Almanaque Neumórfico ── */}
        <div className="bg-surface-bg neumorphic-raised rounded-3xl p-5 md:p-8 flex flex-col gap-6">
          {/* Cabecera del Calendario con navegación */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
            <button
              onClick={() => navMes(-1)}
              aria-label="Mes anterior"
              className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-center text-accent-violet hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            <div className="text-center">
              <h2 className="font-headline-md text-2xl md:text-3xl text-accent-violet tracking-wide capitalize">
                {MESES[month]} <span className="font-normal text-secondary">{year}</span>
              </h2>
            </div>

            <button
              onClick={() => navMes(1)}
              aria-label="Mes siguiente"
              className="w-10 h-10 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-center text-accent-violet hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
            {DIAS.map((d) => (
              <div key={d} className="font-label-caps text-secondary text-xs font-bold uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {celdas.map((dia, idx) => {
              if (!dia) return <div key={`empty-${idx}`} className="aspect-square" />;

              const key = toKey(year, month, dia);
              const esHoy = key === hoyKey();
              const tieneNota = diasConNotas.has(key);

              return (
                <button
                  key={key}
                  onClick={() => handleClickDia(dia)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative font-bold text-sm md:text-base transition-all active:scale-95 group ${
                    esHoy
                      ? 'bg-accent-violet text-white shadow-md scale-[1.03] z-10 ring-2 ring-accent-violet/30'
                      : tieneNota
                      ? 'bg-surface-bg neumorphic-inset text-accent-violet font-extrabold hover:scale-105'
                      : 'bg-surface-bg neumorphic-raised text-text-main hover:text-accent-violet hover:scale-105'
                  }`}
                >
                  <span>{dia}</span>

                  {/* Indicador de evento */}
                  {tieneNota && !esHoy && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-violet absolute bottom-1.5 shadow-sm" />
                  )}
                  {tieneNota && esHoy && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-1.5 shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Eventos del Mes Seleccionado ── */}
        <section className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-label-caps text-secondary tracking-wider uppercase font-bold">
              {eventosMesActivo.length} {eventosMesActivo.length === 1 ? 'EVENTO EN' : 'EVENTOS EN'} {MESES[month].toUpperCase()}
            </h3>
            <button
              onClick={() => abrirAgregarDia(hoyKey())}
              className="flex items-center gap-1 text-accent-violet font-bold text-sm hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Agendar
            </button>
          </div>

          {cargando && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface-bg rounded-xl p-3.5 flex items-center gap-4 neumorphic-raised animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-outline-variant/30 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-outline-variant/30 rounded w-3/4" />
                    <div className="h-3 bg-outline-variant/20 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!cargando && eventosMesActivo.length === 0 && (
            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-8 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-secondary">event_available</span>
              <p className="font-bold text-sm text-text-main">No hay eventos para {MESES[month]} {year}</p>
              <p className="text-xs text-secondary">Tocá cualquier día del calendario o el botón agendar para crear un recordatorio.</p>
              <button
                onClick={() => abrirAgregarDia(hoyKey())}
                className="mt-2 px-4 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                Crear primer evento
              </button>
            </div>
          )}

          {!cargando && eventosMesActivo.length > 0 && (
            <div className="flex flex-col gap-3">
              {eventosMesActivo.map((ev) => {
                const diaNum = Number(ev.fecha.split('T')[0].split('-')[2]);
                const key = ev.fecha.split('T')[0];
                const esHoy = key === hoyKey();

                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      setDiaSeleccionado(key);
                      setNotasDia(agendaItems.filter(i => i.fecha.split('T')[0] === key));
                      setModalVer(true);
                    }}
                    className={`bg-surface-bg rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-98 ${
                      esHoy ? 'neumorphic-inset border-l-4 border-accent-violet' : 'neumorphic-raised'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl neumorphic-inset flex flex-col items-center justify-center text-accent-violet shrink-0">
                      <span className="text-[10px] font-bold leading-none uppercase">DÍA</span>
                      <span className="text-lg font-extrabold leading-none mt-0.5">{diaNum}</span>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="font-bold text-on-surface text-sm truncate">
                        {ev.descripcion}
                      </h4>
                      <span className="text-xs text-secondary mt-0.5">
                        {esHoy ? '📌 Hoy' : `${diaNum} de ${MESES[month]}`}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNota(ev.id);
                      }}
                      disabled={eliminandoId === ev.id}
                      className="w-9 h-9 rounded-xl neumorphic-raised flex items-center justify-center text-red-500 hover:text-red-700 active:scale-95 transition-all shrink-0"
                      title="Eliminar evento"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* ── Modal Agregar Nota ── */}
      {modalAgregar && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 border border-white/60 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-xl text-accent-violet">📝 Nueva Nota</h3>
                <span className="text-xs text-secondary capitalize mt-0.5 block">{formatDia(diaSeleccionado)}</span>
              </div>
              <button
                onClick={() => setModalAgregar(false)}
                className="w-8 h-8 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-text-main"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: 📝 Examen 2° trimestre Historia 2° o 🎓 Jornada institucional..."
              rows={4}
              autoFocus
              className="w-full bg-surface-bg neumorphic-inset rounded-2xl p-4 text-sm text-text-main placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-violet/40 resize-none font-mulish"
            />

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setModalAgregar(false)}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={guardarNota}
                disabled={guardando || !descripcion.trim()}
                className="px-5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Ver Notas del Día ── */}
      {modalVer && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-surface-bg neumorphic-raised rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 border border-white/60 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-xl text-accent-violet">📅 Eventos del Día</h3>
                <span className="text-xs text-secondary capitalize mt-0.5 block">{formatDia(diaSeleccionado)}</span>
              </div>
              <button
                onClick={() => setModalVer(false)}
                className="w-8 h-8 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-text-main"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
              {notasDia.map((nota) => (
                <div key={nota.id} className="flex items-center justify-between bg-surface-bg neumorphic-inset rounded-xl p-3 gap-3">
                  <p className="text-sm font-semibold text-text-main flex-1">{nota.descripcion}</p>
                  <button
                    onClick={() => eliminarNota(nota.id)}
                    disabled={eliminandoId === nota.id}
                    className="w-8 h-8 rounded-lg neumorphic-raised flex items-center justify-center text-red-500 hover:text-red-700 transition-all shrink-0"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setModalVer(false)}
                className="px-4 py-2 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={() => abrirAgregarDia(diaSeleccionado)}
                className="px-4 py-2 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Agregar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}