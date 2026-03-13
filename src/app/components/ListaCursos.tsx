'use client';
import { useState } from 'react';
import { Analytics } from "@vercel/analytics/next"
import { Curso } from './Cursos';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type Props = Curso & {
  onEliminar?: (id: number) => void;
};

export default function ListaCursos({ id, anio, escuela, materia, ruta, onEliminar }: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/cursos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Error al eliminar');

      onEliminar?.(id);
    } catch (err) {
      console.error(err);
      alert('❌ No se pudo eliminar el curso');
    } finally {
      setEliminando(false);
      setConfirmando(false);
    }
  };

  return (
    <>
      <div className="flex w-100 h-auto mx-2 bg-violet-800 text-violet-100 border-violet-950 border-2 overflow-hidden hover:bg-violet-300 transition relative group">
      <Analytics />
      
        {/* Tarjeta clickeable */}
        <a href={ruta} className="flex flex-1">
          <div className="flex items-center m-4 justify-center text-8xl font-atma">
            <h5>{anio}°</h5>
          </div>
          <div className="w-1 bg-violet-950 my-0"></div>
          <div className="flex flex-col justify-center px-4 py-2 leading-tight">
        
            <p className="text-sm pl-4 font-bebas uppercase font-bold">{escuela}</p>
            <span className="text-4xl font-light tracking-wider pl-4 uppercase font-poppins">{materia}</span>
          </div>
        </a>

        {/* Botón eliminar */}
         <button
          onClick={(e) => { e.preventDefault(); setConfirmando(true); }}
         className="absolute bottom-0 right-0 w-10 text-xl justify-center p-2 h-10 text-center rounded-3xl bg-white text-red-800"
          title="Eliminar curso"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="auto" height="auto" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
          </svg>
        </button>
      </div>

      {/* Modal de confirmación */}
      {confirmando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-violet-900 mb-1">¿Eliminar curso?</h3>
            <p className="text-sm text-gray-500 mb-1">
              <strong>{anio}° — {materia}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-5">
              {escuela}
            </p>
            <p className="text-xs text-red-500 mb-5">
              Se eliminarán todos los alumnos, asistencias y calificaciones asociadas.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmando(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-medium disabled:opacity-60"
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            
            </div>
          
          </div>
        
        </div>
      )}
      
    </>
  );
}