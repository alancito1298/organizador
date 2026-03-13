'use client';

import { useState } from "react";
import { Curso } from "./Cursos";

type Props = {
  onCursoCreado: (curso: Curso) => void;
};

export default function FormularioCurso({ onCursoCreado }: Props) {
  const [nuevoCurso, setNuevoCurso] = useState({
    escuela: "",
    anio: "",
    materia: "",
  });

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
            docenteId: 1, // ⚠️ temporal
          }),
        }
      );

      const data = await res.json();

      onCursoCreado(data);

      setNuevoCurso({ escuela: "", anio: "", materia: "" });

    } catch (error) {
      console.error("Error al crear curso", error);
    }
  };

  return (
    <div className="w-full md:w-2/3 bg-gray-100 border border-violet-200 p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-violet-700 mb-4">
        Nuevo Curso
      </h3>

      <div className="flex flex-col space-y-3">

        <input
          type="text"
          placeholder="Año (ej. 2°)"
          value={nuevoCurso.anio}
          onChange={(e) =>
            setNuevoCurso({ ...nuevoCurso, anio: e.target.value })
          }
          className="border border-violet-300 rounded p-2 w-full text-violet-900"
        />

        <input
          type="text"
          placeholder="Institución"
          value={nuevoCurso.escuela}
          onChange={(e) =>
            setNuevoCurso({ ...nuevoCurso, escuela: e.target.value })
          }
          className="border border-violet-300 rounded p-2 w-full text-violet-900"
        />

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
  );
}