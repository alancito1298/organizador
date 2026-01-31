'use client';
import { CursoProps } from './Cursos';

export default function ListaCursos({ curso, institucion, materia, ruta }: CursoProps) {
  return (
    <a href={ruta}>
      <div className="flex sm:w-full md:w-2/3 bg-violet-200 text-violet-950 rounded-xl overflow-hidden  hover:bg-violet-300 transition">
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
