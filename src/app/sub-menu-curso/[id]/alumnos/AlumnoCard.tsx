'use client';

import { Alumno } from "./page";

type Props = {
  alumno: Alumno;
  onDelete: (id: number) => void;
};

export default function AlumnoCard({ alumno, onDelete }: Props) {

  const eliminarAlumno = async () => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://backend-organizador.vercel.app/alumnos/${alumno.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onDelete(alumno.id);
  };

  return (
    <div className="bg-violet-200 p-4 rounded-lg flex justify-between items-center">

      <div>
        {alumno.apellido}, {alumno.nombre}
      </div>

      <button
        onClick={eliminarAlumno}
        className="text-red-600 font-semibold"
      >
        Eliminar
      </button>

    </div>
  );
}