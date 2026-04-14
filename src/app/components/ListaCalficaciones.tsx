'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ListPlus } from "lucide-react";

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

  const [inscripciones, setInscripciones] = useState<AlumnoCurso[]>([]);
  const [columnas, setColumnas] = useState<Columna[]>([]);
  // datos[fila][col] = valor string
  const [datos, setDatos] = useState<string[][]>([]);
  // calificacionIds[fila][col] = id existente en BD, o null si es nueva
  const [calificacionIds, setCalificacionIds] = useState<(number | null)[][]>([]);
  const [guardando, setGuardando] = useState(false);

  // ===============================
  // CARGA INICIAL
  // ===============================
  useEffect(() => {
    if (!cursoId) return;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const resAlumnos = await fetch(`${API}/inscripciones/curso/${cursoId}`, { headers });
      const alumnosData: AlumnoCurso[] = await resAlumnos.json();
      alumnosData.sort((a, b) => a.alumno.apellido.localeCompare(b.alumno.apellido));

      const resNotas = await fetch(`${API}/calificaciones/curso/${cursoId}`, { headers });
      const notasData: Calificacion[] = await resNotas.json();

      // Columnas únicas desde las calificaciones existentes
      const colsMap = new Map<string, Columna>();
      for (const nota of notasData) {
        const col: Columna = {
          tipo: nota.tipo,
          trimestre: String(nota.trimestre),
          fecha: nota.fecha.split("T")[0],
        };
        const key = colKey(col);
        if (!colsMap.has(key)) colsMap.set(key, col);
      }

      const colsOrdenadas = [...colsMap.values()].sort((a, b) => {
        if (a.trimestre !== b.trimestre) return Number(a.trimestre) - Number(b.trimestre);
        return a.fecha.localeCompare(b.fecha);
      });

      // Columna vacía al final para nuevas notas
      colsOrdenadas.push({ tipo: '', trimestre: '', fecha: '' });

      // Construir matrices de valores e IDs
      const matriz: string[][] = [];
      const idsMatriz: (number | null)[][] = [];

      for (const insc of alumnosData) {
        const filaValores: string[] = [];
        const filaIds: (number | null)[] = [];

        for (const col of colsOrdenadas) {
          if (!col.tipo) {
            filaValores.push("");
            filaIds.push(null);
            continue;
          }
          const nota = notasData.find(
            (n) =>
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
    };

    fetchData();
  }, [cursoId]);

  // ===============================
  // AGREGAR COLUMNA
  // ===============================
  const agregarColumna = () => {
    setColumnas((prev) => [...prev, { tipo: '', trimestre: '', fecha: '' }]);
    setDatos((prev) => prev.map((fila) => [...fila, '']));
    setCalificacionIds((prev) => prev.map((fila) => [...fila, null]));
  };

  // ===============================
  // CAMBIO EN CELDA
  // ===============================
  const handleInputChange = (filaIndex: number, colIndex: number, value: string) => {
    setDatos((prev) =>
      prev.map((fila, i) =>
        i === filaIndex ? fila.map((celda, j) => (j === colIndex ? value : celda)) : fila
      )
    );
  };

  // ===============================
  // CAMBIO EN CABECERA
  // ===============================
  const handleColumnaChange = (colIndex: number, campo: keyof Columna, valor: string) => {
    setColumnas((prev) =>
      prev.map((c, idx) => (idx === colIndex ? { ...c, [campo]: valor } : c))
    );
  };

  // ===============================
  // GUARDAR TODO (POST o PUT según si ya existe)
  // ===============================
  const guardarTodo = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("No hay sesión activa"); return; }

    for (let j = 0; j < columnas.length; j++) {
      const col = columnas[j];
      const tieneAlgunDato = datos.some((fila) => fila[j] !== "");
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
            // ✏️ Ya existe → PUT
            promesas.push(
              fetch(`${API}/calificaciones/${calificacionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body,
              })
            );
          } else {
            // 🆕 Nueva → POST y guardar el nuevo ID para ediciones futuras sin recargar
            const capturedI = i;
            const capturedJ = j;
            promesas.push(
              fetch(`${API}/calificaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body,
              }).then(async (res) => {
                if (res.ok) {
                  const nueva: Calificacion = await res.clone().json();
                  setCalificacionIds((prev) => {
                    const copia = prev.map((f) => [...f]);
                    copia[capturedI][capturedJ] = nueva.id;
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
      alert("✅ Calificaciones guardadas correctamente");
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  // ===============================
  // COLOR DEL INPUT
  // ===============================
  const colorNota = (valor: string) => {
    if (valor === "") return "text-gray-400";
    return Number(valor) >= 6 ? "text-green-600" : "text-red-600";
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="overflow-x-auto p-4 min-h-screen bg-purple-700">
      <table className="border-collapse w-full text-sm mb-30 ">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-purple-700 text-white p-2 w-48">
              Alumno
            </th>

            {columnas.map((col, i) => (
              <th key={i} className="bg-purple-700 text-purple-100 p-2 min-w-40">
                <select
  className={`rounded text-sm w-full mb-1 ${!col.tipo ? 'bg-red-400' : 'bg-violet-800'}`}
  value={col.tipo}
  onChange={(e) => handleColumnaChange(i, "tipo", e.target.value)}
>
                  <option value="">Evaluación</option>
                  <option value="trabajo_practico">Trabajo práctico</option>
                  <option value="Examen">Examen</option>
                  <option value="final">Final</option>
                </select>

                <select
  className={`rounded text-sm w-full mb-1 ${!col.trimestre ? 'bg-red-400' : 'bg-yellow-500 text-violet-900'}`}
  value={col.trimestre}
  onChange={(e) => handleColumnaChange(i, "trimestre", e.target.value)}
>
                  <option value="">Trimestre</option>
                  <option value="1">1°</option>
                  <option value="2">2°</option>
                  <option value="3">3°</option>
                </select>

                <input
  type="date"
  className={`rounded text-sm w-full px-1 ${!col.fecha ? 'bg-red-400' : 'bg-purple-700'}`}
  value={col.fecha}
  onChange={(e) => handleColumnaChange(i, "fecha", e.target.value)}
/>
              </th>
            ))}

            <th className="p-2 ">
             
             
            </th>
          </tr>
        </thead>

        <tbody>
          {inscripciones.map((inscripcion, filaIndex) => (
            <tr key={inscripcion.id} className="hover:bg-purple-50">
              <td className="sticky left-0 z-10 bg-purple-700 text-white px-2 py-1 font-medium">
                {inscripcion.alumno.apellido}, {inscripcion.alumno.nombre}
              </td>

              {datos[filaIndex]?.map((valor, colIndex) => {
                const esExistente = !!calificacionIds[filaIndex]?.[colIndex];
                return (
                  <td key={colIndex} className="bg-purple-700 p-1 relative">
                    {/* Indicador visual: lápiz si la nota ya existe en BD */}
                    {esExistente && (
                      <span
                        className="absolute top-1 right-1 text-xs text-purple-400"
                        title="Editando nota existente"
                      >
                        ✏️
                      </span>
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

              <td />
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={guardarTodo}
        disabled={guardando}
       className="fixed bottom-20 right-0
     border-amber-950 border-2 border-r-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-400
                   text-white px-6 py-3 rounded-l-full shadow-8xl shadow-amber-900 text-lg font-semibold transition-all"
      >
        {guardando ? 'Guardando...' : '💾'}
      </button>
      <button
                onClick={agregarColumna}
                className="fixed bottom-35  right-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                text-white px-6 py-3 rounded-l-full border-amber-950 border-r-0 border-2 shadow-2xl text-lg font-semibold transition-all"
                title="Agregar fecha"
                >
                <ListPlus />
              </button>
    </div>
  );
}