'use client';
import { CursoProps } from './Cursos';

export default function ListaCursos({ curso, institucion, materia, ruta }: CursoProps) {
  return (
    <a href={ruta}>
      <div className="flex sm:w-full md:w-2/3 mx-2 bg-yellow-200 shadow-2xs text-violet-950 rounded-xl overflow-hidden  hover:bg-violet-300 transition">
        <div className="flex items-center m-5 justify-center px-6 py-4 text-5xl font-bold font-atma">
          {curso}
        </div>
        <div className="w-1 bg-violet-100 my-0"></div>
        <div className="flex flex-col justify-center px-4 py-2 leading-tight">
          <p className="text-sm pl-4 font-bebas uppercase font-bold">{institucion}</p>
          <span className="text-xl font-bold italic tracking-wider pl-4 font-poppins">{materia}</span>
        </div>
      </div>
    </a>
  );
}
