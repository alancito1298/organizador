'use client';

import { useState } from 'react';
import { getToken } from '@/lib/token';
import type { AlumnoConStats } from '@/app/types/alumnos';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type EstadoAsistencia = 'presente_buen_concepto' | 'ausente' | 'justificada';

type Props = {
  abierto: boolean;
  alumnos: AlumnoConStats[];
  cursoInfo: { materia: string; escuela: string; anio: string } | null;
  onCerrar: () => void;
  onFinalizado: () => void;
};

export default function PasoAsistenciaModal({
  abierto,
  alumnos,
  cursoInfo,
  onCerrar,
  onFinalizado,
}: Props) {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoyStr);
  const [paso, setPaso] = useState<'inicio' | 'bucle' | 'resumen'>('bucle');
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, EstadoAsistencia>>({});
  const [guardando, setGuardando] = useState(false);

  if (!abierto || alumnos.length === 0) return null;

  const alumnoActual = alumnos[indiceActual];
  const progresoPorcentaje = Math.round(((indiceActual + 1) / alumnos.length) * 100);

  const registrarEstado = (estado: EstadoAsistencia) => {
    setRespuestas((prev) => ({
      ...prev,
      [alumnoActual.alumnoCursoId]: estado,
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

  const cambiarEstadoEnResumen = (alumnoCursoId: number, nuevoEstado: EstadoAsistencia) => {
    setRespuestas((prev) => ({
      ...prev,
      [alumnoCursoId]: nuevoEstado,
    }));
  };

  const contarEstados = () => {
    let presentes = 0;
    let ausentes = 0;
    let justificadas = 0;

    Object.values(respuestas).forEach((est) => {
      if (est === 'presente_buen_concepto') presentes++;
      else if (est === 'ausente') ausentes++;
      else if (est === 'justificada') justificadas++;
    });

    return { presentes, ausentes, justificadas, total: Object.keys(respuestas).length };
  };

  const guardarAsistencia = async () => {
    setGuardando(true);
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const fechaISO = new Date(fecha + 'T12:00:00').toISOString();

    try {
      const promesas = Object.entries(respuestas).map(async ([alumnoCursoId, estado]) => {
        return fetch(`${API}/asistencias`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            alumnoCursoId: Number(alumnoCursoId),
            fecha: fechaISO,
            estado: estado,
          }),
        });
      });

      await Promise.all(promesas);

      alert(`✅ Asistencia del día ${fecha} guardada con éxito.`);
      onFinalizado();
      onCerrar();
    } catch (e) {
      console.error('Error guardando asistencia:', e);
      alert('❌ Ocurrió un problema al guardar la asistencia.');
    } finally {
      setGuardando(false);
    }
  };

  const { presentes, ausentes, justificadas } = contarEstados();

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
            <h3 className="font-headline-md text-xl md:text-2xl text-accent-violet">
              📋 Pasar Asistencia
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
            <span className="material-symbols-outlined text-sm">calendar_today</span> Fecha:
          </span>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-transparent text-sm font-bold text-accent-violet focus:outline-none cursor-pointer"
          />
        </div>

        {/* ── PASO 1: BUCLE ALUMNO POR ALUMNO ── */}
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
                  Asistencia histórica: <b className="text-accent-violet">{alumnoActual.asistenciaPorcentaje}%</b>
                </p>
              </div>

              {/* Estado previo si ya fue respondido */}
              {respuestas[alumnoActual.alumnoCursoId] && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-accent-violet/10 text-accent-violet">
                  Marcado: {respuestas[alumnoActual.alumnoCursoId] === 'presente_buen_concepto' ? '🟢 Presente' : respuestas[alumnoActual.alumnoCursoId] === 'ausente' ? '🔴 Ausente' : '🟡 Justificada'}
                </span>
              )}
            </div>

            {/* Botones de acción principales */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => registrarEstado('presente_buen_concepto')}
                className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base md:text-lg flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-3xl">check_circle</span>
                PRESENTE
              </button>

              <button
                onClick={() => registrarEstado('ausente')}
                className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base md:text-lg flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-3xl">cancel</span>
                AUSENTE
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={irAnterior}
                disabled={indiceActual === 0}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-secondary font-bold text-xs uppercase tracking-wider hover:text-accent-violet active:scale-95 transition-all disabled:opacity-40"
              >
                ← Anterior
              </button>

              <button
                onClick={() => registrarEstado('justificada')}
                className="px-4 py-2.5 rounded-xl bg-surface-bg neumorphic-raised text-cyan-600 font-bold text-xs uppercase tracking-wider hover:bg-cyan-50 active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">schedule</span> Justificada
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

        {/* ── PASO 2: RESUMEN FINAL ANTES DE GUARDAR ── */}
        {paso === 'resumen' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-150">
            {/* Métricas del día */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-3 flex flex-col items-center">
                <span className="text-2xl font-extrabold text-emerald-600">{presentes}</span>
                <span className="text-[11px] font-bold text-secondary uppercase mt-0.5">Presentes</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-3 flex flex-col items-center">
                <span className="text-2xl font-extrabold text-rose-600">{ausentes}</span>
                <span className="text-[11px] font-bold text-secondary uppercase mt-0.5">Ausentes</span>
              </div>
              <div className="bg-surface-bg neumorphic-inset rounded-2xl p-3 flex flex-col items-center">
                <span className="text-2xl font-extrabold text-cyan-600">{justificadas}</span>
                <span className="text-[11px] font-bold text-secondary uppercase mt-0.5">Justificadas</span>
              </div>
            </div>

            {/* Listado de verificación rápida */}
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              <span className="font-label-caps text-secondary text-xs uppercase font-bold px-1">
                Verificar Alumnos ({alumnos.length}):
              </span>
              {alumnos.map((alum) => {
                const estado = respuestas[alum.alumnoCursoId] || 'ausente';
                return (
                  <div
                    key={alum.id}
                    className="bg-surface-bg neumorphic-inset rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    <span className="font-bold text-xs text-on-surface truncate flex-1">
                      {alum.apellido}, {alum.nombre}
                    </span>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => cambiarEstadoEnResumen(alum.alumnoCursoId, 'presente_buen_concepto')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          estado === 'presente_buen_concepto'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-surface-bg text-secondary hover:text-emerald-600'
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => cambiarEstadoEnResumen(alum.alumnoCursoId, 'ausente')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          estado === 'ausente'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-surface-bg text-secondary hover:text-rose-600'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => cambiarEstadoEnResumen(alum.alumnoCursoId, 'justificada')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          estado === 'justificada'
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'bg-surface-bg text-secondary hover:text-cyan-600'
                        }`}
                      >
                        J
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
                onClick={guardarAsistencia}
                disabled={guardando}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {guardando ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span> Confirmar Asistencia
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
