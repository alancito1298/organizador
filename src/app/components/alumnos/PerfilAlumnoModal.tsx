'use client';

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

const obtenerConfigConcepto = (estado: string) => {
  switch (estado) {
    case 'presente_buen_concepto':
    case 'buen_concepto':
      return {
        emoji: '😊',
        nombre: 'Buen Concepto',
        borde: 'border-emerald-500',
        bg: 'bg-emerald-50 text-emerald-700',
      };
    case 'regular':
    case 'presente_regular':
      return {
        emoji: '😐',
        nombre: 'Regular',
        borde: 'border-amber-500',
        bg: 'bg-amber-50 text-amber-700',
      };
    case 'presente_mal_concepto':
    case 'mal_concepto':
      return {
        emoji: '😞',
        nombre: 'Mal Concepto',
        borde: 'border-rose-500',
        bg: 'bg-rose-50 text-rose-700',
      };
    case 'ausente':
      return {
        emoji: '❌',
        nombre: 'Ausente',
        borde: 'border-red-500',
        bg: 'bg-red-50 text-red-700',
      };
    case 'justificada':
      return {
        emoji: '🕐',
        nombre: 'Justificada',
        borde: 'border-cyan-500',
        bg: 'bg-cyan-50 text-cyan-700',
      };
    default:
      return {
        emoji: '😊',
        nombre: 'Presente',
        borde: 'border-emerald-500',
        bg: 'bg-emerald-50 text-emerald-700',
      };
  }
};

export default function PerfilAlumnoModal({ abierto = true, perfil, onCerrar }: Props) {
  if (!abierto || !perfil || !perfil.alumno) return null;

  const { alumno, estadisticas, promedios, curso, asistencias } = perfil;

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

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="bg-surface-bg neumorphic-raised rounded-3xl p-5 md:p-7 w-full max-w-md max-h-[92vh] overflow-y-auto flex flex-col gap-5 border border-white/60 shadow-2xl font-mulish">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-start gap-3 pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl neumorphic-inset flex items-center justify-center text-accent-violet font-bold text-lg shrink-0">
              {alumno.nombre?.charAt(0)}{alumno.apellido?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-headline-md text-xl md:text-2xl text-on-surface uppercase truncate leading-tight">
                {alumno.apellido}, {alumno.nombre}
              </h3>
              {alumno.contacto ? (
                <p className="text-xs text-secondary flex items-center gap-1 mt-0.5 truncate">
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  {alumno.contacto}
                </p>
              ) : (
                <p className="text-xs text-secondary mt-0.5 truncate">
                  {curso?.materia ? `${curso.materia} (${curso.escuela})` : 'Estudiante'}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onCerrar}
            className="w-9 h-9 rounded-full neumorphic-raised flex items-center justify-center text-secondary hover:text-red-500 active:scale-95 transition-all shrink-0"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-lg font-bold">close</span>
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
              <span>📅</span> Historial de Clases
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

        {/* ── BOTÓN CERRAR ── */}
        <button
          onClick={onCerrar}
          className="w-full py-3 rounded-xl bg-surface-bg neumorphic-raised text-accent-violet font-bold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all mt-1"
        >
          Cerrar Perfil
        </button>

      </div>
    </div>
  );
}