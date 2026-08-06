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
} from 'recharts';

type Props = {
  perfil: any;
  onCerrar: () => void;
};

export default function PerfilAlumnoModal({ perfil, onCerrar }: Props) {
  if (!perfil) return null;

  const { alumno, estadisticas, promedios } = perfil;

  const datosAsistencia = [
    { name: 'Buen concepto', value: estadisticas.presentesBuenConcepto, fill: '#22c55e' },
    { name: 'Mal concepto',  value: estadisticas.presentesMalConcepto,  fill: '#f97316' },
    { name: 'Ausente',       value: estadisticas.ausentes,               fill: '#ef4444' },
    { name: 'Justificada',   value: estadisticas.justificadas,           fill: '#06b6d4' },
  ].filter(d => d.value > 0);

  const datosPromedios = [
    { trimestre: '1°', promedio: promedios.primerTrimestre,  fill: promedios.primerTrimestre  >= 6 ? '#22c55e' : promedios.primerTrimestre  > 0 ? '#ef4444' : '#e5e7eb' },
    { trimestre: '2°', promedio: promedios.segundoTrimestre, fill: promedios.segundoTrimestre >= 6 ? '#22c55e' : promedios.segundoTrimestre > 0 ? '#ef4444' : '#e5e7eb' },
    { trimestre: '3°', promedio: promedios.tercerTrimestre,  fill: promedios.tercerTrimestre  >= 6 ? '#22c55e' : promedios.tercerTrimestre  > 0 ? '#ef4444' : '#e5e7eb' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-y-auto h-7/9">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 pb-0 my-4 mx-4 ">
          <div>
            <h3 className="text-xl uppercase font-light text-violet-900">
              {alumno.apellido}, {alumno.nombre}
            </h3>
            {alumno.contacto && (
              <p className="text-xs text-gray-400">{alumno.contacto}</p>
            )}
          </div>
          <button
            onClick={onCerrar}
            className="text-red-400 font-bold hover:text-red-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 m-4">

          {/* PORCENTAJE ASISTENCIA */}
          <div className="bg-violet-100 rounded-xl  flex items-center justify-between">
            <div className='m-1'>
              <p className="text-lg font-bold text-violet-700 uppercase">Asistencia</p>
              <p className="text-6xl font-extralight text-violet-900">{estadisticas.porcentajeAsistencia}%</p>
              <p className="text-xs text-violet-400">{estadisticas.totalPresentes} presentes de {estadisticas.totalAsistencias}</p>
            </div>
            <div className="text-right text-xs m-1 text-violet-500 space-y-1">
              <p>❌ Ausentes: <strong>{estadisticas.ausentes}</strong></p>
              <p>🕐 Justificadas: <strong>{estadisticas.justificadas}</strong></p>
            </div>
          </div>

          {/* GRÁFICO ASISTENCIA — Donut */}
          {datosAsistencia.length > 0 && (
            <div className="bg-violet-50 rounded-xl h-auto ">
              <p className="text-xs font-bold text-violet-700 uppercase mb-2">Distribución de asistencias</p>
              <div className='m-2'>
                <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={datosAsistencia}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => [`${value} clases`, '']} />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            </div>

          )}

          {/* GRÁFICO PROMEDIOS — Bar */}
          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-xs font-bold text-violet-700 uppercase mb-1">Promedio por trimestre</p>
            <p className="text-2xl font-bold text-violet-900 mb-3">
              Gral: {promedios.general}
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={datosPromedios} barSize={40}>
                <XAxis dataKey="trimestre" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}`, 'Promedio']} />
                <Bar dataKey="promedio" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <button
            onClick={onCerrar}
            className="w-full py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition font-medium"
          >
            Cerrar
          </button>

        </div>
      </div>
    </div>
  );
}