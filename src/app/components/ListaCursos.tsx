'use client';
import { Curso } from './Cursos';

export default function ListaCursos({ anio, escuela, materia, ruta }: Curso) {
  return (
    <a href={ruta}>
      <div className="flex w-100 h-auto mx-2 bg-violet-800  text-violet-100  border-violet-950 border-2 overflow-hidden  hover:bg-violet-300 transition">
        <div className="flex items-center m-4 justify-center text-8xl font-atma">
          <h5>{anio}°</h5>
        </div>
        <div className="w-1 bg-violet-950 my-0"></div>
        <div className="flex flex-col justify-center px-4 py-2 leading-tight">
          <p className="text-sm pl-4 font-bebas uppercase font-bold">{escuela}</p>
          <span className="text-4xl font-light  tracking-wider pl-4 upercase font-poppins">{materia}</span>
        </div>
      </div>
    </a>
  );
}
