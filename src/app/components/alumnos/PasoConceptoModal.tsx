'use client';

import { useState } from 'react';
import { getToken } from '@/lib/token';
import type { AlumnoConStats } from '@/app/types/alumnos';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

export type TipoConcepto = 'buen_concepto' | 'regular' | 'mal_concepto' | 'ausente';

type Props = {
  abierto: boolean;
  alumnos: AlumnoConStats[];
  cursoInfo: { materia: string; escuela: string; anio: string } | null;
  onCerrar: () => void;
  onFinalizado: () => void;
};

export default function PasoConceptoModal({
  abierto,
  alumnos,
  cursoInfo,
  onCerrar,
  onFinalizado,
}: Props) {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoyStr);
  const [paso, setPaso] = useState<'bucle' | 'resumen'>('bucle');
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, TipoConcepto>>({});
  const [guardando, setGuardando] = useState(false);

  if (!abierto || alumnos.length === 0) return null;

  const alumnoActual = alumnos[indiceActual];
  const progresoPorcentaje = Math.round(((indiceActual + 1) / alumnos.length) * 100);

  const registrarConcepto = (concepto: TipoConcepto) => {
    setRespuestas((prev) => ({
      ...prev,
      [alumnoActual.alumnoCursoId]: concepto,
    }));

    if (indiceActual + 1 < alumnos.length) {
      setIndiceActual((prev) => prev + 1);
    } else {
      setPaso('resumen');
    }
  };

  const irAnterior = () => {
    if (indiceActual > 0) {
      setIndiceActual((prev) => prev - 1);
    }
  };

  const saltar = () => {
    if (indiceActual + 1 < alumnos.length) {
      setIndiceActual((prev) => prev + 1);
    } else {
      setPaso('resumen');
    }
  };

  const cambiarEnResumen = (alumnoCursoId: number, nuevoConcepto: TipoConcepto) => {
    setRespuestas((prev) => ({
      ...prev,
      [alumnoCursoId]: nuevoConcepto,
    }));
  };

  const contarConceptos = () => {
    let buenos = 0;
    let regulares = 0;
    let malos = 0;
    let ausentes = 0;

    Object.values(respuestas).forEach((c) => {
      if (c === 'buen_concepto') buenos++;
      else if (c === 'regular') regulares++;
      else if (c === 'mal_concepto') malos++;
      else if (c === 'ausente') ausentes++;
    });

    return { buenos, regulares, malos, ausentes, total: Object.keys(respuestas).length };
  };

  const guardarConceptos = async () => {
    setGuardando(true);
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const fechaISO = new Date(fecha + 'T12:00:00').toISOString();

    try {
      const promesas = Object.entries(respuestas).map(async ([alumnoCursoId, concepto]) => {
        // Mapear concepto al estado de asistencia/concepto del backend
        let estadoBackend = 'presente_buen_concepto';
        if (concepto === 'mal_concepto') {
          estadoBackend = 'presente_mal_concepto';
        } else if (concepto === 'regular') {
          estadoBackend = 'presente_buen_concepto';
        } else if (concepto === 'ausente') {
          estadoBackend = 'ausente';
        }

        const trimestreActivo = Number(localStorage.getItem('trimestreActivo')) || 1;
        return fetch(`${API}/asistencias`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            alumnoCursoId: Number(alumnoCursoId),
            fecha: fechaISO,
            estado: estadoBackend,
            trimestre: trimestreActivo,
          }),
        });
      });

      await Promise.all(promesas);

      alert(`✅ Conceptos del día ${fecha} guardados con éxito.`);
      onFinalizado();
      onCerrar();
    } catch (e) {
      console.error('Error guardando conceptos:', e);
      alert('❌ Ocurrió un problema al guardar los conceptos.');
    } finally {
      setGuardando(false);
    }
  };

  const { buenos, regulares, malos, ausentes } = contarConceptos();

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !guardando) onCerrar();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-5 md:p-8 w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col gap-6 border border-white/60 shadow-2xl font-mulish">
        
        {/* ── HEADER DEL MODAL ── */}
        <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
          <div>
            <h3 className="font-headline-md text-xl md:text-2xl text-accent-violet flex items-center gap-2">
              <span>😊</span> Cargar Concepto de Clase
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              {cursoInfo?.materia ? `${cursoInfo.materia} (${cursoInfo.escuela})` : 'Clase en curso'}
            </p>
          </div>

          <button
            onClick={onCerrar}
            disabled={guardando}
            className="w-9 h-9 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-red-500 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-lg font-bold">close</span>
          </button>
        </div>

        {/* ── SELECTOR DE FECHA ── */}
        <div className="flex items-center justify-between bg-surface-bg neumorphic-inset rounded-2xl px-4 py-2.5">
          <span className="font-label-caps text-secondary text-xs uppercase font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">calendar_today</span> Fecha de Clase:
          </span>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-transparent text-sm font-bold text-accent-violet focus:outline-none cursor-pointer"
          />
        </div>

        {/* ── PASO 1: BUCLE DE CARITAS ALUMNO POR ALUMNO ── */}
        {paso === 'bucle' && alumnoActual && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-150">
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
            <div className="bg-surface-bg neumorphic-inset rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-center my-1">
              <div className="w-20 h-20 rounded-3xl bg-surface-bg neumorphic-raised flex items-center justify-center text-accent-violet font-extrabold text-3xl shadow-md">
                {alumnoActual.nombre.charAt(0)}{alumnoActual.apellido.charAt(0)}
              </div>
              <div>
                <h4 className="font-headline-md text-2xl md:text-3xl text-on-surface uppercase tracking-tight">
                  {alumnoActual.apellido}, {alumnoActual.nombre}
                </h4>
                <p className="text-xs text-secondary mt-1 font-semibold">
                  Promedio de Notas: <b className="text-accent-violet">{alumnoActual.promedioGeneral > 0 ? `${alumnoActual.promedioGeneral}/10` : '-'}</b>
                </p>
              </div>

              {/* Estado previo si ya fue marcado */}
              {respuestas[alumnoActual.alumnoCursoId] && (
                <span className="text-[11px] font-bold px-3.5 py-1 rounded-full bg-accent-violet/10 text-accent-violet">
                  Seleccionado: {
                    respuestas[alumnoActual.alumnoCursoId] === 'buen_concepto' ? '🟢 Buen Concepto 😊' :
                    respuestas[alumnoActual.alumnoCursoId] === 'regular' ? '🟡 Regular 😐' :
                    respuestas[alumnoActual.alumnoCursoId] === 'mal_concepto' ? '🔴 Mal Concepto 😞' : '❌ Ausente'
                  }
                </span>
              )}
            </div>

            {/* Botones de las 3 Caritas (Feliz Verde, Neutral Amarillo, Triste Rojo) */}
            <div className="grid grid-cols-3 gap-3">
              {/* 🟢 FELIZ VERDE: Buen Concepto */}
              <button
                onClick={() => registrarConcepto('buen_concepto')}
                className="py-4 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="text-3xl">😊</span>
                <span className="text-xs md:text-sm uppercase tracking-wide leading-tight">Buen<br/>Concepto</span>
              </button>

              {/* 🟡 NEUTRAL AMARILLO: Regular */}
              <button
                onClick={() => registrarConcepto('regular')}
                className="py-4 px-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="text-3xl">😐</span>
                <span className="text-xs md:text-sm uppercase tracking-wide leading-tight">Regular</span>
              </button>

              {/* 🔴 TRISTE ROJO: Mal Concepto */}
              <button
                onClick={() => registrarConcepto('mal_concepto')}
                className="py-4 px-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all text-center"
              >
                <span className="text-3xl">😞</span>
                <span className="text-xs md:text-sm uppercase tracking-wide leading-tight">Mal<br/>Concepto</span>
              </button>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={irAnterior}
                disabled={indiceActual === 0}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-accent-violet active:scale-95 transition-all disabled:opacity-40"
              >
                ← Anterior
              </button>

              <button
                onClick={() => registrarConcepto('ausente')}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-rose-600 active:scale-95 transition-all"
              >
                Ausente
              </button>

              <button
                onClick={saltar}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-accent-violet active:scale-95 transition-all"
              >
                Saltar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: RESUMEN FINAL DE CONCEPTOS ── */}
        {paso === 'resumen' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-150">
            {/* Métricas de Conceptos */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl">😊</span>
                <span className="text-lg font-extrabold text-emerald-600">{buenos}</span>
                <span className="text-[10px] font-bold text-secondary uppercase">Buenos</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl">😐</span>
                <span className="text-lg font-extrabold text-amber-600">{regulares}</span>
                <span className="text-[10px] font-bold text-secondary uppercase">Regular</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl">😞</span>
                <span className="text-lg font-extrabold text-rose-600">{malos}</span>
                <span className="text-[10px] font-bold text-secondary uppercase">Malos</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-2.5 flex flex-col items-center">
                <span className="text-xl">❌</span>
                <span className="text-lg font-extrabold text-secondary">{ausentes}</span>
                <span className="text-[10px] font-bold text-secondary uppercase">Ausente</span>
              </div>
            </div>

            {/* Listado de verificación rápida con caritas */}
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              <span className="font-label-caps text-secondary text-xs uppercase font-bold px-1">
                Verificar Conceptos ({alumnos.length}):
              </span>
              {alumnos.map((alum) => {
                const conc = respuestas[alum.alumnoCursoId] || 'buen_concepto';
                return (
                  <div
                    key={alum.id}
                    className="bg-surface-bg neumorphic-inset rounded-xl p-2.5 flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-xs text-on-surface truncate flex-1">
                      {alum.apellido}, {alum.nombre}
                    </span>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => cambiarEnResumen(alum.alumnoCursoId, 'buen_concepto')}
                        className={`px-2 py-1 rounded-lg text-sm transition-all ${
                          conc === 'buen_concepto'
                            ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                            : 'bg-surface-bg text-secondary opacity-60 hover:opacity-100'
                        }`}
                        title="Buen Concepto"
                      >
                        😊
                      </button>
                      <button
                        onClick={() => cambiarEnResumen(alum.alumnoCursoId, 'regular')}
                        className={`px-2 py-1 rounded-lg text-sm transition-all ${
                          conc === 'regular'
                            ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-400'
                            : 'bg-surface-bg text-secondary opacity-60 hover:opacity-100'
                        }`}
                        title="Regular"
                      >
                        😐
                      </button>
                      <button
                        onClick={() => cambiarEnResumen(alum.alumnoCursoId, 'mal_concepto')}
                        className={`px-2 py-1 rounded-lg text-sm transition-all ${
                          conc === 'mal_concepto'
                            ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                            : 'bg-surface-bg text-secondary opacity-60 hover:opacity-100'
                        }`}
                        title="Mal Concepto"
                      >
                        😞
                      </button>
                      <button
                        onClick={() => cambiarEnResumen(alum.alumnoCursoId, 'ausente')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                          conc === 'ausente'
                            ? 'bg-gray-700 text-white shadow-sm'
                            : 'bg-surface-bg text-secondary opacity-60 hover:opacity-100'
                        }`}
                        title="Ausente"
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botones de acción del resumen */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setPaso('bucle')}
                disabled={guardando}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:opacity-80 active:scale-95 transition-all"
              >
                ← Volver al bucle
              </button>

              <button
                onClick={guardarConceptos}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {guardando ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span> Confirmar Conceptos
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
