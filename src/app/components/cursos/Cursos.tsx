'use client';

import { useState, useEffect } from 'react';
import ListaCursos from './ListaCursos';
import FormularioCurso from './FormularioCurso';
import Cargando from '../shared/Cargando';
import Navbar from '../shared/Navbar';
import { getToken } from '@/lib/token';

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
  const [sinSesion, setSinSesion] = useState(false);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    setCargando(true);
    setSinSesion(false);

    try {
      const token = getToken();

      if (!token) {
        setSinSesion(true);
        setCargando(false);
        return;
      }

      const res = await fetch(`${API}/cursos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        setSinSesion(true);
        setCargando(false);
        return;
      }

      const data = await res.json();

      // Sin cursos o respuesta invalida
      if (!Array.isArray(data)) {
        setCursos([]);
        return;
      }

      setCursos(data);
    } catch (err) {
      console.error('Error cargando cursos:', err);
      setCursos([]);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <Cargando texto="Cargando tus cursos..." />;
  }

  if (sinSesion) {
    return (
      <div className="bg-surface-container-low min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-surface rounded-2xl p-8 border border-outline-variant shadow-md">
            <span className="text-5xl mb-4 block">🔑</span>
            <h2 className="text-2xl font-bold text-primary mb-2">Iniciá sesión para ver tus cursos</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Para ingresar a tus aulas escolares o crear un nuevo curso, necesitás haber iniciado sesión con tu cuenta.
            </p>
            <a
              href="/login"
              className="inline-block w-full py-3 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition shadow-md"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low min-h-screen pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary uppercase tracking-wide">
            Panel de Cursos y Aulas Escolares
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Administrá la asistencia, calificaciones y alumnos de tus materias.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          {/* Lista */}
          {cursos.map((curso) => (
            <ListaCursos
              key={curso.id}
              id={curso.id}
              anio={curso.anio}
              escuela={curso.escuela}
              materia={curso.materia}
              ruta={`/curso/${curso.id}`}
              onEliminar={(idEliminado) =>
                setCursos((prev) => prev.filter((c) => c.id !== idEliminado))
              }
            />
          ))}

          {/* Estado vacío */}
          {cursos.length === 0 && (
            <div className="w-full max-w-xl bg-surface rounded-2xl shadow-sm border border-outline-variant p-8 text-center my-4">
              <span className="text-4xl">📚</span>
              <h3 className="text-lg font-bold text-primary mt-2">Todavía no tenés cursos creados</h3>
              <p className="text-on-surface-variant text-xs mt-1">
                Creá tu primer aula escolar para empezar a tomar asistencia y cargar notas.
              </p>
            </div>
          )}

          {/* Botón Agregar */}
          <button
            type="button"
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className="w-full max-w-xl flex items-center justify-center gap-2 py-4 px-6 bg-primary text-white hover:bg-primary/90 font-bold rounded-2xl shadow-md transition-all hover:scale-[1.01] my-4"
          >
            <span className="text-2xl font-bold">+</span>
            <span className="text-sm uppercase tracking-wider">
              {mostrarFormulario ? 'Ocultar Formulario' : 'Agregar Nuevo Curso'}
            </span>
          </button>

          {mostrarFormulario && (
            <FormularioCurso
              onCursoCreado={(nuevoCurso) => {
                setCursos((prev) => [...prev, nuevoCurso]);
                setMostrarFormulario(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}