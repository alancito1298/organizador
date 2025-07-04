'use client';

import { useState } from 'react';

type CursoProps = {
  curso: any;
  institucion: string;
  materia: string;
  ruta: string;
};

function Curso({ curso, institucion, materia, ruta }: CursoProps) {
  return (
    <a href={ruta}>
      <div className="flex w-full bg-violet-200 text-violet-950 rounded-xl overflow-hidden shadow-md hover:bg-violet-300 transition">
        <div className="flex items-center justify-center px-6 py-4 text-5xl font-bold">
          {curso}
        </div>
        <div className="w-1 bg-white my-4"></div>
        <div className="flex flex-col justify-center px-4 py-2 leading-tight">
          <p className="text-sm">{institucion}</p>
          <span className="text-xl font-bold italic tracking-wider">{materia}</span>
        </div>
      </div>
    </a>
  );
}

export default function ListaCursos() {
  const [cursos, setCursos] = useState<CursoProps[]>([
    { curso: '3°', institucion: 'Nombre Insti', materia: 'GEOGRAFÍA', ruta: '/sub-menu-curso' },
    { curso: '3°', institucion: 'Nombre Instiiutciontecnica  dsffsdfdf  dfsads', materia: 'GEOGRAFÍA', ruta: '/sub-menu-curso' },
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
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-violet-700">Cursos</h2>

      {/* Lista de cursos */}
      <div className="flex flex-col jusitfy-center aling-center w-full gap-4">
        {cursos.map((c, i) => (
          <Curso key={i} {...c} />
        ))}

        {/* Botón tipo curso para agregar */}
        <div
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="flex w-8/9 cursor-pointer bg-violet-100 text-violet-900 rounded-xl overflow-hidden shadow-md hover:bg-none transition"
        >
          <div className="flex flex-row items-center justify-center 
          bg-none text-6xl font-light w-full gap-2">
          <span>+</span> <small className='text-xs font-light uppercase'>Agergar curso</small>
          </div>
        </div>

        {/* Formulario si se activa */}
        {mostrarFormulario && (
          <div className="w-fit bg-gray-100 border border-violet-200 p-4 rounded-xl shadow-md">
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