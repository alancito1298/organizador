'use client';

import { useState, useEffect } from 'react';
import ListaCursos from './ListaCursos';

export type CursoProps = {
  curso: any;
  institucion: string;
  materia: string;
  ruta: string;
};


export default function Curso() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoCurso, setNuevoCurso] = useState({
    escuela: "",
    anio: "",
    materia: "",
  });

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

  const agregarCurso = async () => {
    if (!nuevoCurso.escuela || !nuevoCurso.anio || !nuevoCurso.materia) return;
  
    try {
      const token = localStorage.getItem("token");
  
      const res = await fetch(
        "https://backend-organizador.vercel.app/cursos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...nuevoCurso,
            docenteId: 1, // ⚠️ temporal hasta que lo manejes desde backend
          }),
        }
      );
  
      const data = await res.json();
  
      setCursos((prev) => [...prev, data]);
      setNuevoCurso({ escuela: "", anio: "", materia: "" });
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error al crear curso", error);
    }
  };
  return (
    <div className="p-3  bg-violet-100 min-h-180">
      <h2 className="text-2xl font-bold text-violet-700 text-center py-6 uppercase font-atma">Cursos</h2>

      {/* Lista de cursos */}
      <div className="flex flex-col jusitfy-center px-4 aling-center w-full gap-4">
        {cursos.map((c, i) => (
          <ListaCursos key={i} {...c} />
        ))}

        {/* Botón tipo curso para agregar */}
        <div
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex w-full cursor-pointer bg-violet-100 text-violet-900 rounded-xl overflow-hidden shadow-md hover:bg-none transition"
        >
          <div className="w-full flex flex-row items-center justify-center 
          bg-none text-6xl font-light  gap-2">
          <span>+</span> <small className='text-xs font-light uppercase'>Agergar curso</small>
          </div>
        </div>

        {/* Formulario si se activa */}
        {mostrarFormulario && (
          <div className="w-8/9 bg-gray-100 border  border-violet-200 p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-medium text-violet-700 mb-2">Nuevo Curso</h3>

            <div className="flex flex-col space-y-2">
            <label className='text-violet-900'>Año</label>
            <input
  type="text"
  placeholder="Año (ej. 2°)"
  value={nuevoCurso.anio}
  onChange={(e) =>
    setNuevoCurso({ ...nuevoCurso, anio: e.target.value })
  }
  className="border border-violet-300 rounded p-2 w-full text-violet-900"
/>
              <label className='text-violet-900'>Institución</label>
              <input
  type="text"
  placeholder="Escuela"
  value={nuevoCurso.escuela}
  onChange={(e) =>
    setNuevoCurso({ ...nuevoCurso, escuela: e.target.value })
  }
  className="border border-violet-300 rounded p-2 w-full text-violet-900"
/>
              <label className='text-violet-900'> Materia</label>
              <input
  type="text"
  placeholder="Materia"
  value={nuevoCurso.materia}
  onChange={(e) =>
    setNuevoCurso({ ...nuevoCurso, materia: e.target.value })
  }
  className="border border-violet-300 rounded p-2 w-full text-violet-900"
/>
              
           

              <button
                onClick={agregarCurso}
                className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 mt-2"
              >
                Guardar curso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}