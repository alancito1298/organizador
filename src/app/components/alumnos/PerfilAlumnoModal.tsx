'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

type Props = {
  abierto?: boolean;
  perfil: any;
  onCerrar: () => void;
};

const formatearFecha = (fechaStr: string) => {
  try {
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr;
    const dia = d.getUTCDate().toString().padStart(2, '0');
    const mes = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  } catch {
    return fechaStr;
  }
};

const formatearFechaCompleta = (fechaStr: string) => {
  try {
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr;
    const dia = d.getUTCDate().toString().padStart(2, '0');
    const mes = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = d.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
  } catch {
    return fechaStr;
  }
};

const obtenerConfigConcepto = (estado: string) => {
  switch (estado) {
    case 'presente_buen_concepto':
    case 'buen_concepto':
      return {
        emoji: '😊',
        nombre: 'Buen Concepto',
        borde: 'border-emerald-500',
        bg: 'bg-emerald-50 text-emerald-700',
        badgeBg: 'bg-emerald-100 text-emerald-800',
      };
    case 'regular':
    case 'presente_regular':
      return {
        emoji: '😐',
        nombre: 'Regular',
        borde: 'border-amber-500',
        bg: 'bg-amber-50 text-amber-700',
        badgeBg: 'bg-amber-100 text-amber-800',
      };
    case 'presente_mal_concepto':
    case 'mal_concepto':
      return {
        emoji: '😞',
        nombre: 'Mal Concepto',
        borde: 'border-rose-500',
        bg: 'bg-rose-50 text-rose-700',
        badgeBg: 'bg-rose-100 text-rose-800',
      };
    case 'ausente':
      return {
        emoji: '❌',
        nombre: 'Ausente',
        borde: 'border-red-500',
        bg: 'bg-red-50 text-red-700',
        badgeBg: 'bg-red-100 text-red-800',
      };
    case 'justificada':
      return {
        emoji: '🕐',
        nombre: 'Justificada',
        borde: 'border-cyan-500',
        bg: 'bg-cyan-50 text-cyan-700',
        badgeBg: 'bg-cyan-100 text-cyan-800',
      };
    default:
      return {
        emoji: '😊',
        nombre: 'Presente',
        borde: 'border-emerald-500',
        bg: 'bg-emerald-50 text-emerald-700',
        badgeBg: 'bg-emerald-100 text-emerald-800',
      };
  }
};

const formatearTipoEvaluacion = (tipo: string) => {
  switch (tipo) {
    case 'trabajo_practico':
      return 'Trabajo Práctico';
    case 'Examen':
      return 'Examen';
    case 'final':
      return 'Evaluación Final';
    default:
      return tipo || 'Nota';
  }
};

