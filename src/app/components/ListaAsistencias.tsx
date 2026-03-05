'use client';

import { useEffect, useState, JSX } from 'react';
import { useParams } from 'next/navigation';
import { ThumbsUp, ThumbsDown, X, Clock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

// =====================
// TIPOS
// =====================
type EstadoVisual = 'vacio' | 'presente_buen_concepto' | 'presente_mal_concepto' | 'ausente' | 'justificada';

type AlumnoCurso = {
  id: number;
  alumno: { id: number; nombre: string; apellido: string };
};

type Asistencia = {
  id: number;
  fecha: string;
  estado: string;
  alumnoCursoId: number;
};

// =====================
// CONFIGURACIÓN DE ESTADOS
// =====================
// 'justificada' se guarda en backend como 'ausente' pero se distingue visualmente
// por eso usamos un campo extra en la matriz de IDs

const ciclo: EstadoVisual[] = [
  'vacio',
  'presente_buen_concepto',
  'presente_mal_concepto',
  'ausente',
  'justificada',
];

const colores: Record<EstadoVisual, string> = {
  vacio:                   'bg-amber-300',
  presente_buen_concepto:  'bg-green-500',
  presente_mal_concepto:   'bg-orange-400',
  ausente:                 'bg-red-500',
  justificada:             'bg-cyan-400',
};

const iconos: Record<EstadoVisual, JSX.Element | null> = {
  vacio:                   null,
  presente_buen_concepto:  <ThumbsUp  size={20} className="text-white mx-auto" />,
  presente_mal_concepto:   <ThumbsDown size={20} className="text-white mx-auto" />,
  ausente:                 <X         size={20} className="text-white mx-auto" />,
  justificada:             <Clock     size={20} className="text-white mx-auto" />,
};

const estadoBackendAVisual = (estado: string): EstadoVisual => {
  if (estado === 'presente_buen_concepto') return 'presente_buen_concepto';
  if (estado === 'presente_mal_concepto')  return 'presente_mal_concepto';
  if (estado === 'ausente')                return 'ausente';
  if (estado === 'justificada')            return 'justificada';
  return 'vacio';
};

const estadoVisualABackend = (estado: EstadoVisual): string | null => {
  if (estado === 'vacio') return null;
  if (estado === 'justificada') return 'ausente'; // backend no tiene justificada, se guarda como ausente
  return estado;
};

const getSiguienteEstado = (estado: EstadoVisual): EstadoVisual => {
  const idx = ciclo.indexOf(estado);
  return ciclo[(idx + 1) % ciclo.length];
};

// =====================
// COMPONENTE
// =====================
export default function AsistenciasTabla() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const cursoId = Number(rawId);
  const [guardadoOk, setGuardadoOk] = useState(false);

  const [inscripciones, setInscripciones]   = useState<AlumnoCurso[]>([]);
  const [fechas, setFechas]                 = useState<string[]>([]);         // YYYY-MM-DD[]
  const [datos, setDatos]                   = useState<EstadoVisual[][]>([]);  // [alumno][fecha]
  const [asistenciaIds, setAsistenciaIds]   = useState<(number | null)[][]>([]); // id en BD o null
  const [guardando, setGuardando]           = useState(false);

  // =====================
  // CARGA INICIAL
  // =====================
  useEffect(() => {
    if (!cursoId) return;

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Alumnos
      const resAlumnos = await fetch(`${API}/inscripciones/curso/${rawId}`, { headers });
      const alumnosData: AlumnoCurso[] = await resAlumnos.json();
      alumnosData.sort((a, b) => a.alumno.apellido.localeCompare(b.alumno.apellido));

      // 2. Asistencias existentes
      const resAsistencias = await fetch(`${API}/asistencias/curso/${rawId}`, { headers });

      const asistenciasData: Asistencia[] = await resAsistencias.json();

      // 3. Fechas únicas ordenadas
      const fechasSet = new Set<string>();
      for (const a of asistenciasData) {
        fechasSet.add(a.fecha.split('T')[0]);
      }
      const fechasOrdenadas = [...fechasSet].sort();

      // 4. Construir matrices
      const matriz:    EstadoVisual[][]    = [];
      const idsMatriz: (number | null)[][] = [];

      for (const insc of alumnosData) {
        const filaEstados: EstadoVisual[]    = [];
        const filaIds:     (number | null)[] = [];

        for (const fecha of fechasOrdenadas) {
          const asist = asistenciasData.find(
            (a) => a.alumnoCursoId === insc.id && a.fecha.split('T')[0] === fecha
          );
          filaEstados.push(asist ? estadoBackendAVisual(asist.estado) : 'vacio');
          filaIds.push(asist ? asist.id : null);
        }

        matriz.push(filaEstados);
        idsMatriz.push(filaIds);
      }

      setInscripciones(alumnosData);
      setFechas(fechasOrdenadas);
      setDatos(matriz);
      setAsistenciaIds(idsMatriz);
    };

    fetchData();
  }, [cursoId]);

  // =====================
  // AGREGAR FECHA
  // =====================
  const agregarFecha = () => {
    const hoy = new Date().toISOString().split('T')[0];
    // Evitar duplicados
    if (fechas.includes(hoy)) {
      alert('Ya existe una columna para hoy. Editá la fecha manualmente.');
    }
    setFechas((prev) => [...prev, hoy]);
    setDatos((prev) => prev.map((fila) => [...fila, 'vacio']));
    setAsistenciaIds((prev) => prev.map((fila) => [...fila, null]));
  };

  const editarFecha = (colIndex: number, valor: string) => {
    setFechas((prev) => prev.map((f, i) => (i === colIndex ? valor : f)));
  };

  // =====================
  // CAMBIO DE ESTADO (click en celda)
  // =====================
  const cambiarEstado = (filaIndex: number, colIndex: number) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        fila.map((estado, j) =>
          i === filaIndex && j === colIndex ? getSiguienteEstado(estado) : estado
        )
      )
    );
  };

  // =====================
  // GUARDAR TODO
  // =====================
  const guardarTodo = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('No hay sesión activa'); return; }

    for (let j = 0; j < fechas.length; j++) {
      if (!fechas[j]) {
        alert(`La columna ${j + 1} no tiene fecha.`);
        return;
      }
    }

    setGuardando(true);
    try {
      const promesas: Promise<Response>[] = [];

      for (let i = 0; i < datos.length; i++) {
        for (let j = 0; j < fechas.length; j++) {
          const estadoVisual  = datos[i][j];
          const estadoBackend = estadoVisualABackend(estadoVisual);
          const asistenciaId  = asistenciaIds[i]?.[j];
          const alumnoCursoId = inscripciones[i].id;
          const fecha         = fechas[j];

          if (asistenciaId) {
            // Ya existe en BD
            if (estadoVisual === 'vacio') {
              // Si lo dejaron en vacío, borrar la asistencia
              promesas.push(
                fetch(`${API}/asistencias/${asistenciaId}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                })
              );
            } else {
              // PUT con el nuevo estado
              promesas.push(
                fetch(`${API}/asistencias/${asistenciaId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ estado: estadoBackend }),
                })
              );
            }
          } else if (estadoBackend) {
            // No existe → POST
            const ci = i, cj = j;
            promesas.push(
              fetch(`${API}/asistencias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ fecha, estado: estadoBackend, alumnoCursoId }),
              }).then(async (res) => {
                if (res.ok) {
                  const nueva: Asistencia = await res.clone().json();
                  setAsistenciaIds((prev) => {
                    const copia = prev.map((f) => [...f]);
                    copia[ci][cj] = nueva.id;
                    return copia;
                  });
                }
                return res;
              })
            );
          }
        }
      }

      await Promise.all(promesas);
      setGuardadoOk(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000); 
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // =====================
  // LEYENDA
  // =====================
  const leyenda: { estado: EstadoVisual; label: string }[] = [
    { estado: 'presente_buen_concepto', label: 'Presente (buen concepto)' },
    { estado: 'presente_mal_concepto',  label: 'Presente (mal concepto)'  },
    { estado: 'ausente',                label: 'Ausente'                  },
    { estado: 'justificada',            label: 'Falta justificada'        },
    { estado: 'vacio',                  label: 'Sin registrar'            },
  ];

  // =====================
  // RENDER
  // =====================
  return (
    <div className="p-2 pb-32">

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {leyenda.map(({ estado, label }) => (
          <div key={estado} className="flex items-center gap-1 text-xs text-violet-800">
            <span className={`w-5 h-5 rounded flex items-center justify-center ${colores[estado]}`}>
              {iconos[estado]}
            </span>
            {label}
          </div>
        ))}
      </div>

      <p className="text-center text-violet-600 font-bold uppercase mb-2">
        Tocá los casilleros para cambiar el estado
      </p>
      <p className="text-center text-violet-600 font-bold uppercase mb-2">
      <p className="text-center text-violet-600 font-bold uppercase mb-2">
      no te olvides de 💾 antes de salir
      </p>
      </p>

      <div className="overflow-x-auto relative">
        <table className="table-fixed border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-violet-200 z-10 text-violet-900 p-2 w-40 text-left">
                Alumno
              </th>

              {fechas.map((fecha, j) => (
  <th key={j} className="border-2 border-violet-200 p-1 text-violet-900 text-center min-w-[70px]">
    <div className="flex flex-col items-center gap-1">
      <span className="text-amber-300 bg-violet-900 rounded px-2 py-1 text-xs font-bold">
        {fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : '--/--'}
      </span>
      <button
        onClick={() => {
          const nueva = prompt('Nueva fecha (YYYY-MM-DD):', fecha);
          if (nueva) editarFecha(j, nueva);
        }}
        className="text-violet-400 text-xs hover:text-violet-700 transition"
        title="Editar fecha"
      >
        ✏️
      </button>
    </div>
  </th>
))}

              <th className="p-1">
                <button
                  onClick={agregarFecha}
                  className="bg-yellow-400 text-purple-900 font-bold w-10 h-10 rounded text-lg hover:bg-yellow-300 transition"
                  title="Agregar fecha"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {inscripciones.map((insc, i) => (
              <tr key={insc.id}>
                <td className="sticky left-0 bg-violet-200 text-violet-900 z-10 px-2 py-1 font-bold w-40 border-b-2 border-violet-300">
                  {insc.alumno.apellido}, {insc.alumno.nombre}
                </td>

                {datos[i]?.map((estado, j) => (
                  <td
                    key={j}
                    onClick={() => cambiarEstado(i, j)}
                    className={`w-16 h-16 border-2 border-violet-300 cursor-pointer transition-colors duration-150 text-center rounded-xl m-1 ${colores[estado]}`}
                  >
                    {iconos[estado]}
                  </td>
                ))}

                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={guardarTodo}
        disabled={guardando}
        className="fixed bottom-20 right-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400
                   text-white px-6 py-3 rounded-full shadow-2xl text-lg font-semibold transition-all"
      >
        {guardando ? 'Guardando...' : '💾'}
      </button>
      {guardadoOk && (
  <div className="fixed top-30 left-1/2 -translate-x-1/2 z-50 p-6 bg-violet-500 text-center text-white px-6 py-3 rounded-full shadow-2xl text-lg font-semibold animate-bounce">
    ✅ Asistencias guardadas
  </div>
)}
    </div>
  );
}