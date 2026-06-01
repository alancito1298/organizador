'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ListPlus, Download } from "lucide-react";
import Cargando from "./Cargando";
import { exportarExcelCalificaciones } from '../utils/exportarExcelCalificaciones';

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

type AlumnoCurso = {
  id: number;
  alumno: { id: number; nombre: string; apellido: string };
};

type Columna = {
  tipo: string;
  trimestre: string;
  fecha: string;
};

type Calificacion = {
  id: number;
  valor: number;
  alumnoCursoId: number;
  tipo: string;
  trimestre: number;
  fecha: string;
};

const colKey = (c: Columna) => `${c.tipo}||${c.trimestre}||${c.fecha}`;

export default function ListaCalificaciones() {
  const params = useParams();
  const cursoId = Number(params.id);
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [curso, setCurso] = useState<any>(null);
  const [inscripciones, setInscripciones] = useState<AlumnoCurso[]>([]);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [datos, setDatos] = useState<string[][]>([]);
  const [calificacionIds, setCalificacionIds] = useState<(number | null)[][]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!cursoId) return;
    fetchData();
  }, [cursoId]);

  const fetchData = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const resCurso = await fetch(`${API}/cursos/${rawId}`, { headers });
      setCurso(await resCurso.json());

      const resAlumnos = await fetch(`${API}/inscripciones/curso/${rawId}`, { headers });
      const alumnosData: AlumnoCurso[] = await resAlumnos.json();
      alumnosData.sort((a, b) => a.alumno.apellido.localeCompare(b.alumno.apellido));

      const resNotas = await fetch(`${API}/calificaciones/curso/${rawId}`, { headers });
      const notasData: Calificacion[] = await resNotas.json();

      const colsMap = new Map<string, Columna>();
      for (const nota of notasData) {
        const col: Columna = {
          tipo: nota.tipo,
          trimestre: String(nota.trimestre),
          fecha: nota.fecha.split("T")[0],
        };
        if (!colsMap.has(colKey(col))) colsMap.set(colKey(col), col);
      }

      const colsOrdenadas = [...colsMap.values()].sort((a, b) => {
        if (a.trimestre !== b.trimestre) return Number(a.trimestre) - Number(b.trimestre);
        return a.fecha.localeCompare(b.fecha);
      });
      colsOrdenadas.push({ tipo: '', trimestre: '', fecha: '' });

      const matriz: string[][] = [];
      const idsMatriz: (number | null)[][] = [];

      for (const insc of alumnosData) {
        const filaValores: string[] = [];
        const filaIds: (number | null)[] = [];
        for (const col of colsOrdenadas) {
          if (!col.tipo) { filaValores.push(""); filaIds.push(null); continue; }
          const nota = notasData.find(n =>
            n.alumnoCursoId === insc.id &&
            n.tipo === col.tipo &&
            String(n.trimestre) === col.trimestre &&
            n.fecha.split("T")[0] === col.fecha
          );
          filaValores.push(nota ? String(nota.valor) : "");
          filaIds.push(nota ? nota.id : null);
        }
        matriz.push(filaValores);
        idsMatriz.push(filaIds);
      }

      setInscripciones(alumnosData);
      setColumnas(colsOrdenadas);
      setDatos(matriz);
      setCalificacionIds(idsMatriz);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const agregarColumna = () => {
    setColumnas(prev => [...prev, { tipo: '', trimestre: '', fecha: '' }]);
    setDatos(prev => prev.map(fila => [...fila, '']));
    setCalificacionIds(prev => prev.map(fila => [...fila, null]));
  };

  const handleInputChange = (filaIndex: number, colIndex: number, value: string) => {
    setDatos(prev => prev.map((fila, i) =>
      i === filaIndex ? fila.map((celda, j) => j === colIndex ? value : celda) : fila
    ));
  };

  const handleColumnaChange = (colIndex: number, campo: keyof Columna, valor: string) => {
    setColumnas(prev => prev.map((c, idx) => idx === colIndex ? { ...c, [campo]: valor } : c));
  };

  const guardarTodo = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("No hay sesión activa"); return; }

    for (let j = 0; j < columnas.length; j++) {
      const col = columnas[j];
      const tieneAlgunDato = datos.some(fila => fila[j] !== "");
      if (tieneAlgunDato && (!col.tipo || !col.trimestre || !col.fecha)) {
        alert(`La columna ${j + 1} tiene notas pero le falta tipo, trimestre o fecha.`);
        return;
      }
    }

    setGuardando(true);
    try {
      const promesas: Promise<Response>[] = [];
      for (let i = 0; i < datos.length; i++) {
        for (let j = 0; j < columnas.length; j++) {
          const valor = datos[i][j];
          const col = columnas[j];
          if (!valor || !col.tipo || !col.trimestre || !col.fecha) continue;
          const calificacionId = calificacionIds[i]?.[j];
          const alumnoCursoId = inscripciones[i].id;
          const body = JSON.stringify({
            valor: parseFloat(valor),
            fecha: col.fecha,
            trimestre: Number(col.trimestre),
            tipo: col.tipo,
            alumnoCursoId,
          });
          if (calificacionId) {
            promesas.push(fetch(`${API}/calificaciones/${calificacionId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body,
            }));
          } else {
            const ci = i, cj = j;
            promesas.push(fetch(`${API}/calificaciones`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body,
            }).then(async res => {
              if (res.ok) {
                const nueva: Calificacion = await res.clone().json();
                setCalificacionIds(prev => {
                  const copia = prev.map(f => [...f]);
                  copia[ci][cj] = nueva.id;
                  return copia;
                });
              }
              return res;
            }));
          }
        }
      }
      await Promise.all(promesas);
      alert("✅ Calificaciones guardadas correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const colorNota = (valor: string) => {
    if (valor === "") return "text-gray-400";
    return Number(valor) >= 6 ? "text-green-600" : "text-red-600";
  };

  if (cargando) return <Cargando texto="Cargando calificaciones..." />;

  return (
    <div className="p-1
    bg-violet-100
    min-h-screen
    m-0
  ">

      {/* TABLA — mismo patrón que AsistenciasTabla */}
      <div className="w-screen max-w-screen overflow-x-scroll overflow-y-hidden ">
        <table className="border-collapse" style={{ width: 'max-content' }}>
          <thead>
            <tr>

              {/* COLUMNA FIJA ALUMNO */}
              <th className="sticky left-0 text-violet-950 bg-violet-400 border border--400 z-10  p-2 w-[140px] min-w-[140px] text-left font-mono font-medium">
                Alumno/a
              </th>

              {/* CABECERAS COLUMNAS */}
              {columnas.map((col, i) => (
                <th
                  key={i}
                  className="border border-violet-400 bg-violet-300 text-purple-100 p-1 text-center min-w-[160px]"
                >
                  <div className="flex flex-col items-center gap-1">

                    <select
                      className={`rounded text-xs w-full ${!col.tipo ? 'bg-violet-400' : 'bg-violet-800'} text-white border-none p-1`}
                      value={col.tipo}
                      onChange={(e) => handleColumnaChange(i, "tipo", e.target.value)}
                    >
                      <option value="">nota de...</option>
                      <option value="trabajo_practico">TP</option>
                      <option value="Examen">Examen</option>
                      <option value="final">Final</option>
                    </select>

                    <select
                      className={`rounded text-xs h-10 w-full ${!col.trimestre ? 'bg-violet-300' : 'bg-yellow-500 text-violet-900'} border-none p-1`}
                      value={col.trimestre}
                      onChange={(e) => handleColumnaChange(i, "trimestre", e.target.value)}
                    >
                      <option value="">Elegi un Trimestre</option>
                      <option value="1">1° Trimestre</option>
                      <option value="2">2° Trimestre</option>
                      <option value="3">3° Trimestre</option>
                    </select>

                    <input
                      type="date"
                      className={`rounded text-xs w-full ${!col.fecha ? 'bg-violet-400' : 'bg-purple-700'} text-white border-none p-1`}
                      value={col.fecha}
                      onChange={(e) => handleColumnaChange(i, "fecha", e.target.value)}
                    />

                  </div>
                </th>
              ))}

            </tr>
          </thead>

          <tbody>
            {inscripciones.length === 0 && (
              <tr>
                <td colSpan={columnas.length + 1} className="text-center text-white py-10">
                  No hay alumnos cargados
                </td>
              </tr>
            )}

            {inscripciones.map((insc, filaIndex) => (
              <tr key={insc.id}>

                {/* NOMBRE FIJO */}
                <td className="pl-1 sticky left-0 bg-violet-300 text-violet-950 z-10 p-1 font-mono border border-purple-400 w-[140px] min-w-[140px] text-sm">
                  {insc.alumno.apellido}, {insc.alumno.nombre}
                </td>

                {/* CELDAS NOTAS */}
                {datos[filaIndex]?.map((valor, colIndex) => {
                  const esExistente = !!calificacionIds[filaIndex]?.[colIndex];
                  return (
                    <td
                      key={colIndex}
                      className="bg-purple-200 p-1 relative border border-purple-400 min-w-[160px] h-14"
                    >
                      {esExistente && (
                        <span className="absolute top-1 right-1 text-xs text-purple-300">✏️</span>
                      )}
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        value={valor}
                        onChange={(e) => handleInputChange(filaIndex, colIndex, e.target.value)}
                        className={`w-full text-center font-bold bg-white rounded h-10 focus:outline-none focus:ring-2 focus:ring-purple-500 border
                          ${esExistente ? "border-purple-400" : "border-purple-200"}
                          ${colorNota(valor)}
                        `}
                      />
                    </td>
                  );
                })}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOTÓN EXCEL */}
      <button
        onClick={() => exportarExcelCalificaciones({ columnas, datos, inscripciones, curso })}
        className="w-full max-w-90 m-auto mt-14 mb-40 hover:bg-emerald-700 text-green-800 px-6 py-3 bg-white border-2 border-green-500 rounded-xl shadow-2xl text-sm transition-all flex items-center justify-center gap-1 font-bold"
      >
        Planilla Excel <Download />
      </button>

      {/* BOTÓN AGREGAR COLUMNA */}
      <button
        onClick={agregarColumna}
        className="fixed bottom-35 right-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-l-full border-amber-950 border-r-0 border-2 shadow-2xl text-lg font-semibold transition-all"
      >
        <ListPlus />
      </button>

      {/* BOTÓN GUARDAR */}
      <button
        onClick={guardarTodo}
        disabled={guardando}
        className="fixed bottom-20 right-0 border-amber-950 border-2 border-r-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-l-full shadow-2xl text-lg font-semibold transition-all"
      >
        {guardando ? 'Guardando...' : '💾'}
      </button>

    </div>
  );
}