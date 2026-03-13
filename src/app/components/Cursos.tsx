'use client';

import { useState, useEffect } from 'react';
import ListaCursos from './ListaCursos';
import FormularioCurso from './FormularioCurso';

export type Curso = {
  id: number;
  escuela: string;
  anio: string;
  materia: string;
  ruta:string;
};

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backend-organizador.vercel.app/cursos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setCursos(data);
    };

    fetchCursos();
  }, []);

  return (
    <div className="p-3 bg-violet-100 min-h-screen">
      <h2 className="text-2xl font-bold text-violet-700 text-center py-6 uppercase font-atma">
        Cursos
      </h2>

      <div className="flex flex-col px-4 w-full gap-4 items-center">
        
        {cursos.map((curso) => (
          <ListaCursos
            id={curso.id}
            anio={curso.anio}
            escuela={curso.escuela}
            materia={curso.materia}
            ruta={`/sub-menu-curso/${curso.id}`}
          />
        ))}

        {/* Botón agregar */}
        <div
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex w-full md:w-2/3 cursor-pointer bg-violet-200 text-violet-900 rounded-xl overflow-hidden shadow-md hover:bg-violet-300 transition"
        >
          <div className="w-full flex flex-row items-center justify-center text-5xl font-light gap-2 py-4">
            <span>+</span>
            <small className='text-xs font-light uppercase'>
              Agregar curso
            </small>
          </div>
        </div>

        {mostrarFormulario && (
          <FormularioCurso
            onCursoCreado={(nuevoCurso) =>
              setCursos((prev) => [...prev, nuevoCurso])
            }
          />
        )}

      </div>
    </div>
  );
}