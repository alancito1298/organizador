'use client';
 
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Cargando from './Cargando';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';
 
const DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'] as const;
type Dia = typeof DIAS[number];
 
type Horario = {
  id: number;
  dia: Dia;
  hora: string;
  descripcion: string | null;
};
 
type Celda = { id: number | null; descripcion: string };
type Fila  = { hora: string; celdas: Record<Dia, Celda> };
 
const celdaVacia = (): Celda => ({ id: null, descripcion: '' });
 
const nuevaFila = (hora = ''): Fila => ({
  hora,
  celdas: Object.fromEntries(DIAS.map((d) => [d, celdaVacia()])) as Record<Dia, Celda>,
});
 
export default function Horario() {
  const [filas, setFilas]         = useState<Fila[]>([nuevaFila()]);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk]               = useState(false);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    fetchHorarios();
  }, []);
 
  const fetchHorarios = async () => {
    setCargando(true);
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/horarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Horario[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;
 
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
    setCargando(false);
  };
 
  const agregarFila = () => setFilas((prev) => [...prev, nuevaFila()]);
 
  const actualizarHora = (filaIndex: number, valor: string) => {
    setFilas((prev) => prev.map((f, i) => i === filaIndex ? { ...f, hora: valor } : f));
  };
 
  const actualizarCelda = (filaIndex: number, dia: Dia, valor: string) => {
    setFilas((prev) => prev.map((f, i) =>
      i === filaIndex
        ? { ...f, celdas: { ...f.celdas, [dia]: { ...f.celdas[dia], descripcion: valor } } }
        : f
    ));
  };
 
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
 
          if (celda.id && !celda.descripcion.trim()) {
            // Existía en BD y quedó vacía → borrar
            promesas.push(
              fetch(`${API}/horarios/${celda.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              })
            );
          } else if (celda.id && celda.descripcion.trim()) {
            // Existía y tiene contenido → borrar y recrear
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
          } else if (!celda.id && celda.descripcion.trim()) {
            // Nueva con contenido → POST
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
  if (cargando) return <Cargando texto="Cargando horarios..." />;
  return (
    <div className="min-h-screen bg-[#f6f4ff] p-4 md:p-8 mb-30">
      <Navbar></Navbar>
      <div className="max-w-7xl mx-auto mt-10">
 
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl md:text-4xl my-20 font-extralight text-center uppercase text-violet-950">
              Horarios
            </h1>
          </div>
 
          <div className="flex gap-3">
            <button
              onClick={agregarFila}
              className="bg-white border border-violet-200 text-violet-900 px-4 py-3 rounded-2xl hover:bg-violet-50 transition text-sm font-medium"
            >
              + Agregar hora
            </button>
 
            <button
              onClick={guardarTodo}
              disabled={guardando}
              className="bg-violet-900 text-white px-5 py-3 rounded-2xl hover:bg-violet-800 transition text-sm font-medium disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
 
        {/* MOBILE */}
        <div className="flex flex-col gap-5 md:hidden">
        {DIAS.map((dia) => {
  const filasConDatos = filas.filter(fila => fila.celdas[dia].descripcion.trim() !== '');
  if (filasConDatos.length === 0) return null; // ← no mostrar si no hay datos

  return (
    <div key={dia} className="bg-white border border-violet-100 shadow-sm p-5 mb-25">
      <h2 className="text-xl font-semibold p-5 bg-violet-950 text-violet-100 mb-4">
        {dia}
      </h2>
      <div className="flex flex-row items-center w-full justify-center gap-3">
        {filasConDatos.map((fila, filaIndex) => ( // ← usar filasConDatos
          <div key={filaIndex} className="border-violet-100 flex gap-4 flex-row items-center bg-amber-50 ">
            <input
              type="text"
              placeholder="08:00"
              value={fila.hora}
              onChange={(e) => actualizarHora(filas.indexOf(fila), e.target.value)}
              className="w-2/6 h-15 m-2 bg-white border border-violet-200 rounded-xl px-3 py-2 text-violet-900 font-semibold"
            />
            <textarea
              placeholder="Materia / Nota"
              value={fila.celdas[dia].descripcion}
              onChange={(e) => actualizarCelda(filas.indexOf(fila), dia, e.target.value)}
              className="w-4/6 h-15 m-2 bg-white border border-violet-200 rounded-xl text-sm text-violet-900 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
})}
        </div>
 
        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <div className="grid grid-cols-6 gap-4 min-w-[1100px]">
 
            {/* Columna Horas */}
            <div className="flex flex-col">
              <div className="h-16 flex items-center justify-center rounded-2xl bg-violet-950 text-white font-semibold">
                Hora
              </div>
 
              {filas.map((fila, filaIndex) => (
                <div key={filaIndex} className="border border-violet-100 bg-violet-800 rounded-2xl mt-2 shadow-sm">
                  <textarea
                    placeholder="08:00"
                    value={fila.hora}
                    onChange={(e) => actualizarHora(filaIndex, e.target.value)}
                    className="w-full bg-transparent outline-none h-16 text-center justify-center p-4 font-semibold text-violet-100"
                  />
                </div>
              ))}
            </div>
 
            {/* Días */}
            {DIAS.map((dia) => (
              <div key={dia} className="flex flex-col">
                <div className="h-16 flex items-center justify-center rounded-2xl bg-violet-900 border border-violet-100 shadow-sm">
                  <h2 className="font-semibold">{dia}</h2>
                </div>
 
                {filas.map((fila, filaIndex) => (
                  <div key={filaIndex} className="bg-white border border-violet-400 mt-2 rounded-2xl shadow-sm hover:border-violet-300 transition">
                    <textarea
                      placeholder="Materia / Nota"
                      value={fila.celdas[dia].descripcion}
                      onChange={(e) => actualizarCelda(filaIndex, dia, e.target.value)}
                      className="w-full h-16 resize-none outline-none p-3 text-lg text-violet-900"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
 
        {/* Toast */}
        {ok && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-violet-900 text-white px-6 py-3 rounded-full shadow-xl z-50">
            Horario guardado correctamente
          </div>
        )}
      </div>
    </div>
  );
}