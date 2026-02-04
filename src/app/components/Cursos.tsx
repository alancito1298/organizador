'use client';

import { useState } from 'react';
import ListaCursos from './ListaCursos';

export type CursoProps = {
  curso: any;
  institucion: string;
  materia: string;
  ruta: string;
};

export default function Curso() {
  const [cursos, setCursos] = useState<CursoProps[]>([
    { curso: '3°', institucion: 'Nombre Institución', materia: 'MATERIA', ruta: '/sub-menu-curso' },
    { curso: '4°', institucion: 'Nombre Institución', materia: 'MATERIA', ruta: '/sub-menu-curso' },
  ]);

  const [nuevoCurso, setNuevoCurso] = useState<CursoProps>({
    curso: '',
    institucion: '',
    materia: '',
    ruta: '',
  });

  const generarRuta = (materia: string) => {
    const slug = materia.toLowerCase().replace(/\s+/g, '-');
    return "/sub-menu-curso"
    //`/sub-menu-${slug}`;
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const agregarCurso = () => {
    if (
      nuevoCurso.curso.trim() &&
      nuevoCurso.institucion.trim() &&
      nuevoCurso.materia.trim()
    ) {
      const rutaGenerada = generarRuta(nuevoCurso.materia);
      const cursoConRuta = { ...nuevoCurso, ruta: rutaGenerada };
  
      setCursos([...cursos, cursoConRuta]);
      setNuevoCurso({ curso: '', institucion: '', materia: '', ruta: '' });
      setMostrarFormulario(false);
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
                placeholder="Curso (ej. 2°)"
                value={nuevoCurso.curso}
                onChange={(e) => setNuevoCurso({ ...nuevoCurso, curso: e.target.value })}
                className="border border-violet-300 rounded p-2 w-full text-violet-900"
              />
              <label className='text-violet-900'>Institución</label>
              <input
                type="text"
                placeholder="Institución"
                value={nuevoCurso.institucion}
                onChange={(e) => setNuevoCurso({ ...nuevoCurso, institucion: e.target.value })}
                className="border border-violet-300 rounded p-2 w-full text-violet-900"
                />
              <label className='text-violet-900'> Materia</label>
              <input
                type="text"
                placeholder="Materia"
                value={nuevoCurso.materia}
                onChange={(e) => setNuevoCurso({ ...nuevoCurso, materia: e.target.value })}
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