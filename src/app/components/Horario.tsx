'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;
type Dia = typeof DIAS[number];

type Horario = {
  id: number;
  dia: Dia;
  hora: string;
  descripcion: string | null;
};

// Estructura de la grilla: hora → dia → horario
type Celda = { id: number | null; descripcion: string };
type Fila  = { hora: string; celdas: Record<Dia, Celda> };

const celdaVacia = (): Celda => ({ id: null, descripcion: '' });

const nuevaFila = (hora = ''): Fila => ({
  hora,
  celdas: Object.fromEntries(DIAS.map((d) => [d, celdaVacia()])) as Record<Dia, Celda>,
});

export default function Horario() {
  const [filas, setFilas]       = useState<Fila[]>([nuevaFila()]);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk]             = useState(false);

  // =====================
  // CARGA INICIAL
  // =====================
  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/horarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Horario[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;

    // Agrupar por hora
    const horasSet = new Set(data.map((h) => h.hora));
    const filasMap  = new Map<string, Fila>();

    for (const hora of horasSet) {
      filasMap.set(hora, nuevaFila(hora));
    }

    for (const h of data) {
      const fila = filasMap.get(h.hora);
      if (fila) {
        fila.celdas[h.dia] = { id: h.id, descripcion: h.descripcion ?? '' };
      }
    }
    const filasOrdenadas = [...filasMap.values()].sort((a, b) => {
      const numA = parseFloat(a.hora.replace(':', '.'));
      const numB = parseFloat(b.hora.replace(':', '.'));
      return numA - numB;
    });
    
    setFilas(filasOrdenadas);
  };

  // =====================
  // AGREGAR FILA
  // =====================
  const agregarFila = () => setFilas((prev) => [...prev, nuevaFila()]);

  // =====================
  // ACTUALIZAR HORA
  // =====================
  const actualizarHora = (filaIndex: number, valor: string) => {
    setFilas((prev) => prev.map((f, i) => i === filaIndex ? { ...f, hora: valor } : f));
  };

  // =====================
  // ACTUALIZAR CELDA
  // =====================
  const actualizarCelda = (filaIndex: number, dia: Dia, valor: string) => {
    setFilas((prev) => prev.map((f, i) =>
      i === filaIndex
        ? { ...f, celdas: { ...f.celdas, [dia]: { ...f.celdas[dia], descripcion: valor } } }
        : f
    ));
  };

  // =====================
  // GUARDAR TODO
  // =====================
  const guardarTodo = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert('No hay sesión activa'); return; }

    for (const fila of filas) {
      if (!fila.hora.trim()) {
        alert('Todas las filas deben tener una hora.');
        return;
      }
    }

    setGuardando(true);
    try {
      const promesas: Promise<Response>[] = [];

      for (const fila of filas) {
        for (const dia of DIAS) {
          const celda = fila.celdas[dia];

          if (celda.id) {
            // Ya existe
            if (!celda.descripcion.trim()) {
              // Borrar si quedó vacía
              promesas.push(
                fetch(`${API}/horarios/${celda.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                })
              );
            }
            // Si tiene descripción no hacemos PUT porque el backend no lo tiene —
            // borramos y recreamos
            else {
              promesas.push(
                fetch(`${API}/horarios/${celda.id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                })
              );
              promesas.push(
                fetch(`${API}/horarios`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ dia, hora: fila.hora, descripcion: celda.descripcion }),
                })
              );
            }
          } else if (celda.descripcion.trim()) {
            // Nueva celda con contenido → POST
            promesas.push(
              fetch(`${API}/horarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ dia, hora: fila.hora, descripcion: celda.descripcion }),
              })
            );
          }
        }
      }

      await Promise.all(promesas);
      setOk(true);
      setTimeout(() => { setOk(false); fetchHorarios(); }, 2000);
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <div className="p-4 min-h-screen bg-pink-100">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">Horario semanal</h2>

      <div className="overflow-x-auto border border-violet-400 rounded-lg">
        <table className="border-collapse min-w-[700px] w-full">
          <thead>
            <tr>
              <th className="sticky left-0 bg-violet-200 border border-violet-400 text-violet-900 p-2 w-36">
                Hora
              </th>
              {DIAS.map((dia) => (
                <th key={dia} className="border border-violet-400 bg-yellow-200 uppercase text-violet-900 p-2 h-14  min-w-[120px]">
                  {/*dia === 'Miercoles' ? 'Miércoles' : dia === 'viernes' ? 'Sábado' : dia*/}
                </th>
              ))}
            
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, filaIndex) => (
              <tr key={filaIndex}>
                <td className="sticky left-0 border border-violet-300 bg-violet-900 h-24 p-0 z-10">
                  <textarea
                   
                    placeholder="Ej: 08:00"
                    value={fila.hora}
                    onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                    className="  rounded p-1 w-30 h-auto bg-violet-900 text-amber-100 text-center justify-center p-auto font-bold text-lg"
                  />
                </td>
                {DIAS.map((dia) => (
                  <td key={dia} className="border border-violet-300 p-1 relative">
                  <textarea
                  
                    placeholder="Materia / Nota"
                    value={fila.celdas[dia].descripcion}
                    onChange={(e) => actualizarCelda(filaIndex, dia, e.target.value)}
                    className="border border-violet-200 rounded p-1 w-full text-violet-900 text-sm pr-6"
                  />
                  {fila.celdas[dia].descripcion && (
                    <button
                      onClick={() => actualizarCelda(filaIndex, dia, '')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 text-xs"
                      title="Borrar celda"
                    >
                      ✕
                    </button>
                  )}
                </td>
                ))}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={agregarFila}
          className="bg-violet-200 text-violet-900 px-4 py-2 rounded hover:bg-violet-300 transition font-medium"
        >
          + Agregar fila
        </button>
        <button
          onClick={guardarTodo}
          disabled={guardando}
          className="bg-violet-700 text-white px-6 py-2 rounded hover:bg-violet-800 disabled:opacity-60 transition font-medium"
        >
          {guardando ? 'Guardando...' : '💾 Guardar horario'}
        </button>
      </div>

      {ok && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-3 rounded-full shadow-xl text-lg animate-bounce z-50">
          ✅ Horario guardado
        </div>
      )}
    </div>
  );
}