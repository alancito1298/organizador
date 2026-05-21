'use client';

import { useState, useEffect } from 'react';
import ListaCursos from './ListaCursos';
import FormularioCurso from './FormularioCurso';
import Cargando from './Cargando';
import Navbar from './Navbar';
export type Curso = {
  id: number;
  escuela: string;
  anio: string;
  materia: string;
  ruta: string;
};

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://backend-organizador.vercel.app';

export default function Cursos() {

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {

    setCargando(true);

    try {

      const token = localStorage.getItem('token');

      const res = await fetch(
        `${API}/cursos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Sin cursos
      if (!Array.isArray(data)) {
        setCursos([]);
        return;
      }

      setCursos(data);

    } catch (err) {

      console.error(
        'Error cargando cursos:',
        err
      );

      // Evita dejar la UI vacía
      setCursos([]);

    } finally {

      setCargando(false);

    }
  };

  if (cargando) {
    return (
      <Cargando
        texto="Cargando cursos..."
      />
    );
  }

  return (
    <div className="p-3 bg-violet-100 min-h-screen">
<Navbar></Navbar>
      <h2 className="text-3xl font-light bg-violet-950 mb-10 text-violet-100 text-center py-6 uppercase">
        Tus cursos
      </h2>

      <div className="flex flex-col px-4 w-full gap-4 items-center">

        {/* Lista */}
        {cursos.map((curso) => (
          <ListaCursos
            key={curso.id}
            id={curso.id}
            anio={curso.anio}
            escuela={curso.escuela}
            materia={curso.materia}
            ruta={`/sub-menu-curso/${curso.id}`}
          />
        ))}

        {/* Estado vacío */}
        {cursos.length === 0 && (
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-sm border border-violet-200 p-8 text-center">
            <p className="text-violet-400 text-sm uppercase tracking-wide">
              Todavía no hay cursos cargados
            </p>
          </div>
        )}

        {/* Agregar */}
        <div
          onClick={() =>
            setMostrarFormulario(
              (prev) => !prev
            )
          }
          className="
          flex
          mt-10
          md:w-2/3
          w-8/9
          cursor-pointer
        border
          border-violet-950
          text-violet-900
          rounded-xl
          overflow-hidden
          shadow-md
          hover:bg-violet-300
          transition
          mb-20
          "
        >
          <div className="
          w-full
          flex
          flex-row
          items-center
          justify-center
          text-5xl
          font-light
          gap-2
          py-4
          ">
            <span>+</span>

            <small className="
            text-xs
            font-light
            uppercase
            
            ">
              Agregar curso
            </small>

          </div>
        </div>

        {mostrarFormulario && (
          <FormularioCurso
            onCursoCreado={(nuevoCurso) =>
              setCursos(
                (prev) => [
                  ...prev,
                  nuevoCurso,
                ]
              )
            }
          />
        )}

      </div>

    </div>
  );
}