export default function PerfilAlumnoModal({ abierto = true, perfil, onCerrar }: Props) {
  const [vista, setVista] = useState<'general' | 'calificaciones' | 'asistencias'>('general');
  const [filtroTrimestre, setFiltroTrimestre] = useState<string>('todos');
  const [filtroEstadoAsistencia, setFiltroEstadoAsistencia] = useState<string>('todos');

  if (!abierto || !perfil || !perfil.alumno) return null;

  const { alumno, estadisticas, promedios, curso, asistencias, notas } = perfil;

  const stats = estadisticas ?? {
    presentesBuenConcepto: 0,
    presentesMalConcepto: 0,
    ausentes: 0,
    justificadas: 0,
    totalAsistencias: 0,
    totalPresentes: 0,
    porcentajeAsistencia: 0,
  };

  const proms = promedios ?? {
    primerTrimestre: 0,
    segundoTrimestre: 0,
    tercerTrimestre: 0,
    general: 0,
  };

  const datosAsistencia = [
    { name: 'Buen concepto', value: stats.presentesBuenConcepto || 0, color: '#22C55E' },
    { name: 'Mal concepto', value: stats.presentesMalConcepto || 0, color: '#F97316' },
    { name: 'Ausente', value: stats.ausentes || 0, color: '#EF4444' },
    { name: 'Justificada', value: stats.justificadas || 0, color: '#06B6D4' },
  ].filter((d) => d.value > 0);

  const datosPromedios = [
    { trimestre: '1° Trim', promedio: proms.primerTrimestre || 0 },
    { trimestre: '2° Trim', promedio: proms.segundoTrimestre || 0 },
    { trimestre: '3° Trim', promedio: proms.tercerTrimestre || 0 },
  ];

  // Línea de tiempo ordenada de más reciente a más antigua
  const asistenciasOrdenadas = Array.isArray(asistencias) && asistencias.length > 0
    ? [...asistencias].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    : [];

  const notasOrdenadas = Array.isArray(notas) && notas.length > 0
    ? [...notas].sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime())
    : [];

  // Filtrados para listas de observación
  const calificacionesFiltradas = notasOrdenadas.filter((n) => {
    if (filtroTrimestre === 'todos') return true;
    return String(n.trimestre) === filtroTrimestre;
  });

  const asistenciasFiltradas = asistenciasOrdenadas.filter((a) => {
    if (filtroEstadoAsistencia === 'todos') return true;
    return a.estado === filtroEstadoAsistencia;
  });

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setVista('general');
          onCerrar();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-5 md:p-7 w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col gap-5 border border-white/60 shadow-2xl font-mulish">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-start gap-3 pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3 min-w-0">
            {vista !== 'general' ? (
              <button
                onClick={() => setVista('general')}
                className="w-10 h-10 rounded-2xl neumorphic-raised flex items-center justify-center text-accent-violet hover:scale-105 active:scale-95 transition-all shrink-0"
                title="Volver al resumen general"
              >
                <span className="material-symbols-outlined text-lg font-bold">arrow_back</span>
              </button>
            ) : (
              <div className="w-12 h-12 rounded-2xl neumorphic-inset flex items-center justify-center text-accent-violet font-bold text-lg shrink-0">
                {alumno.nombre?.charAt(0)}{alumno.apellido?.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-headline-md text-xl md:text-2xl text-on-surface uppercase truncate leading-tight">
                {alumno.apellido}, {alumno.nombre}
              </h3>
              <p className="text-xs text-secondary mt-0.5 truncate flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-accent-violet"></span>
                <span>{curso?.materia ? `${curso.materia} (${curso.escuela})` : 'Estudiante'}</span>
                {vista !== 'general' && (
                  <span className="px-2 py-0.5 rounded bg-surface-bg neumorphic-inset text-[10px] font-bold text-accent-violet uppercase">
                    Modo Observación
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setVista('general');
              onCerrar();
            }}
            className="w-9 h-9 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-red-500 active:scale-95 transition-all shrink-0"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-lg font-bold">close</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* ── VISTA 1: RESUMEN GENERAL (DASHBOARD DEL ALUMNO) ── */}
        {/* ══════════════════════════════════════════════════════ */}
        {vista === 'general' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-150">
            
            {/* ── BOTONES DE ACCESO A OBSERVACIÓN DETALLADA ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setVista('calificaciones')}
                className="p-3.5 rounded-2xl bg-surface-bg neumorphic-raised hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-left group border border-indigo-100"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 neumorphic-inset flex items-center justify-center text-indigo-700 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-indigo-950 block leading-tight">
                    Ver todas las calificaciones
                  </span>
                  <span className="text-[10px] text-secondary">
                    {notasOrdenadas.length} {notasOrdenadas.length === 1 ? 'evaluación' : 'evaluaciones'} • Prom: {proms.general || '-'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm text-secondary group-hover:text-accent-violet group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </button>

              <button
                onClick={() => setVista('asistencias')}
                className="p-3.5 rounded-2xl bg-surface-bg neumorphic-raised hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-left group border border-emerald-100"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 neumorphic-inset flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-xl">event_available</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-emerald-950 block leading-tight">
                    Ver asistencias y concepto
                  </span>
                  <span className="text-[10px] text-secondary">
                    {asistenciasOrdenadas.length} {asistenciasOrdenadas.length === 1 ? 'clase' : 'clases'} • {stats.porcentajeAsistencia}% asist.
                  </span>
                </div>
                <span className="material-symbols-outlined text-sm text-secondary group-hover:text-accent-violet group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </span>
              </button>
            </div>

            {/* ── RESUMEN ASISTENCIA ── */}
            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <span className="font-label-caps text-secondary text-xs uppercase font-bold block mb-1">
                  Asistencia General
                </span>
                <p className="text-4xl md:text-5xl font-extrabold text-accent-violet">
                  {stats.porcentajeAsistencia}%
                </p>
                <p className="text-xs text-secondary mt-1">
                  {stats.totalPresentes} presentes de {stats.totalAsistencias} clases
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-right text-xs font-semibold text-secondary">
                <span className="inline-flex items-center justify-end gap-1 text-red-500">
                  <span className="material-symbols-outlined text-sm">cancel</span> Ausentes: <b>{stats.ausentes}</b>
                </span>
                <span className="inline-flex items-center justify-end gap-1 text-cyan-600">
                  <span className="material-symbols-outlined text-sm">schedule</span> Justificadas: <b>{stats.justificadas}</b>
                </span>
              </div>
            </div>

            {/* ── LÍNEA DE TIEMPO COMPACTA (MÁS RECIENTES PRIMERO) ── */}
            <div className="bg-surface-bg neumorphic-raised rounded-2xl p-3.5 flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <span className="font-label-caps text-secondary text-xs uppercase font-bold flex items-center gap-1.5">
                  <span>📅</span> Historial Reciente de Clases
                </span>
                <span className="text-[10px] font-bold text-accent-violet">
                  Recientes → Antiguas ({asistenciasOrdenadas.length})
                </span>
              </div>

              {asistenciasOrdenadas.length === 0 ? (
                <div className="bg-surface-bg neumorphic-inset rounded-xl p-3 text-center">
                  <p className="text-xs text-secondary italic">
                    Aún no hay registros de asistencia o concepto para este alumno.
                  </p>
                </div>
              ) : (
                <div className="relative bg-surface-bg neumorphic-inset rounded-xl p-2.5">
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 scrollbar-thin">
                    {asistenciasOrdenadas.map((asist, idx) => {
                      const config = obtenerConfigConcepto(asist.estado);
                      return (
                        <div
                          key={`timeline-${asist.id || idx}`}
                          className="flex flex-col items-center shrink-0 min-w-[50px] group"
                        >
                          {/* Fecha arriba */}
                          <span className="text-[10px] font-extrabold text-secondary mb-1 tracking-tight group-hover:text-accent-violet transition-colors">
                            {formatearFecha(asist.fecha)}
                          </span>

                          {/* Carita / Ícono central más compacto */}
                          <div className="relative flex items-center justify-center">
                            <div
                              className={`w-9 h-9 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-center text-lg border ${config.borde} shadow-sm group-hover:scale-110 transition-transform`}
                              title={`${config.nombre} - ${formatearFecha(asist.fecha)}`}
                            >
                              {config.emoji}
                            </div>
                          </div>

                          {/* Nombre del estado abajo */}
                          <span className="text-[9px] font-bold text-secondary mt-1 text-center leading-tight truncate max-w-[52px]">
                            {config.nombre}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── GRÁFICO DE ASISTENCIA (DONUT) ── */}
            {datosAsistencia.length > 0 && (
              <div className="bg-surface-bg neumorphic-raised rounded-2xl p-4 flex flex-col gap-2">
                <span className="font-label-caps text-secondary text-xs uppercase font-bold px-1">
                  Distribución de Asistencias
                </span>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={datosAsistencia}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {datosAsistencia.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value} clases`, 'Total']}
                        contentStyle={{
                          backgroundColor: '#E0E5EC',
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '4px 4px 10px #A3B1C6, -4px -4px 10px #FFFFFF',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: '600' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── GRÁFICO DE CALIFICACIONES (BARRA) ── */}
            <div className="bg-surface-bg neumorphic-raised rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <span className="font-label-caps text-secondary text-xs uppercase font-bold">
                  Calificaciones por Trimestre
                </span>
                <span className="text-xs font-bold text-accent-violet">
                  Promedio General: <b className="text-base">{proms.general > 0 ? proms.general : '-'}</b>
                </span>
              </div>

              <div className="h-40 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosPromedios} barSize={36}>
                    <XAxis dataKey="trimestre" tick={{ fontSize: 11, fontWeight: 600, fill: '#595F65' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#595F65' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: any) => [`${value > 0 ? value : 'Sin nota'}`, 'Nota']}
                      contentStyle={{
                        backgroundColor: '#E0E5EC',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '4px 4px 10px #A3B1C6, -4px -4px 10px #FFFFFF',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    />
                    <Bar
                      dataKey="promedio"
                      fill="#6D28D9"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════ */}
        {/* ── VISTA 2: LISTA DE CALIFICACIONES (SOLO LECTURA / MODO OBSERVACIÓN) ── */}
        {/* ════════════════════════════════════════════════════════════════════════════ */}
        {vista === 'calificaciones' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            
            {/* Encabezado de la vista de observación */}
            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-secondary text-xs uppercase font-bold">
                  📋 Lista de Calificaciones
                </span>
                <span className="text-xs font-bold text-accent-violet">
                  Promedio General: <b>{proms.general > 0 ? proms.general : '-'}</b>
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Registro pedagógico en modo observación docente (solo lectura).
              </p>

              {/* Filtro por Trimestre */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/30 flex-wrap">
                <span className="text-[11px] font-bold text-secondary mr-1">Filtrar:</span>
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: '1', label: '1° Trim' },
                  { key: '2', label: '2° Trim' },
                  { key: '3', label: '3° Trim' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFiltroTrimestre(f.key)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      filtroTrimestre === f.key
                        ? 'bg-accent-violet text-white shadow-sm'
                        : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de Promedios por Trimestre */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface-bg neumorphic-raised rounded-xl p-2.5 flex flex-col">
                <span className="text-[10px] font-bold text-secondary uppercase">1° Trimestre</span>
                <span className={`text-base font-extrabold ${proms.primerTrimestre >= 6 ? 'text-emerald-600' : proms.primerTrimestre > 0 ? 'text-red-500' : 'text-secondary'}`}>
                  {proms.primerTrimestre > 0 ? proms.primerTrimestre : '-'}
                </span>
              </div>
              <div className="bg-surface-bg neumorphic-raised rounded-xl p-2.5 flex flex-col">
                <span className="text-[10px] font-bold text-secondary uppercase">2° Trimestre</span>
                <span className={`text-base font-extrabold ${proms.segundoTrimestre >= 6 ? 'text-emerald-600' : proms.segundoTrimestre > 0 ? 'text-red-500' : 'text-secondary'}`}>
                  {proms.segundoTrimestre > 0 ? proms.segundoTrimestre : '-'}
                </span>
              </div>
              <div className="bg-surface-bg neumorphic-raised rounded-xl p-2.5 flex flex-col">
                <span className="text-[10px] font-bold text-secondary uppercase">3° Trimestre</span>
                <span className={`text-base font-extrabold ${proms.tercerTrimestre >= 6 ? 'text-emerald-600' : proms.tercerTrimestre > 0 ? 'text-red-500' : 'text-secondary'}`}>
                  {proms.tercerTrimestre > 0 ? proms.tercerTrimestre : '-'}
                </span>
              </div>
            </div>

            {/* Listado de Evaluaciones */}
            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
              {calificacionesFiltradas.length === 0 ? (
                <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-1">note_alt</span>
                  <p className="text-xs text-secondary italic">
                    No se registran notas cargadas para este filtro.
                  </p>
                </div>
              ) : (
                calificacionesFiltradas.map((nota, idx) => {
                  const valorNum = parseFloat(nota.valor);
                  const aprobada = !isNaN(valorNum) && valorNum >= 6;
                  return (
                    <div
                      key={nota.id || idx}
                      className="bg-surface-bg neumorphic-raised rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl neumorphic-inset flex items-center justify-center font-extrabold text-base shrink-0 ${
                          aprobada ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                        }`}>
                          {nota.valor}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-on-surface truncate">
                            {formatearTipoEvaluacion(nota.tipo)}
                          </h4>
                          <p className="text-[10px] text-secondary flex items-center gap-2 mt-0.5">
                            <span className="font-semibold">{nota.trimestre}° Trimestre</span>
                            {nota.fecha && <span>• {formatearFechaCompleta(nota.fecha)}</span>}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${
                        aprobada ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {aprobada ? 'Aprobado' : 'Desaprobado'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════ */}
        {/* ── VISTA 3: LISTA DE ASISTENCIAS Y CONCEPTO (MODO OBSERVACIÓN) ── */}
        {/* ════════════════════════════════════════════════════════════════════════════ */}
        {vista === 'asistencias' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            
            {/* Encabezado de la vista de observación */}
            <div className="bg-surface-bg neumorphic-inset rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-secondary text-xs uppercase font-bold">
                  📅 Lista de Asistencias y Conceptos
                </span>
                <span className="text-xs font-bold text-accent-violet">
                  Total: <b>{asistenciasOrdenadas.length} Clases</b>
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Historial cronológico diario en modo observación docente (solo lectura).
              </p>

              {/* Filtro por Estado */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-outline-variant/30 flex-wrap">
                <span className="text-[11px] font-bold text-secondary mr-1">Filtrar:</span>
                {[
                  { key: 'todos', label: 'Todos' },
                  { key: 'presente_buen_concepto', label: '😊 Buen Concepto' },
                  { key: 'regular', label: '😐 Regular' },
                  { key: 'presente_mal_concepto', label: '😞 Mal Concepto' },
                  { key: 'ausente', label: '❌ Ausente' },
                  { key: 'justificada', label: '🕐 Justificada' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFiltroEstadoAsistencia(f.key)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      filtroEstadoAsistencia === f.key
                        ? 'bg-accent-violet text-white shadow-sm'
                        : 'bg-surface-bg neumorphic-raised text-secondary hover:text-accent-violet'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado Cronológico de Clases */}
            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
              {asistenciasFiltradas.length === 0 ? (
                <div className="bg-surface-bg neumorphic-inset rounded-2xl p-6 text-center">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-1">event_busy</span>
                  <p className="text-xs text-secondary italic">
                    No se registran asistencias para este filtro.
                  </p>
                </div>
              ) : (
                asistenciasFiltradas.map((asist, idx) => {
                  const config = obtenerConfigConcepto(asist.estado);
                  return (
                    <div
                      key={asist.id || idx}
                      className="bg-surface-bg neumorphic-raised rounded-2xl p-3.5 flex items-center justify-between gap-3 border border-white/40"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl bg-surface-bg neumorphic-raised flex items-center justify-center text-xl border ${config.borde} shrink-0`}>
                          {config.emoji}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-on-surface truncate">
                            {config.nombre}
                          </h4>
                          <p className="text-[10px] text-secondary flex items-center gap-2 mt-0.5">
                            <span className="font-semibold">{formatearFechaCompleta(asist.fecha)}</span>
                            {asist.trimestre && <span>• {asist.trimestre}° Trimestre</span>}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shrink-0 ${config.badgeBg}`}>
                        {config.nombre}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── BOTÓN CERRAR / VOLVER ── */}
        <div className="pt-2">
          {vista !== 'general' ? (
            <button
              onClick={() => setVista('general')}
              className="w-full py-3 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            >
              ← Volver al Perfil Principal
            </button>
          ) : (
            <button
              onClick={onCerrar}
              className="w-full py-3 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
            >
              Cerrar Perfil
            </button>
          )}
        </div>

      </div>
    </div>
  );
}