'use client';

import { useState } from "react";
import { Curso } from "./Cursos";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://backend-organizador.vercel.app";

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
        `${API}/cursos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...nuevoCurso,

          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "No se pudo crear el curso");
      }

      onCursoCreado(data);

      setNuevoCurso({ escuela: "", anio: "", materia: "" });

    } catch (error: any) {
      console.error("Error al crear curso", error);
      alert(`❌ ${error.message || "No se pudo crear el curso"}`);
    }
  };

  return (
    <div className="w-full md:w-2/3 bg-gray-100 border border-violet-200 p-4 mb-25 rounded-xl shadow-md">
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