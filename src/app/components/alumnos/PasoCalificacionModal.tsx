'use client';

import { useState } from 'react';
import { getToken } from '@/lib/token';
import { enqueueSyncAction } from '@/app/utils/offlineSync';
import type { AlumnoConStats } from '@/app/types/alumnos';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

export type TipoEvaluacion = 'trabajo_practico' | 'Examen' | 'final';

type Props = {
  abierto: boolean;
  alumnos: AlumnoConStats[];
  cursoInfo: { materia: string; escuela: string; anio: string } | null;
  trimestreActual?: number;
  onCerrar: () => void;
  onFinalizado: () => void;
};

export default function PasoCalificacionModal({
  abierto,
  alumnos,
  cursoInfo,
  trimestreActual = 1,
  onCerrar,
  onFinalizado,
}: Props) {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoyStr);
  const [tipo, setTipo] = useState<TipoEvaluacion>('trabajo_practico');
  const [trimestre, setTrimestre] = useState<number>(trimestreActual);
  const [paso, setPaso] = useState<'bucle' | 'resumen'>('bucle');
  const [indiceActual, setIndiceActual] = useState(0);
  const [notas, setNotas] = useState<Record<number, string>>({});
  const [inputManual, setInputManual] = useState('');
  const [guardando, setGuardando] = useState(false);

  if (!abierto || alumnos.length === 0) return null;

  const alumnoActual = alumnos[indiceActual];
  const progresoPorcentaje = Math.round(((indiceActual + 1) / alumnos.length) * 100);

  const registrarNota = (valor: string | number) => {
    const strVal = String(valor).trim().replace(',', '.');
    setNotas((prev) => ({
      ...prev,
      [alumnoActual.alumnoCursoId]: strVal,
    }));
    setInputManual('');

    if (indiceActual + 1 < alumnos.length) {
      setIndiceActual((prev) => prev + 1);
    } else {
      setPaso('resumen');
    }
  };

  const dejarSinNota = () => {
    setNotas((prev) => {
      const copy = { ...prev };
      delete copy[alumnoActual.alumnoCursoId];
      return copy;
    });
    setInputManual('');

    if (indiceActual + 1 < alumnos.length) {
      setIndiceActual((prev) => prev + 1);
    } else {
      setPaso('resumen');
    }
  };

  const irAnterior = () => {
    if (indiceActual > 0) {
      setIndiceActual((prev) => prev - 1);
      setInputManual('');
    }
  };

  const saltar = () => {
    setInputManual('');
    if (indiceActual + 1 < alumnos.length) {
      setIndiceActual((prev) => prev + 1);
    } else {
      setPaso('resumen');
    }
  };

  const cambiarEnResumen = (alumnoCursoId: number, val: string) => {
    const strVal = val.trim().replace(',', '.');
    setNotas((prev) => {
      if (!strVal) {
        const copy = { ...prev };
        delete copy[alumnoCursoId];
        return copy;
      }
      return {
        ...prev,
        [alumnoCursoId]: strVal,
      };
    });
  };

  const calcularMetricas = () => {
    const valoresValidos = Object.values(notas)
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v) && v > 0);

    const total = valoresValidos.length;
    if (total === 0) {
      return { total: 0, promedio: '-', aprobados: 0, desaprobados: 0 };
    }

    const suma = valoresValidos.reduce((acc, n) => acc + n, 0);
    const promedio = (suma / total).toFixed(1);
    const aprobados = valoresValidos.filter((n) => n >= 6).length;
    const desaprobados = valoresValidos.filter((n) => n < 6).length;

    return { total, promedio, aprobados, desaprobados };
  };

  const guardarCalificaciones = async () => {
    const entradas = Object.entries(notas).filter(([, val]) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1 && num <= 10;
    });

    if (entradas.length === 0) {
      alert('⚠️ No se ingresó ninguna calificación válida (entre 1 y 10).');
      return;
    }

    setGuardando(true);
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const fechaISO = new Date(fecha + 'T12:00:00').toISOString();
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    let guardadosOffline = 0;

    try {
      const promesas = entradas.map(async ([alumnoCursoIdStr, valorStr]) => {
        const alumnoCursoId = Number(alumnoCursoIdStr);
        const valorNum = parseFloat(valorStr);
        const payload = {
          alumnoCursoId,
          valor: valorNum,
          fecha: fechaISO,
          tipo,
          trimestre: Number(trimestre),
        };

        if (isOffline) {
          enqueueSyncAction({
            url: `${API}/calificaciones`,
            method: 'POST',
            body: payload,
            tipo: 'calificacion',
            descripcion: `Calificación ${tipo} (${valorNum})`,
          });
          guardadosOffline++;
          return null;
        } else {
          return fetch(`${API}/calificaciones`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
          }).catch(() => {
            enqueueSyncAction({
              url: `${API}/calificaciones`,
              method: 'POST',
              body: payload,
              tipo: 'calificacion',
              descripcion: `Calificación ${tipo} (${valorNum})`,
            });
            return null;
          });
        }
      });

      await Promise.all(promesas);

      if (isOffline) {
        alert(`⚡ Modo Offline: ${guardadosOffline} calificaciones guardadas en tu dispositivo. Se sincronizarán al reconectar.`);
      } else {
        alert(`✅ ${entradas.length} calificaciones registradas con éxito.`);
      }

      onFinalizado();
      onCerrar();
    } catch (e) {
      console.error('Error al guardar calificaciones:', e);
      alert('❌ Ocurrió un problema al registrar las notas.');
    } finally {
      setGuardando(false);
    }
  };

  const metricas = calcularMetricas();
  const notaActualAlumno = notas[alumnoActual?.alumnoCursoId];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !guardando) onCerrar();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-5 md:p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col gap-5 border border-white/60 shadow-2xl font-mulish">
        
        {/* ── HEADER DEL MODAL ── */}
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
          <div>
            <h3 className="font-headline-md text-xl md:text-2xl text-accent-violet flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
              Cargar Calificaciones
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              {cursoInfo?.materia ? `${cursoInfo.materia} (${cursoInfo.escuela})` : 'Clase en curso'}
            </p>
          </div>

          <button
            onClick={onCerrar}
            disabled={guardando}
            className="w-9 h-9 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-red-500 active:scale-95 transition-all"
            title="Cerrar modal"
          >
            <span className="material-symbols-outlined text-lg font-bold">close</span>
          </button>
        </div>

        {/* ── SELECTORES: TIPO DE EVALUACIÓN, TRIMESTRE Y FECHA ── */}
        <div className="flex flex-col gap-2.5 bg-surface-bg neumorphic-inset rounded-2xl p-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Tipo de Evaluación */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                Tipo:
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoEvaluacion)}
                className="bg-white/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-accent-violet border border-violet-200/50 focus:outline-none focus:ring-1 focus:ring-accent-violet"
              >
                <option value="trabajo_practico">Trabajo Práctico (TP)</option>
                <option value="Examen">Examen / Parcial</option>
                <option value="final">Evaluación Final</option>
              </select>
            </div>

            {/* Trimestre */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-secondary tracking-wider">
                Trimestre:
              </label>
              <select
                value={trimestre}
                onChange={(e) => setTrimestre(Number(e.target.value))}
                className="bg-white/80 rounded-xl px-2.5 py-1.5 text-xs font-bold text-accent-violet border border-violet-200/50 focus:outline-none focus:ring-1 focus:ring-accent-violet"
              >
                <option value={1}>1° Trimestre</option>
                <option value={2}>2° Trimestre</option>
                <option value={3}>3° Trimestre</option>
              </select>
            </div>
          </div>

          {/* Selector de Fecha */}
          <div className="flex items-center justify-between pt-1 border-t border-violet-100/60">
            <span className="font-label-caps text-secondary text-xs uppercase font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">calendar_today</span> Fecha:
            </span>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-transparent text-sm font-bold text-accent-violet focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* ── PASO 1: BUCLE ALUMNO POR ALUMNO ── */}
        {paso === 'bucle' && alumnoActual && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-150">
            {/* Barra de progreso */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold text-secondary">
                <span>Alumno {indiceActual + 1} de {alumnos.length}</span>
                <span>{progresoPorcentaje}%</span>
              </div>
              <div className="w-full bg-surface-bg neumorphic-inset rounded-full h-3 p-0.5">
                <div
                  className="bg-accent-violet h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>
            </div>

            {/* Tarjeta del alumno actual */}
            <div className="bg-surface-bg neumorphic-inset rounded-3xl p-5 flex flex-col items-center justify-center gap-2.5 text-center my-0.5">
              <div className="w-16 h-16 rounded-2xl bg-surface-bg neumorphic-raised flex items-center justify-center text-accent-violet font-extrabold text-2xl shadow-md">
                {alumnoActual.nombre.charAt(0)}{alumnoActual.apellido.charAt(0)}
              </div>
              <div>
                <h4 className="font-headline-md text-xl md:text-2xl text-on-surface uppercase tracking-tight font-extrabold">
                  {alumnoActual.apellido}, {alumnoActual.nombre}
                </h4>
                {alumnoActual.promedioGeneral ? (
                  <p className="text-xs text-secondary mt-0.5 font-semibold">
                    Promedio actual: <b className="text-accent-violet">{alumnoActual.promedioGeneral}/10</b>
                  </p>
                ) : null}
              </div>

              {/* Nota previamente asignada si existe */}
              {notaActualAlumno ? (
                <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  parseFloat(notaActualAlumno) >= 6
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  Nota asignada: {notaActualAlumno}
                </span>
              ) : (
                <span className="text-[11px] text-secondary font-medium italic">
                  Sin nota asignada en esta evaluación
                </span>
              )}
            </div>

            {/* Teclado rápido de notas (1 al 10) */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider text-center">
                Elegir nota rápida (1 toque asigna y avanza):
              </span>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const esAprobado = num >= 6;
                  const estaSeleccionado = notaActualAlumno === String(num);
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => registrarNota(num)}
                      className={`py-3 rounded-2xl font-extrabold text-base md:text-lg flex items-center justify-center transition-all active:scale-90 ${
                        estaSeleccionado
                          ? 'bg-accent-violet text-white shadow-md scale-105 ring-2 ring-violet-300'
                          : esAprobado
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200/60 shadow-sm'
                          : 'bg-rose-50 text-rose-800 hover:bg-rose-600 hover:text-white border border-rose-200/60 shadow-sm'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input manual para notas decimales (ej. 7.50) */}
            <div className="flex items-center gap-2 bg-surface-bg neumorphic-inset rounded-2xl p-1.5 px-3">
              <span className="text-xs font-bold text-secondary shrink-0">Nota con decimal:</span>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                placeholder="Ej: 8.5"
                value={inputManual}
                onChange={(e) => setInputManual(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputManual.trim()) {
                    registrarNota(inputManual);
                  }
                }}
                className="flex-1 bg-white rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface border border-violet-200/60 focus:outline-none focus:ring-1 focus:ring-accent-violet"
              />
              <button
                type="button"
                onClick={() => {
                  if (inputManual.trim()) registrarNota(inputManual);
                }}
                disabled={!inputManual.trim()}
                className="px-3 py-1.5 rounded-xl bg-accent-violet text-white font-bold text-xs uppercase disabled:opacity-40 active:scale-95 transition-all shadow-sm"
              >
                Aplicar
              </button>
            </div>

            {/* Botones de navegación del bucle */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-violet-100/60">
              <button
                type="button"
                onClick={irAnterior}
                disabled={indiceActual === 0}
                className="px-3.5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-accent-violet active:scale-95 transition-all disabled:opacity-40"
              >
                ← Anterior
              </button>

              <button
                type="button"
                onClick={dejarSinNota}
                className="px-3.5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-amber-700 font-bold text-xs uppercase tracking-wider hover:bg-amber-50 active:scale-95 transition-all"
                title="Dejar a este alumno sin nota registrada"
              >
                Sin Nota
              </button>

              <button
                type="button"
                onClick={saltar}
                className="px-3.5 py-2 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-accent-violet active:scale-95 transition-all"
              >
                Saltar →
              </button>
            </div>

            {/* Botón directo para pasar a la vista de resumen */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => setPaso('resumen')}
                className="text-xs font-extrabold text-accent-violet hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">checklist</span>
                Ver resumen y editar lista ({Object.keys(notas).length} notas ingresadas)
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: RESUMEN Y CONFIRMACIÓN PREVIA A GUARDAR ── */}
        {paso === 'resumen' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Tarjetas de métricas de la evaluación */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl font-extrabold text-accent-violet">{metricas.promedio}</span>
                <span className="text-[10px] font-bold text-secondary uppercase mt-0.5">Promedio</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl font-extrabold text-emerald-600">{metricas.aprobados}</span>
                <span className="text-[10px] font-bold text-secondary uppercase mt-0.5">Aprobados</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl font-extrabold text-rose-600">{metricas.desaprobados}</span>
                <span className="text-[10px] font-bold text-secondary uppercase mt-0.5">Desaprob.</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl font-extrabold text-on-surface">{metricas.total}</span>
                <span className="text-[10px] font-bold text-secondary uppercase mt-0.5">Total</span>
              </div>
            </div>

            {/* Listado de verificación rápida con input para cada alumno */}
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              <span className="font-label-caps text-secondary text-[11px] uppercase font-bold px-1 flex items-center justify-between">
                <span>Alumnos del curso ({alumnos.length}):</span>
                <span className="text-accent-violet font-extrabold">{metricas.total} calificados</span>
              </span>

              {alumnos.map((alum) => {
                const val = notas[alum.alumnoCursoId] || '';
                const num = parseFloat(val);
                const esAprobado = !isNaN(num) && num >= 6;
                const esDesaprobado = !isNaN(num) && num < 6;

                return (
                  <div
                    key={alum.id}
                    className="bg-surface-bg neumorphic-inset rounded-xl p-2.5 px-3 flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-xs text-on-surface truncate flex-1">
                      {alum.apellido}, {alum.nombre}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        placeholder="-"
                        value={val}
                        onChange={(e) => cambiarEnResumen(alum.alumnoCursoId, e.target.value)}
                        className={`w-16 text-center py-1 rounded-lg text-xs font-extrabold border transition-all ${
                          esAprobado
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : esDesaprobado
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-white text-secondary border-violet-200'
                        } focus:outline-none focus:ring-1 focus:ring-accent-violet`}
                      />

                      {val ? (
                        <button
                          type="button"
                          onClick={() => cambiarEnResumen(alum.alumnoCursoId, '')}
                          className="text-secondary hover:text-red-500 text-xs p-1"
                          title="Borrar nota"
                        >
                          ✕
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botones de acción del resumen */}
            <div className="flex gap-2.5 justify-end pt-2 border-t border-violet-100/60">
              <button
                type="button"
                onClick={() => setPaso('bucle')}
                disabled={guardando}
                className="px-3.5 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                ← Volver al bucle
              </button>

              <button
                type="button"
                onClick={guardarCalificaciones}
                disabled={guardando || metricas.total === 0}
                className="px-5 py-2.5 rounded-xl bg-accent-violet hover:bg-accent-violet/90 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {guardando ? (
                  <>Guardando notas...</>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Confirmar ({metricas.total})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
