'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-organizador.vercel.app';

type Curso = {
  id: number;
  materia: string;
  anio: string;
  escuela: string;
};

type Planificacion = {
  id: number;
  tema: string;
  link: string;
  fecha: string | null;
  curso: Curso;
};

export default function ListaPlanificaciones() {
  const [lista, setLista]         = useState<Planificacion[]>([]);
  const [cursos, setCursos]       = useState<Curso[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nueva, setNueva]         = useState({ tema: '', link: '', fecha: '', cursoId: '' });

  useEffect(() => {
    fetchPlanificaciones();
    fetchCursos();
  }, []);

  const fetchPlanificaciones = async () => {
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/planificaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setLista(data);
  };

  const fetchCursos = async () => {
    const token = localStorage.getItem('token');
    const res   = await fetch(`${API}/cursos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setCursos(data);
  };

  const guardar = async () => {
    if (!nueva.tema.trim() || !nueva.link.trim() || !nueva.cursoId) {
      alert('El tema, el link y el curso son obligatorios');
      return;
    }

    setGuardando(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/planificaciones/${nueva.cursoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tema:  nueva.tema.trim(),
          link:  nueva.link.trim(),
          fecha: nueva.fecha || undefined,
        }),
      });

      if (!res.ok) throw new Error();

      setNueva({ tema: '', link: '', fecha: '', cursoId: '' });
      setMostrarFormulario(false);
      await fetchPlanificaciones();
    } catch {
      alert('❌ Error al guardar la planificación');
    } finally {
      setGuardando(false);
    }
  };

  // Agrupar por curso
  const porCurso = lista.reduce<Record<number, { curso: Curso; planes: Planificacion[] }>>(
    (acc, plan) => {
      const id = plan.curso.id;
      if (!acc[id]) acc[id] = { curso: plan.curso, planes: [] };
      acc[id].planes.push(plan);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 min-h-screen bg-amber-50 p-4">

      {/* Header */}
      <div className="flex flex-col items-center gap-3 pt-4">
        <h2 className="text-4xl text-violet-950 font-extralight text-center uppercase">
          Planificaciones
        </h2>
        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="bg-violet-700 text-white px-3 py-2 w-2/3 font-bold rounded-lg text-sm hover:bg-violet-800 transition"
        >
          {mostrarFormulario ? '✕ Cerrar' : '+ Agregar nueva'}
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-violet-100 p-4 rounded-xl space-y-3 shadow-md">

          {/* Selector de curso */}
          <select
            value={nueva.cursoId}
            onChange={(e) => setNueva({ ...nueva, cursoId: e.target.value })}
            className="w-full p-2 rounded border text-violet-900 border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="">Seleccioná un curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.anio}° — {c.materia} ({c.escuela})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tema (ej. Unidad 1 - Semana 2)"
            value={nueva.tema}
            onChange={(e) => setNueva({ ...nueva, tema: e.target.value })}
            className="w-full p-2 rounded border text-violet-900 border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="date"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
            className="w-full p-2 rounded border text-violet-900 border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="url"
            placeholder="Enlace (Drive, PDF...)"
            value={nueva.link}
            onChange={(e) => setNueva({ ...nueva, link: e.target.value })}
            className="w-full p-2 rounded border text-violet-900 border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            onClick={guardar}
            disabled={guardando}
            className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800 disabled:opacity-60 transition w-full font-semibold"
          >
            {guardando ? 'Guardando...' : 'Guardar planificación'}
          </button>
        </div>
      )}

      {/* Lista agrupada por curso */}
      {Object.keys(porCurso).length === 0 ? (
        <p className="text-center text-violet-400">No hay planificaciones cargadas</p>
      ) : (
        Object.values(porCurso).map(({ curso, planes }) => (
          <div key={curso.id} className="space-y-2">

            {/* Cabecera del curso */}
            <div className="bg-violet-700 text-white px-4 py-2 rounded-xl">
              <p className="font-bold text-lg">{curso.anio}° — {curso.materia}</p>
              <p className="text-xs text-violet-200 uppercase">{curso.escuela}</p>
            </div>

            {/* Planificaciones del curso */}
            {planes.map((plan) => (
              <div key={plan.id} className="bg-white shadow p-4 rounded-xl border border-violet-200 ml-2">
                <p className="text-violet-900 font-semibold">{plan.tema}</p>
                {plan.fecha && (
                  <p className="text-xs text-violet-500 mb-1">
                    {new Date(plan.fecha).toLocaleDateString('es-AR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </p>
                )}
                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 underline text-sm mt-1 block"
                >
                  Ver planificación →
                </a>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}